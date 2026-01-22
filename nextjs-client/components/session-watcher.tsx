"use client";

/**
 * Session Manager Component (Refactored)
 * 
 * 개선된 세션 관리 시스템을 사용하는 컴포넌트
 */

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { sessionManager } from '@/lib/auth/session-manager';
import { authService } from '@/lib/auth/auth-service';

export function SessionWatcher() {
    const pathname = usePathname();
    const lastActivityRef = useRef<number>(0);

    /**
     * 세션 상태 체크
     */
    const checkSession = useCallback(() => {
        const isValid = sessionManager.isSessionValid();

        // [Debug] 세션 유효성 상태 로깅 (필요시 주석 처리)
        // console.log('[SessionWatcher] Is session valid?', isValid);

        // 세션이 유효하지 않으면 로그인 페이지로 이동
        if (!isValid) {
            console.warn('[SessionWatcher] Session invalid or expired, redirecting to login. isValid:', isValid);
            authService.handleUnauthorized();
        }
        return isValid;
    }, []);

    /**
     * 사용자 활동 감지 시 활동 시간 업데이트
     * 성능 최적화를 위해 쓰로틀링 적용 (1초)
     */
    const handleActivity = useCallback(() => {
        const now = Date.now();
        // 1초(1000ms) 내에 다시 호출되면 무시
        if (now - lastActivityRef.current < 1000) {
            return;
        }

        if (checkSession()) {
            sessionManager.updateLastActivity();
            lastActivityRef.current = now;
        }
    }, [checkSession]);

    /**
     * 주기적 세션 체크 및 활동 감지
     */
    useEffect(() => {
        // 활동 감지 이벤트 (mousemove 추가)
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

        // 이벤트 리스너 등록 options: { passive: true } 성능 최적화
        const listenerOptions = { passive: true };

        events.forEach((event) => {
            window.addEventListener(event, handleActivity, listenerOptions);
        });

        // 초기 상태 체크
        checkSession();

        // 1분마다 세션 상태 체크 (타임아웃 확인용)
        // 활동이 없어도 타임아웃 체크는 돌아야 함
        const checkInterval = setInterval(checkSession, 5 * 1000);

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
            clearInterval(checkInterval);
        };
    }, [pathname, handleActivity, checkSession]);

    return null;
}
