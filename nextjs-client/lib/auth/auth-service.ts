/**
 * Auth Service
 * 
 * 인증 관련 비즈니스 로직을 처리하는 서비스
 */

import { apiClient } from '@/lib/api-client';
import { sessionManager } from './session-manager';
import { tokenService } from './token-service';
import { useAppStore } from '@/store/use-app-store';
import { ApiResponse, LoginData } from '@/types';

/**
 * 로그인 요청 데이터
 */
export interface LoginRequest {
    userId: string;
    userPwd: string;
}

/**
 * 로그아웃 옵션
 */
export interface LogoutOptions {
    redirect?: boolean;
    redirectUrl?: string;
}

/**
 * AuthService 클래스
 */
class AuthService {
    /**
     * 로그인
     */
    async login(credentials: LoginRequest): Promise<ApiResponse<LoginData>> {
        try {
            const response = await apiClient.post<LoginData>(
                '/v1/auth/login',
                credentials
            );

            // 로그인 성공 시 세션 저장
            if (response.code === '200' && response.data) {
                sessionManager.setSession(response.data);

                // Zustand 스토어에도 사용자 정보 저장
                if (typeof window !== 'undefined') {
                    useAppStore.getState().setUser(response.data.user);
                }

                console.log('[AuthService] Login successful');
            }

            return response;
        } catch (error) {
            console.error('[AuthService] Login error:', error);
            const message = error instanceof Error ? error.message : '로그인에 실패했습니다.';
            return {
                code: '500',
                message,
                data: null,
            };
        }
    }

    /**
     * 로그아웃
     */
    async logout(options: LogoutOptions = {}): Promise<void> {
        const { redirect = true, redirectUrl = '/login' } = options;

        try {
            // 서버에 로그아웃 요청 (선택적)
            // await apiClient.post('/v1/auth/logout');

            console.log('[AuthService] Logging out...');
        } catch (error) {
            console.error('[AuthService] Logout error:', error);
            // 에러가 있어도 로컬 세션은 삭제
        } finally {
            // 세션 삭제
            sessionManager.clearSession();

            // Zustand 스토어 클리어
            if (typeof window !== 'undefined') {
                useAppStore.getState().clearUser();
            }

            // 리다이렉트
            if (redirect && typeof window !== 'undefined') {
                window.location.href = redirectUrl;
            }
        }
    }

    /**
     * 로그인 상태 확인
     */
    isAuthenticated(): boolean {
        return sessionManager.isSessionValid();
    }

    /**
     * 현재 사용자 정보 조회
     */
    getCurrentUser() {
        return sessionManager.getUserInfo();
    }

    /**
     * 토큰 갱신
     */
    async refreshToken(): Promise<boolean> {
        const result = await tokenService.refreshToken();
        return result.success;
    }

    /**
     * 인증 실패 처리 (401 Unauthorized)
     */
    handleUnauthorized(): void {
        console.warn('[AuthService] Unauthorized access detected');

        // 세션 클리어
        sessionManager.clearSession();

        // Zustand 스토어 클리어
        if (typeof window !== 'undefined') {
            useAppStore.getState().clearUser();
            window.location.href = '/login';
        }
    }

    /**
     * FormData를 사용한 로그인 (기존 코드 호환성)
     */
    async loginWithFormData(formData: FormData): Promise<ApiResponse<LoginData>> {
        const userId = formData.get('userid') as string;
        const userPwd = formData.get('password') as string;

        return this.login({ userId, userPwd });
    }
}

/**
 * 싱글톤 인스턴스
 */
export const authService = new AuthService();

/**
 * 기존 코드 호환성을 위한 함수들
 * @deprecated authService를 직접 사용하세요
 */
export const login = (formData: FormData) => authService.loginWithFormData(formData);
export const logout = () => authService.logout();
export const handleUnauthorized = () => authService.handleUnauthorized();
