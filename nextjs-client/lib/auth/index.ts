/**
 * Auth Module Export
 * 
 * 인증 관련 모든 기능을 중앙에서 export
 */

export { sessionManager, SESSION_TIMEOUT_MS } from './session-manager';
export type { SessionData } from './session-manager';

export { tokenService } from './token-service';
export type { TokenRefreshResult } from './token-service';

export { authService } from './auth-service';
export type { LoginRequest, LogoutOptions } from './auth-service';

export * from './types';

// 기존 코드 호환성을 위한 re-export
export {
    setSession,
    clearSession,
    getAccessToken,
    getRefreshToken,
    updateAccessToken,
} from './session-manager';

export { handleTokenRefresh } from './token-service';

export { login, logout, handleUnauthorized } from './auth-service';
