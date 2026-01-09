"use client";

/**
 * Session Manager Component (Refactored)
 * 
 * 개선된 세션 관리 시스템을 사용하는 컴포넌트
 */

import { useEffect, useCallback, useState, useRef } from 'react';
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
    
    // 경고 표시 여부 추적 (중복 알림 방지)
    const warningShownRef = useRef(false);

    /**
     * 사용자 활동 감지 시 활동 시간 업데이트
     */
    const handleActivity = useCallback(() => {
        if (sessionManager.isSessionValid()) {
            sessionManager.updateLastActivity();
        }
    }, []);

    /**
     * 세션 상태 체크 및 업데이트
     */
    useEffect(() => {
        const checkSession = () => {
            const isValid = sessionManager.isSessionValid();
            const remainingMs = sessionManager.getRemainingTime();
            const remainingMinutes = Math.floor(remainingMs / 60000);

            setSessionState({ isValid, remainingMinutes });

            // 세션이 만료되었고 로그인 페이지가 아니면 로그아웃
            if (!isValid && pathname !== '/login' && pathname !== '/') {
                console.warn('[SessionManager] Session expired, redirecting to login');
                authService.handleUnauthorized();
            }

            // 세션 만료 경고 (5분 전)
            if (remainingMinutes === 5 && !warningShownRef.current) {
                warningShownRef.current = true;
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
            
            // 5분이 아니면 경고 플래그 리셋
            if (remainingMinutes !== 5) {
                warningShownRef.current = false;
            }
        };

        // 활동 감지 이벤트
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

        events.forEach((event) => {
            window.addEventListener(event, handleActivity);
        });

        // 초기 상태 체크
        checkSession();

        // 1분마다 세션 상태 체크
        const checkInterval = setInterval(checkSession, 60 * 1000);

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
    }, [pathname, handleActivity]);

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
