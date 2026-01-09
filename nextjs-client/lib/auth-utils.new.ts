"use client";

/**
 * Auth Utils (Refactored)
 * 
 * 개선된 인증 시스템을 사용하는 유틸리티 함수들
 */

import { tokenService } from '@/lib/auth/token-service';
import { authService } from '@/lib/auth/auth-service';
import { sessionManager, SESSION_TIMEOUT_MS } from '@/lib/auth/session-manager';

/**
 * 토큰 갱신 처리
 * @deprecated tokenService.refreshToken()을 직접 사용하세요
 */
export async function handleTokenRefresh(): Promise<string | null> {
    const result = await tokenService.refreshToken();
    return result.success ? result.token || null : null;
}

/**
 * 인증 실패 처리 (401 Unauthorized)
 * @deprecated authService.handleUnauthorized()를 직접 사용하세요
 */
export function handleUnauthorized(): void {
    authService.handleUnauthorized();
}

/**
 * 활동 시간 업데이트
 * @deprecated sessionManager.updateLastActivity()를 직접 사용하세요
 */
export const updateActivity = () => {
    sessionManager.updateLastActivity();
};

/**
 * 세션 타임아웃 체크
 * @deprecated sessionManager.isSessionExpired()를 직접 사용하세요
 */
export const checkSessionTimeout = (): boolean => {
    return sessionManager.isSessionExpired();
};

/**
 * 타임아웃 설정 (기존 코드 호환성)
 * @deprecated SESSION_TIMEOUT_MS를 직접 사용하세요
 */
export const TIMEOUT_MS = SESSION_TIMEOUT_MS;
