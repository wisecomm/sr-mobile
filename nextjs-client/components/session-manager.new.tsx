"use client";

/**
 * Session Manager Component (Refactored)
 * 
 * 개선된 세션 관리 시스템을 사용하는 컴포넌트
 */

import { useEffect, useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import { sessionManager } from '@/lib/auth/session-manager';
import { authService } from '@/lib/auth/auth-service';

/**
 * 세션 상태
 */
interface SessionState {
    isValid: boolean;
    remainingMinutes: number;
}

export function SessionManager() {
    const pathname = usePathname();
    const [sessionState, setSessionState] = useState<SessionState>({
        isValid: false,
        remainingMinutes: 0,
    });

    /**
     * 세션 상태 업데이트
     */
    const updateSessionState = useCallback(() => {
        const isValid = sessionManager.isSessionValid();
        const remainingMs = sessionManager.getRemainingTime();
        const remainingMinutes = Math.floor(remainingMs / 60000);

        setSessionState({ isValid, remainingMinutes });

        // 세션이 만료되었고 로그인 페이지가 아니면 로그아웃
        if (!isValid && pathname !== '/login' && pathname !== '/') {
            console.warn('[SessionManager] Session expired, redirecting to login');
            authService.handleUnauthorized();
        }

        return { isValid, remainingMinutes };
    }, [pathname]);

    /**
     * 사용자 활동 감지 시 활동 시간 업데이트
     */
    const handleActivity = useCallback(() => {
        if (sessionManager.isSessionValid()) {
            sessionManager.updateLastActivity();
        }
    }, []);

    /**
     * 세션 만료 경고 (5분 전)
     */
    const checkSessionWarning = useCallback(() => {
        const { remainingMinutes } = updateSessionState();

        if (remainingMinutes === 5 && remainingMinutes > 0) {
            console.warn('[SessionManager] Session will expire in 5 minutes');
            
            // 사용자에게 알림 표시 (선택적)
            if (typeof window !== 'undefined' && 'Notification' in window) {
                if (Notification.permission === 'granted') {
                    new Notification('세션 만료 경고', {
                        body: '5분 후 자동으로 로그아웃됩니다.',
                        icon: '/favicon.ico',
                    });
                }
            }
        }
    }, [updateSessionState]);

    /**
     * 컴포넌트 마운트 시 설정
     */
    useEffect(() => {
        // 활동 감지 이벤트
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

        events.forEach((event) => {
            window.addEventListener(event, handleActivity);
        });

        // 1분마다 세션 상태 체크
        const checkInterval = setInterval(() => {
            checkSessionWarning();
        }, 60 * 1000);

        // 초기 상태 업데이트
        updateSessionState();

        // 알림 권한 요청 (선택적)
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
            clearInterval(checkInterval);
        };
    }, [handleActivity, checkSessionWarning, updateSessionState]);

    /**
     * 개발 환경에서 세션 상태 표시 (선택적)
     */
    if (process.env.NODE_ENV === 'development' && sessionState.isValid) {
        return (
            <div 
                className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50"
                style={{ pointerEvents: 'none' }}
            >
                <div>세션 남은 시간: {sessionState.remainingMinutes}분</div>
            </div>
        );
    }

    return null;
}
