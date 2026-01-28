import { NextRequest, NextResponse } from 'next/server';
import {
    getTokensFromCookies,
    setSessionCookies,
    clearSessionCookies,
} from '@/lib/auth/cookie-utils';

// Backend API URL from environment variable
export const API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080/api';

async function proxyRequest(request: NextRequest, path: string) {
    // Read tokens from HttpOnly Cookies
    const { accessToken } = await getTokensFromCookies();

    // 1. 요청 URL 재구성
    const targetUrl = `${API_URL}/${path}${request.nextUrl.search}`;
    console.log(`[Proxy] Forwarding to: ${targetUrl}`);

    // 2. 헤더 설정
    const headers = new Headers(request.headers);

    // Hop-by-hop 헤더 및 문제 발생 가능한 헤더 제거
    const hopByHopHeaders = [
        'host',
        'connection',
        'keep-alive',
        'proxy-authenticate',
        'proxy-authorization',
        'te',
        'trailer',
        'transfer-encoding',
        'upgrade',
        'content-length' // Fetch가 자동으로 설정하므로 제거
    ];

    hopByHopHeaders.forEach(header => headers.delete(header));

    // Inject Authorization header from Server-Side Cookie
    // Inject Authorization header from Server-Side Cookie
    if (accessToken) {
        console.log(`[Proxy] Access Token found: ${accessToken.substring(0, 15)}... (len: ${accessToken.length})`);
        headers.set('Authorization', `Bearer ${accessToken}`);

        // 헤더 확인용 로그
        const authHeader = headers.get('Authorization');
        console.log(`[Proxy] Authorization header set: ${authHeader ? 'Yes' : 'No'} (${authHeader?.substring(0, 20)}...)`);
    } else {
        console.warn('[Proxy] No Access Token found in cookies. Headers:', JSON.stringify(Object.fromEntries(headers.entries())));
    }

    // 3. 요청 본문 처리
    const body = request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.blob()
        : undefined;

    try {
        console.log(`[Proxy] Sending request to ${targetUrl}`);
        const response = await fetch(targetUrl, {
            method: request.method,
            headers,
            body,
            cache: 'no-store',
        });

        console.log(`[Proxy] Response status: ${response.status}`);

        // 4. 토큰 만료 처리 (401)
        if (response.status === 401) {
            console.log('[Proxy] Received 401. Attempting refresh...');
            return await handleTokenRefresh(request, path);
        }

        // 응답 헤더 필터링
        const responseHeaders = new Headers();
        response.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (!['content-length', 'content-encoding', 'transfer-encoding', 'connection'].includes(lowerKey)) {
                responseHeaders.set(key, value);
            }
        });

        // Ensure Content-Type is preserved or set to application/json if missing
        if (!responseHeaders.has('content-type')) {
            responseHeaders.set('content-type', 'application/json');
        }

        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });

    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json(
            { code: '500', message: 'Internal Server Error', data: null },
            { status: 500 }
        );
    }
}

async function handleTokenRefresh(originalRequest: NextRequest, path: string) {
    const { refreshToken } = await getTokensFromCookies();

    if (!refreshToken) {
        return NextResponse.json({ code: '401', message: 'Unauthorized', data: null }, { status: 401 });
    }

    try {
        console.log('[Proxy] Attempting token refresh...');

        // 1. 토큰 갱신 요청 (Backend로)
        const refreshResponse = await fetch(`${API_URL}/v1/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
            throw new Error('Refresh failed');
        }

        const responseData = await refreshResponse.json();
        // Extract tokens from nested 'data' structure if standard ApiResponse
        const newAccessToken = responseData.data?.token || responseData.accessToken;
        const newRefreshToken = responseData.data?.refreshToken || responseData.refreshToken || refreshToken;

        if (!newAccessToken) {
            throw new Error('Invalid refresh response');
        }

        // 2. 쿠키 갱신
        await setSessionCookies(newAccessToken, newRefreshToken);

        // 3. 원래 요청 재시도
        const targetUrl = `${API_URL}/${path}${originalRequest.nextUrl.search}`;
        const headers = new Headers(originalRequest.headers);
        headers.delete('host');
        headers.set('Authorization', `Bearer ${newAccessToken}`);

        const body = originalRequest.method !== 'GET' && originalRequest.method !== 'HEAD'
            ? await originalRequest.blob()
            : undefined;

        const retryResponse = await fetch(targetUrl, {
            method: originalRequest.method,
            headers,
            body,
            cache: 'no-store',
        });

        const retryResponseHeaders = new Headers();
        retryResponse.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            if (!['content-length', 'content-encoding', 'transfer-encoding', 'connection'].includes(lowerKey)) {
                retryResponseHeaders.set(key, value);
            }
        });

        return new NextResponse(retryResponse.body, {
            status: retryResponse.status,
            statusText: retryResponse.statusText,
            headers: retryResponseHeaders,
        });

    } catch (error) {
        console.error('Token Refresh Error:', error);
        // 리프레시 실패 시 쿠키 삭제 및 401 반환
        await clearSessionCookies();
        return NextResponse.json({ code: '401', message: 'Session expired', data: null }, { status: 401 });
    }
}

// Method Handlers
export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join('/'));
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join('/'));
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join('/'));
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join('/'));
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join('/'));
}
