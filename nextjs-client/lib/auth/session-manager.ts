/**
 * Session Manager
 * 
 * 세션 및 토큰 관리를 위한 중앙화된 클래스
 * localStorage 직접 접근을 캡슐화하고 타입 안전성을 제공합니다.
 * 
 * [Refactor Note]: HttpOnly Cookie 기반 인증으로 전환됨에 따라
 * 클라이언트 측에서의 토큰 저장(localStorage) 로직이 제거되었습니다.
 */

import { LoginData, UserInfo } from './types';

/**
 * 세션 스토리지 키 정의
 */
const SESSION_KEYS = {
    USER_INFO: 'userInfo',
    LAST_ACTIVE: 'lastActive',
    SAVED_ID: 'savedId',
} as const;

/**
 * 세션 타임아웃 설정
 * 환경 변수에서 시간을 가져오거나 기본값(30분) 사용
 */
const TIMEOUT_ENV = process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MS;
export const SESSION_TIMEOUT_MS = TIMEOUT_ENV ? parseInt(TIMEOUT_ENV, 10) : 30 * 60 * 1000;

/**
 * 세션 데이터 타입
 */
export interface SessionData {
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
            // 토큰은 HttpOnly 쿠키로 관리되므로 localStorage에 저장하지 않음
            if (data.user) localStorage.setItem(SESSION_KEYS.USER_INFO, JSON.stringify(data.user));
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
                // 저장된 아이디는 세션 삭제 시에도 유지되어야 함
                if (key !== SESSION_KEYS.SAVED_ID) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('[SessionManager] Failed to clear session:', error);
        }
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
        return !this.isSessionExpired();
    }

    /**
     * 전체 세션 데이터 조회
     */
    getSessionData(): SessionData | null {
        const userInfo = this.getUserInfo();
        const lastActive = this.getLastActivity();

        if (!userInfo || !lastActive) {
            return null;
        }

        return {
            userInfo,
            lastActive,
        };
    }

    /**
     * 아이디 저장
     */
    setSavedId(id: string): void {
        if (!this.isClient) return;
        try {
            localStorage.setItem(SESSION_KEYS.SAVED_ID, id);
        } catch (error) {
            console.error('[SessionManager] Failed to save id:', error);
        }
    }

    /**
     * 저장된 아이디 조회
     */
    getSavedId(): string | null {
        return this.getItem(SESSION_KEYS.SAVED_ID);
    }

    /**
     * 저장된 아이디 삭제
     */
    clearSavedId(): void {
        if (!this.isClient) return;
        try {
            localStorage.removeItem(SESSION_KEYS.SAVED_ID);
        } catch (error) {
            console.error('[SessionManager] Failed to clear saved id:', error);
        }
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


