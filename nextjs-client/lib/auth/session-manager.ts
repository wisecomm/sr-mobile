/**
 * Session Manager
 * 
 * 세션 및 토큰 관리를 위한 중앙화된 클래스
 * localStorage 직접 접근을 캡슐화하고 타입 안전성을 제공합니다.
 */

import { LoginData, UserInfo } from './types';

/**
 * 세션 스토리지 키 정의
 */
const SESSION_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_INFO: 'userInfo',
    LAST_ACTIVE: 'lastActive',
} as const;

/**
 * 세션 타임아웃 설정 (30분)
 */
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * 세션 데이터 타입
 */
export interface SessionData {
    accessToken: string;
    refreshToken: string;
    userInfo: UserInfo;
    lastActive: number;
}

/**
 * SessionManager 클래스
 * 
 * 세션 관리의 모든 책임을 담당합니다.
 */
class SessionManager {
    private isClient = typeof window !== 'undefined';

    /**
     * 전체 세션 데이터 설정
     */
    setSession(data: LoginData): void {
        if (!this.isClient) return;

        try {
            localStorage.setItem(SESSION_KEYS.ACCESS_TOKEN, data.token);
            localStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, data.refreshToken);
            localStorage.setItem(SESSION_KEYS.USER_INFO, JSON.stringify(data.user));
            this.updateLastActivity();
        } catch (error) {
            console.error('[SessionManager] Failed to set session:', error);
        }
    }

    /**
     * 세션 완전 삭제
     */
    clearSession(): void {
        if (!this.isClient) return;

        try {
            Object.values(SESSION_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.error('[SessionManager] Failed to clear session:', error);
        }
    }

    /**
     * 액세스 토큰 조회
     * 세션 타임아웃 체크 포함
     */
    getAccessToken(): string | null {
        if (!this.isClient) return null;

        // 세션 타임아웃 체크
        if (this.isSessionExpired()) {
            console.warn('[SessionManager] Session expired');
            this.clearSession();
            return null;
        }

        return this.getItem(SESSION_KEYS.ACCESS_TOKEN);
    }

    /**
     * 리프레시 토큰 조회
     */
    getRefreshToken(): string | null {
        if (!this.isClient) return null;
        return this.getItem(SESSION_KEYS.REFRESH_TOKEN);
    }

    /**
     * 사용자 정보 조회
     */
    getUserInfo(): UserInfo | null {
        if (!this.isClient) return null;

        const userInfoStr = this.getItem(SESSION_KEYS.USER_INFO);
        if (!userInfoStr) return null;

        try {
            return JSON.parse(userInfoStr) as UserInfo;
        } catch (error) {
            console.error('[SessionManager] Failed to parse user info:', error);
            return null;
        }
    }

    /**
     * 토큰 업데이트 (토큰 갱신 시 사용)
     */
    updateTokens(accessToken: string, refreshToken?: string): void {
        if (!this.isClient) return;

        try {
            localStorage.setItem(SESSION_KEYS.ACCESS_TOKEN, accessToken);
            if (refreshToken) {
                localStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, refreshToken);
            }
            this.updateLastActivity();
        } catch (error) {
            console.error('[SessionManager] Failed to update tokens:', error);
        }
    }

    /**
     * 마지막 활동 시간 업데이트
     */
    updateLastActivity(): void {
        if (!this.isClient) return;

        try {
            localStorage.setItem(SESSION_KEYS.LAST_ACTIVE, Date.now().toString());
        } catch (error) {
            console.error('[SessionManager] Failed to update activity:', error);
        }
    }

    /**
     * 마지막 활동 시간 조회
     */
    getLastActivity(): number | null {
        if (!this.isClient) return null;

        const lastActive = this.getItem(SESSION_KEYS.LAST_ACTIVE);
        if (!lastActive) return null;

        const timestamp = parseInt(lastActive, 10);
        return isNaN(timestamp) ? null : timestamp;
    }

    /**
     * 세션 타임아웃 여부 확인
     */
    isSessionExpired(): boolean {
        const lastActive = this.getLastActivity();
        if (!lastActive) return false;

        const inactiveTime = Date.now() - lastActive;
        return inactiveTime > SESSION_TIMEOUT_MS;
    }

    /**
     * 세션 유효성 확인
     */
    isSessionValid(): boolean {
        return !this.isSessionExpired() && this.getAccessToken() !== null;
    }

    /**
     * 전체 세션 데이터 조회
     */
    getSessionData(): SessionData | null {
        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();
        const userInfo = this.getUserInfo();
        const lastActive = this.getLastActivity();

        if (!accessToken || !refreshToken || !userInfo || !lastActive) {
            return null;
        }

        return {
            accessToken,
            refreshToken,
            userInfo,
            lastActive,
        };
    }

    /**
     * 남은 세션 시간 (밀리초)
     */
    getRemainingTime(): number {
        const lastActive = this.getLastActivity();
        if (!lastActive) return 0;

        const elapsed = Date.now() - lastActive;
        const remaining = SESSION_TIMEOUT_MS - elapsed;

        return Math.max(0, remaining);
    }

    /**
     * localStorage 아이템 조회 헬퍼
     */
    private getItem(key: string): string | null {
        if (!this.isClient) return null;

        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error(`[SessionManager] Failed to get item ${key}:`, error);
            return null;
        }
    }
}

/**
 * 싱글톤 인스턴스 export
 */
export const sessionManager = new SessionManager();

/**
 * 기존 코드와의 호환성을 위한 함수들
 * @deprecated sessionManager 객체를 직접 사용하세요
 */
export const setSession = (data: LoginData) => sessionManager.setSession(data);
export const clearSession = () => sessionManager.clearSession();
export const getAccessToken = () => sessionManager.getAccessToken();
export const getRefreshToken = () => sessionManager.getRefreshToken();
export const updateAccessToken = (token: string, refreshToken?: string) =>
    sessionManager.updateTokens(token, refreshToken);
