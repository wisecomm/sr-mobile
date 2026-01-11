/**
 * Token Service
 * 
 * 토큰 갱신 및 인증 처리를 담당하는 서비스
 */

import { sessionManager } from './session-manager';
import { ApiResponse } from '@/types';
import { LoginData } from './types';

/**
 * 토큰 갱신 결과
 */
export interface TokenRefreshResult {
    success: boolean;
    token?: string;
    error?: string;
}

/**
 * TokenService 클래스
 */
class TokenService {
    private isRefreshing = false;
    private refreshPromise: Promise<TokenRefreshResult> | null = null;

    /**
     * 토큰 갱신
     * 동시 다발적인 갱신 요청을 하나로 통합
     */
    async refreshToken(): Promise<TokenRefreshResult> {
        // 이미 갱신 중이면 기존 Promise 반환
        if (this.isRefreshing && this.refreshPromise) {
            console.log('[TokenService] Token refresh already in progress, waiting...');
            return this.refreshPromise;
        }

        // 새로운 갱신 시작
        this.isRefreshing = true;
        this.refreshPromise = this.performTokenRefresh();

        try {
            const result = await this.refreshPromise;
            return result;
        } finally {
            this.isRefreshing = false;
            this.refreshPromise = null;
        }
    }

    /**
     * 실제 토큰 갱신 수행
     */
    private async performTokenRefresh(): Promise<TokenRefreshResult> {
        console.log('[TokenService] Attempting to refresh token...');

        const refreshToken = sessionManager.getRefreshToken();
        if (!refreshToken) {
            console.warn('[TokenService] No refresh token found');
            return {
                success: false,
                error: 'No refresh token available',
            };
        }

        try {
            const response = await fetch('/api/v1/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                console.error('[TokenService] Token refresh request failed:', response.status);
                return {
                    success: false,
                    error: `Refresh failed with status ${response.status}`,
                };
            }

            const apiResponse: ApiResponse<LoginData> = await response.json();

            if (apiResponse.code === '200' && apiResponse.data) {
                const { token, refreshToken: newRefreshToken } = apiResponse.data;

                // 새 토큰 저장
                sessionManager.updateTokens(token, newRefreshToken);

                console.log('[TokenService] Token refreshed successfully');
                return {
                    success: true,
                    token,
                };
            } else {
                console.error('[TokenService] Invalid response:', apiResponse.message);
                return {
                    success: false,
                    error: apiResponse.message,
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('[TokenService] Error during token refresh:', errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    /**
     * 토큰 유효성 검증 (선택적)
     */
    async validateToken(token: string): Promise<boolean> {
        try {
            const response = await fetch('/api/v1/auth/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            return response.ok;
        } catch (error) {
            console.error('[TokenService] Token validation failed:', error);
            return false;
        }
    }

    /**
     * 현재 갱신 중인지 확인
     */
    isCurrentlyRefreshing(): boolean {
        return this.isRefreshing;
    }
}

/**
 * 싱글톤 인스턴스
 */
export const tokenService = new TokenService();

/**
 * 기존 코드 호환성을 위한 함수
 * @deprecated tokenService.refreshToken()을 사용하세요
 */
export async function handleTokenRefresh(): Promise<string | null> {
    const result = await tokenService.refreshToken();
    return result.success ? result.token || null : null;
}
