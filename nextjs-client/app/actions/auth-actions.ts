"use client";

/**
 * Auth Actions (Refactored)
 * 
 * 개선된 인증 시스템을 사용하는 액션 함수들
 */

import { authService, sessionManager, SESSION_TIMEOUT_MS } from '@/lib/auth';
import { ApiResponse } from '@/types';
import { LoginData } from '@/lib/auth/types';

/**
 * 세션 타임아웃 설정 (기존 코드 호환성)
 */
export const TIMEOUT_MS = SESSION_TIMEOUT_MS;

/**
 * 세션 설정 (기존 코드 호환성)
 */
export const setSession = (data: LoginData) => sessionManager.setSession(data);

/**
 * 세션 삭제 (기존 코드 호환성)
 */
export const clearSession = () => sessionManager.clearSession();

/**
 * 액세스 토큰 조회 (기존 코드 호환성)
 */
export const getAccessToken = () => sessionManager.getAccessToken();

/**
 * 리프레시 토큰 조회 (기존 코드 호환성)
 */
export const getRefreshToken = () => sessionManager.getRefreshToken();

/**
 * 토큰 업데이트 (기존 코드 호환성)
 */
export const updateAccessToken = (token: string, refreshToken?: string) =>
    sessionManager.updateTokens(token, refreshToken);

/**
 * 로그인
 */
export async function login(formData: FormData): Promise<ApiResponse<LoginData>> {
    return authService.loginWithFormData(formData);
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
    return authService.logout();
}

/**
 * 로그인 상태 확인
 */
export function isAuthenticated(): boolean {
    return authService.isAuthenticated();
}

/**
 * 현재 사용자 정보
 */
export function getCurrentUser() {
    return authService.getCurrentUser();
}

/**
 * 세션 남은 시간 (밀리초)
 */
export function getRemainingTime(): number {
    return sessionManager.getRemainingTime();
}

/**
 * 세션 남은 시간 (분)
 */
export function getRemainingMinutes(): number {
    return Math.floor(sessionManager.getRemainingTime() / 60000);
}
