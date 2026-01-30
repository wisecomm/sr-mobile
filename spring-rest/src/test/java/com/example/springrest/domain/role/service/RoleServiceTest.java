package com.example.springrest.domain.role.service;

import com.example.springrest.domain.role.model.dto.RoleInfoRequest;
import com.example.springrest.domain.role.model.dto.RoleInfoResponse;
import com.example.springrest.domain.role.model.entity.RoleInfo;
import com.example.springrest.domain.role.model.entity.RoleMenuMap;
import com.example.springrest.domain.role.model.mapper.RoleDtoMapper;
import com.example.springrest.domain.role.repository.RoleInfoMapper;
import com.example.springrest.domain.role.repository.RoleMenuMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;

/**
 * RoleService 단위 테스트
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("RoleService 테스트")
class RoleServiceTest {

    @Mock
    private RoleInfoMapper roleInfoMapper;

    @Mock
    private RoleMenuMapper roleMenuMapper;

    @Mock
    private RoleDtoMapper roleDtoMapper;

    private RoleService roleService;

    private RoleInfo testRole;
    private RoleInfoRequest testRequest;
    private RoleInfoResponse testResponse;

    @BeforeEach
    void setUp() {
        // Manually create RoleService and inject mocks
        roleService = new RoleService(roleInfoMapper, roleMenuMapper, roleDtoMapper);

        testRole = RoleInfo.builder()
                .roleId("ROLE_USER")
                .roleName("일반 사용자")
                .roleDesc("일반 사용자 권한")
                .useYn("1")
                .build();

        testRequest = RoleInfoRequest.builder()
                .roleId("ROLE_USER")
                .roleName("일반 사용자")
                .roleDesc("일반 사용자 권한")
                .useYn("1")
                .build();

        testResponse = RoleInfoResponse.builder()
                .roleId("ROLE_USER")
                .roleName("일반 사용자")
                .roleDesc("일반 사용자 권한")
                .useYn("1")
                .build();
    }

    @Nested
    @DisplayName("역할 조회")
    class GetRoles {

        @Test
        @DisplayName("전체 역할 조회 성공")
        void getAllRoles_Success() {
            // given
            given(roleInfoMapper.findAll()).willReturn(List.of(testRole));
            given(roleDtoMapper.toResponseList(List.of(testRole))).willReturn(List.of(testResponse));

            // when
            List<RoleInfoResponse> result = roleService.getAllRoles();

            // then
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getRoleId()).isEqualTo("ROLE_USER");
        }

        @Test
        @DisplayName("역할 ID로 조회 성공")
        void getRoleById_Success() {
            // given
            given(roleInfoMapper.findById("ROLE_USER")).willReturn(testRole);
            given(roleDtoMapper.toResponse(testRole)).willReturn(testResponse);

            // when
            RoleInfoResponse result = roleService.getRoleById("ROLE_USER");

            // then
            assertThat(result).isNotNull();
            assertThat(result.getRoleId()).isEqualTo("ROLE_USER");
            assertThat(result.getRoleName()).isEqualTo("일반 사용자");
        }

        @Test
        @DisplayName("존재하지 않는 역할 조회시 null 반환")
        void getRoleById_NotFound() {
            // given
            given(roleInfoMapper.findById("INVALID")).willReturn(null);

            // when
            RoleInfoResponse result = roleService.getRoleById("INVALID");

            // then
            assertThat(result).isNull();
        }
    }

    @Nested
    @DisplayName("역할 생성")
    class CreateRole {

        @Test
        @DisplayName("역할 생성 성공")
        void createRole_Success() {
            // given
            given(roleDtoMapper.toEntity(testRequest)).willReturn(testRole);
            given(roleInfoMapper.insert(any(RoleInfo.class))).willReturn(1);

            // when
            assertThatCode(() -> roleService.createRole(testRequest))
                    .doesNotThrowAnyException();

            // then
            then(roleInfoMapper).should().insert(any(RoleInfo.class));
        }
    }

    @Nested
    @DisplayName("역할 수정")
    class UpdateRole {

        @Test
        @DisplayName("역할 수정 성공")
        void updateRole_Success() {
            // given
            given(roleDtoMapper.toEntity(testRequest)).willReturn(testRole);
            given(roleInfoMapper.update(any(RoleInfo.class))).willReturn(1);

            // when
            assertThatCode(() -> roleService.updateRole(testRequest))
                    .doesNotThrowAnyException();

            // then
            then(roleInfoMapper).should().update(any(RoleInfo.class));
        }
    }

    @Nested
    @DisplayName("역할 삭제")
    class DeleteRole {

        @Test
        @DisplayName("역할 삭제 성공")
        void deleteRole_Success() {
            // given
            given(roleMenuMapper.deleteByRoleId("ROLE_USER")).willReturn(1);
            given(roleInfoMapper.delete("ROLE_USER")).willReturn(1);

            // when
            assertThatCode(() -> roleService.deleteRole("ROLE_USER"))
                    .doesNotThrowAnyException();

            // then
            then(roleMenuMapper).should().deleteByRoleId("ROLE_USER");
            then(roleInfoMapper).should().delete("ROLE_USER");
        }
    }

    @Nested
    @DisplayName("메뉴 할당")
    class AssignMenus {

        @Test
        @DisplayName("메뉴 할당 성공")
        void assignMenus_Success() {
            // given
            List<String> menuIds = List.of("MENU001", "MENU002");
            given(roleMenuMapper.deleteByRoleId("ROLE_USER")).willReturn(1);
            given(roleMenuMapper.insert(any(RoleMenuMap.class))).willReturn(1);

            // when
            assertThatCode(() -> roleService.assignMenus("ROLE_USER", menuIds))
                    .doesNotThrowAnyException();

            // then
            then(roleMenuMapper).should().deleteByRoleId("ROLE_USER");
            then(roleMenuMapper).should(times(2)).insert(any(RoleMenuMap.class));
        }

        @Test
        @DisplayName("역할별 메뉴 ID 목록 조회")
        void getMenuIdsByRoleId_Success() {
            // given
            RoleMenuMap menuMap1 = RoleMenuMap.builder().roleId("ROLE_USER").menuId("MENU001").build();
            RoleMenuMap menuMap2 = RoleMenuMap.builder().roleId("ROLE_USER").menuId("MENU002").build();
            given(roleMenuMapper.findByRoleId("ROLE_USER")).willReturn(List.of(menuMap1, menuMap2));

            // when
            List<String> result = roleService.getMenuIdsByRoleId("ROLE_USER");

            // then
            assertThat(result).hasSize(2);
            assertThat(result).containsExactlyInAnyOrder("MENU001", "MENU002");
        }
    }
}
