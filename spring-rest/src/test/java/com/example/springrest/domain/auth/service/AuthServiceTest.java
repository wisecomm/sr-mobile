package com.example.springrest.domain.auth.service;

import com.example.springrest.domain.auth.model.dto.LoginRequest;
import com.example.springrest.domain.auth.model.dto.LoginResponse;
import com.example.springrest.domain.auth.model.entity.AuthUser;
import com.example.springrest.domain.user.model.enums.UserRole;
import com.example.springrest.global.exception.AuthenticationException;
import com.example.springrest.global.security.JwtTokenProvider;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

/**
 * AuthService 단위 테스트
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService 테스트")
class AuthServiceTest {

    @Mock
    private UserDetailsProvider userDetailsProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private AuthUser testUser;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        testUser = AuthUser.builder()
                .userId("testuser")
                .userPwd("encodedPassword")
                .userName("테스트 사용자")
                .roles(List.of(UserRole.ROLE_USER))
                .build();

        loginRequest = LoginRequest.builder()
                .userId("testuser")
                .userPwd("password123")
                .build();
    }

    @Nested
    @DisplayName("로그인")
    class Login {

        @Test
        @DisplayName("로그인 성공")
        void login_Success() {
            // given
            given(userDetailsProvider.findByUserId("testuser")).willReturn(Optional.of(testUser));
            given(passwordEncoder.matches("password123", "encodedPassword")).willReturn(true);
            given(jwtTokenProvider.generateToken(eq("testuser"), any())).willReturn("access-token");
            given(jwtTokenProvider.generateRefreshToken("testuser")).willReturn("refresh-token");
            given(jwtTokenProvider.getExpirationMs()).willReturn(3600000L);

            // when
            LoginResponse result = authService.login(loginRequest, "127.0.0.1", "TestAgent");

            // then
            assertThat(result).isNotNull();
            assertThat(result.getToken()).isEqualTo("access-token");
            assertThat(result.getRefreshToken()).isEqualTo("refresh-token");
            assertThat(result.getTokenType()).isEqualTo("Bearer");
            assertThat(result.getUser()).isNotNull();
            assertThat(result.getUser().getUserId()).isEqualTo("testuser");
        }

        @Test
        @DisplayName("존재하지 않는 사용자 로그인 시 예외 발생")
        void login_UserNotFound() {
            // given
            given(userDetailsProvider.findByUserId("unknown")).willReturn(Optional.empty());
            LoginRequest invalidRequest = LoginRequest.builder()
                    .userId("unknown")
                    .userPwd("password")
                    .build();

            // when & then
            assertThatThrownBy(() -> authService.login(invalidRequest, "127.0.0.1", "TestAgent"))
                    .isInstanceOf(AuthenticationException.class)
                    .hasMessageContaining("Invalid User ID or password");
        }

        @Test
        @DisplayName("잘못된 비밀번호로 로그인 시 예외 발생")
        void login_WrongPassword() {
            // given
            given(userDetailsProvider.findByUserId("testuser")).willReturn(Optional.of(testUser));
            given(passwordEncoder.matches("wrongpassword", "encodedPassword")).willReturn(false);
            LoginRequest invalidRequest = LoginRequest.builder()
                    .userId("testuser")
                    .userPwd("wrongpassword")
                    .build();

            // when & then
            assertThatThrownBy(() -> authService.login(invalidRequest, "127.0.0.1", "TestAgent"))
                    .isInstanceOf(AuthenticationException.class)
                    .hasMessageContaining("Invalid User ID or password");
        }
    }

    @Nested
    @DisplayName("토큰 갱신")
    class RefreshToken {

        @Test
        @DisplayName("토큰 갱신 성공")
        void refreshToken_Success() {
            // given
            given(jwtTokenProvider.validateToken("valid-refresh-token")).willReturn(true);
            given(jwtTokenProvider.extractUserId("valid-refresh-token")).willReturn("testuser");
            given(userDetailsProvider.findByUserId("testuser")).willReturn(Optional.of(testUser));
            given(jwtTokenProvider.generateToken(eq("testuser"), any())).willReturn("new-access-token");
            given(jwtTokenProvider.generateRefreshToken("testuser")).willReturn("new-refresh-token");
            given(jwtTokenProvider.getExpirationMs()).willReturn(3600000L);

            // when
            LoginResponse result = authService.refreshToken("valid-refresh-token");

            // then
            assertThat(result).isNotNull();
            assertThat(result.getToken()).isEqualTo("new-access-token");
            assertThat(result.getRefreshToken()).isEqualTo("new-refresh-token");
        }

        @Test
        @DisplayName("유효하지 않은 리프레시 토큰으로 갱신 시 예외 발생")
        void refreshToken_InvalidToken() {
            // given
            given(jwtTokenProvider.validateToken("invalid-token")).willReturn(false);

            // when & then
            assertThatThrownBy(() -> authService.refreshToken("invalid-token"))
                    .isInstanceOf(JwtException.class)
                    .hasMessageContaining("Invalid refresh token");
        }

        @Test
        @DisplayName("토큰의 사용자가 존재하지 않으면 예외 발생")
        void refreshToken_UserNotFound() {
            // given
            given(jwtTokenProvider.validateToken("valid-token")).willReturn(true);
            given(jwtTokenProvider.extractUserId("valid-token")).willReturn("deleted-user");
            given(userDetailsProvider.findByUserId("deleted-user")).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> authService.refreshToken("valid-token"))
                    .isInstanceOf(JwtException.class)
                    .hasMessageContaining("User not found");
        }
    }
}
