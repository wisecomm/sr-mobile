/**
 * 쿠키 관련 공통 유틸리티
 * Server Action과 Route Handler 모두에서 사용 가능
 *
 * 주의: "use server" 지시어가 없음 - 서버 사이드 전용 유틸리티
 */
import { cookies } from 'next/headers';

export const COOKIE_ACCESS_TOKEN = 'accessToken';
export const COOKIE_REFRESH_TOKEN = 'refreshToken';

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true' || (process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false'),
    sameSite: 'lax' as const,
    path: '/',
};

/**
 * 쿠키에서 토큰 읽기
 */
export async function getTokensFromCookies() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(COOKIE_REFRESH_TOKEN)?.value;
    return { accessToken, refreshToken };
}

/**
 * 쿠키에 세션 저장
 */
export async function setSessionCookies(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();

    // Access Token: 1일
    cookieStore.set(COOKIE_ACCESS_TOKEN, accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 24 * 60 * 60,
    });

    // Refresh Token: 7일
    cookieStore.set(COOKIE_REFRESH_TOKEN, refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60,
    });
}

/**
 * 쿠키에서 세션 삭제
 */
export async function clearSessionCookies() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_ACCESS_TOKEN);
    cookieStore.delete(COOKIE_REFRESH_TOKEN);
}
