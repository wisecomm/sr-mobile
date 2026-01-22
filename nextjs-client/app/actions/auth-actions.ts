"use server";

import { cookies } from 'next/headers';
import { ApiResponse } from '@/types';
import { LoginData } from '@/lib/auth/types';

const API_URL = 'http://localhost:8080';
const COOKIE_ACCESS_TOKEN = 'accessToken';
const COOKIE_REFRESH_TOKEN = 'refreshToken';
// Cookie options
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};

/**
 * Get tokens from cookies (Server Side)
 */
export async function getTokens() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(COOKIE_REFRESH_TOKEN)?.value;
    return { accessToken, refreshToken };
}

/**
 * Create session (Set cookies)
 */
export async function createSession(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();

    // Access Token: 1 day
    cookieStore.set(COOKIE_ACCESS_TOKEN, accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 24 * 60 * 60,
    });

    // Refresh Token: 7 days
    cookieStore.set(COOKIE_REFRESH_TOKEN, refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60,
    });
}

/**
 * Update access token only
 */
export async function updateAccessToken(token: string, refreshToken?: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_ACCESS_TOKEN, token, {
        ...COOKIE_OPTIONS,
        maxAge: 24 * 60 * 60,
    });

    if (refreshToken) {
        cookieStore.set(COOKIE_REFRESH_TOKEN, refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60,
        });
    }
}

/**
 * Delete session (Remove cookies)
 */
export async function deleteSession() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;

    if (accessToken) {
        try {
            // 서버 로그아웃 호출 (토큰 무효화/로그 기록)
            await fetch(`${API_URL}/api/v1/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store',
            });
        } catch (error) {
            console.error('Server logout failed:', error);
            // 서버 호출 실패해도 클라이언트 세션은 삭제 진행
        }
    }

    cookieStore.delete(COOKIE_ACCESS_TOKEN);
    cookieStore.delete(COOKIE_REFRESH_TOKEN);
}
export const logout = deleteSession; // Alias
export const clearSession = deleteSession; // Alias

/**
 * Login Action
 */
export async function login(formData: FormData): Promise<ApiResponse<LoginData>> {
    try {
        // Form Data to JSON
        const data = Object.fromEntries(formData.entries());

        const response = await fetch(`${API_URL}/api/v1/auth/login`, {
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
