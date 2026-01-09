/**
 * useAuth Hook
 * 
 * React 컴포넌트에서 인증 기능을 쉽게 사용할 수 있는 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth/auth-service';
import { sessionManager } from '@/lib/auth/session-manager';
import { UserInfo, ApiResponse, LoginData } from '@/types';

/**
 * Auth 상태
 */
interface AuthState {
    isAuthenticated: boolean;
    user: UserInfo | null;
    isLoading: boolean;
    remainingMinutes: number;
}

/**
 * 로그인 옵션
 */
interface LoginOptions {
    redirectTo?: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

/**
 * useAuth Hook
 */
export function useAuth() {
    const router = useRouter();
    const [state, setState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        isLoading: true,
        remainingMinutes: 0,
    });

    /**
     * 상태 업데이트
     */
    const updateAuthState = useCallback(() => {
        const isAuthenticated = authService.isAuthenticated();
        const user = authService.getCurrentUser();
        const remainingMs = sessionManager.getRemainingTime();
        const remainingMinutes = Math.floor(remainingMs / 60000);

        setState({
            isAuthenticated,
            user,
            isLoading: false,
            remainingMinutes,
        });
    }, []);

    /**
     * 로그인
     */
    const login = useCallback(
        async (
            userId: string,
            userPwd: string,
            options?: LoginOptions
        ): Promise<ApiResponse<LoginData>> => {
            setState((prev) => ({ ...prev, isLoading: true }));

            try {
                const response = await authService.login({ userId, userPwd });

                if (response.code === '200' && response.data) {
                    updateAuthState();
                    options?.onSuccess?.();

                    // 리다이렉트
                    if (options?.redirectTo) {
                        router.push(options.redirectTo);
                    }
                } else {
                    options?.onError?.(response.message);
                }

                return response;
            } catch (error) {
                const message = error instanceof Error ? error.message : '로그인 실패';
                options?.onError?.(message);
                return {
                    code: '500',
                    message,
                    data: null,
                };
            } finally {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        },
        [router, updateAuthState]
    );

    /**
     * 로그아웃
     */
    const logout = useCallback(async (redirectTo: string = '/login') => {
        setState((prev) => ({ ...prev, isLoading: true }));

        await authService.logout({
            redirect: true,
            redirectUrl: redirectTo,
        });

        updateAuthState();
    }, [updateAuthState]);

    /**
     * 토큰 갱신
     */
    const refreshToken = useCallback(async () => {
        const success = await authService.refreshToken();
        if (success) {
            updateAuthState();
        }
        return success;
    }, [updateAuthState]);

    /**
     * 초기화 및 상태 모니터링
     */
    useEffect(() => {
        updateAuthState();

        // 1분마다 상태 업데이트
        const interval = setInterval(updateAuthState, 60000);

        return () => clearInterval(interval);
    }, [updateAuthState]);

    return {
        ...state,
        login,
        logout,
        refreshToken,
        updateAuthState,
    };
}

/**
 * 보호된 페이지를 위한 Hook
 */
export function useRequireAuth(redirectTo: string = '/login') {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, isLoading, router, redirectTo]);

    return { isAuthenticated, isLoading };
}

/**
 * 게스트 전용 페이지를 위한 Hook (로그인 페이지 등)
 */
export function useRequireGuest(redirectTo: string = '/') {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, isLoading, router, redirectTo]);

    return { isAuthenticated, isLoading };
}
