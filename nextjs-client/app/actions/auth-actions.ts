"use server";

import { ApiResponse } from '@/types';
import { LoginData } from '@/lib/auth/types';
import {
    getTokensFromCookies,
    setSessionCookies,
    clearSessionCookies,
} from '@/lib/auth/cookie-utils';

// Backend API URL (Use directly, consistent with route.ts)
const API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080/api';

/**
 * Get tokens from cookies (Server Side)
 */
export async function getTokens() {
    return getTokensFromCookies();
}

/**
 * Create session (Set cookies)
 */
export async function createSession(accessToken: string, refreshToken: string) {
    return setSessionCookies(accessToken, refreshToken);
}

/**
 * Delete session (Remove cookies)
 */
export async function deleteSession() {
    const { accessToken } = await getTokensFromCookies();

    if (accessToken) {
        try {
            // 서버 로그아웃 호출 (토큰 무효화/로그 기록)
            // [Standardized] Base URL ends with /api, so we append /v1/...
            await fetch(`${API_URL}/v1/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store',
            });
        } catch (error) {
            console.error('Server logout failed:', error);
        }
    }

    await clearSessionCookies();
}
export const logout = deleteSession;
export const clearSession = deleteSession;

/**
 * Login Action
 */
export async function login(formData: FormData): Promise<ApiResponse<LoginData>> {
    try {
        // Form Data to JSON
        const data = Object.fromEntries(formData.entries());

        const response = await fetch(`${API_URL}/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            cache: 'no-store',
        });

        const result: ApiResponse<LoginData> = await response.json();

        if (result.code === '200' && result.data) {
            await createSession(result.data.token, result.data.refreshToken);
        }

        return result;
    } catch (error) {
        console.error('Login Error:', error);
        return {
            code: '500',
            message: 'Login failed due to server error',
            data: null
        };
    }
}

// Deprecated/Unused client-side exports kept for type safety if needed, 
// but functionality is moved to server.
export async function isAuthenticated() {
    const { accessToken } = await getTokens();
    return !!accessToken;
}
