/**
 * Auth Service
 * 
 * 인증 관련 비즈니스 로직을 처리하는 서비스
 */

import { apiClient } from '@/lib/api-client';
import { sessionManager } from './session-manager';

import { ApiResponse } from '@/types';
import { LoginData } from './types';

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

import { logout as logoutAction } from '@/app/actions/auth-actions';

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
            console.log('[AuthService] Logging out...');
            // 서버 쿠키 삭제 (Server Action)
            await logoutAction();
        } catch (error) {
            console.error('[AuthService] Logout error:', error);
            // 에러가 있어도 로컬 세션은 삭제
        } finally {
            // 세션 삭제
            sessionManager.clearSession();

            // [Add] Android Bridge Logout
            if (typeof window !== 'undefined' && window.AndroidBridge) {
                try {
                    window.AndroidBridge.logout();
                    console.log('[AuthService] Android Bridge logout called');
                } catch (e) {
                    console.error('[AuthService] Android Bridge logout failed', e);
                }
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
     * Note: HttpOnly 쿠키 기반에서는 프록시가 401 시 자동 갱신함
     * 이 메소드는 명시적 갱신이 필요한 경우에만 사용
     */
    async refreshToken(): Promise<boolean> {
        try {
            await apiClient.post('/v1/auth/refresh');
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 인증 실패 처리 (401 Unauthorized)
     */
    async handleUnauthorized(redirect: boolean = true): Promise<void> {
        console.warn('[AuthService] Unauthorized access detected');

        try {
            // 서버 쿠키 삭제 (Server Action)
            await logoutAction();
        } catch (error) {
            console.error('[AuthService] Failed to clear server cookies:', error);
        }

        // 세션 클리어
        sessionManager.clearSession();

        if (typeof window !== 'undefined' && redirect) {
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


