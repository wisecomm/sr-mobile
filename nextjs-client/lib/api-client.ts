/**
 * API Client Layer
 * 
 * 중앙화된 API 호출 및 에러 처리를 제공합니다.
 * 모든 API 요청은 이 레이어를 통해 처리되어야 합니다.
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosInstance } from 'axios';
import { ApiResponse } from '@/types';
import { getAccessToken, getRefreshToken, updateAccessToken, logout } from '@/app/actions/auth-actions';

/**
 * 토큰 갱신 상태 관리 (중복 갱신 방지)
 */
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * 토큰 갱신 함수 (싱글톤 패턴)
 */
async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || '/api'}/v1/auth/refresh`,
            { refreshToken }
        );

        const newToken = response.data?.data?.accessToken;
        if (newToken) {
            updateAccessToken(newToken);
            return newToken;
        }
        return null;
    } catch (error) {
        console.error('[API] Token refresh failed:', error);
        return null;
    }
}

/**
 * Axios 인스턴스 생성
 */
const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request Interceptor - 토큰 추가
    instance.interceptors.request.use(
        (config) => {
            const token = getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor - 토큰 갱신 및 에러 처리
    instance.interceptors.response.use(
        (response) => response.data,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

            // 401 에러 시 토큰 갱신 시도
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                // 이미 갱신 중이면 기존 Promise 재사용
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshPromise = refreshAccessToken();
                }

                try {
                    const newToken = await refreshPromise;

                    if (newToken) {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        }
                        return instance(originalRequest);
                    }

                    logout();
                    return Promise.reject(error);
                } finally {
                    isRefreshing = false;
                    refreshPromise = null;
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

const api = createAxiosInstance();

/**
 * API 에러 정보를 추출하는 헬퍼 함수
 */
function extractErrorMessage(error: unknown, defaultMessage: string): string {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        return axiosError.response?.data?.message || axiosError.message || defaultMessage;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return defaultMessage;
}

/**
 * API 응답을 표준화된 ApiResponse 형태로 변환
 */
function createErrorResponse<T>(error: unknown, defaultMessage: string): ApiResponse<T> {
    const message = extractErrorMessage(error, defaultMessage);

    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const code = status ? status.toString() : '500';
        return { code, message, data: null };
    }

    return { code: '500', message, data: null };
}

/**
 * API 요청을 래핑하여 일관된 에러 처리 제공
 */
async function handleRequest<T>(
    request: () => Promise<ApiResponse<T>>,
    errorMessage: string
): Promise<ApiResponse<T>> {
    try {
        return await request();
    } catch (error) {
        console.error(`[API Error]: ${errorMessage}`, error);
        return createErrorResponse<T>(error, errorMessage);
    }
}

/**
 * API Client 클래스
 */
class ApiClient {
    /**
     * GET 요청
     */
    async get<T>(
        url: string,
        params?: Record<string, string | number | boolean | undefined>,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        return handleRequest(
            () => api.get(url, { ...config, params }),
            `Failed to GET ${url}`
        );
    }

    /**
     * POST 요청
     */
    async post<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        return handleRequest(
            () => api.post(url, data, config),
            `Failed to POST ${url}`
        );
    }

    /**
     * PUT 요청
     */
    async put<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        return handleRequest(
            () => api.put(url, data, config),
            `Failed to PUT ${url}`
        );
    }

    /**
     * PATCH 요청
     */
    async patch<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        return handleRequest(
            () => api.patch(url, data, config),
            `Failed to PATCH ${url}`
        );
    }

    /**
     * DELETE 요청
     */
    async delete<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        return handleRequest(
            () => api.delete(url, config),
            `Failed to DELETE ${url}`
        );
    }

    /**
     * 파라미터를 URLSearchParams로 변환
     */
    buildParams(params: Record<string, string | number | boolean | undefined>): URLSearchParams {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });

        return searchParams;
    }

    /**
     * URL에 쿼리 파라미터를 추가
     */
    buildUrl(baseUrl: string, params?: Record<string, string | number | boolean | undefined>): string {
        if (!params || Object.keys(params).length === 0) {
            return baseUrl;
        }

        const searchParams = this.buildParams(params);
        const queryString = searchParams.toString();

        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    }
}

/**
 * 싱글톤 인스턴스 export
 */
export const apiClient = new ApiClient();

/**
 * Raw axios 인스턴스 (특수한 경우에만 사용)
 */
export { api };

/**
 * 기존 코드와의 호환성을 위한 개별 함수들
 * @deprecated apiClient 객체를 직접 사용하세요
 */
export const apiGet = <T>(url: string, params?: Record<string, string | number | boolean | undefined>) =>
    apiClient.get<T>(url, params);

export const apiPost = <T>(url: string, data?: unknown) =>
    apiClient.post<T>(url, data);

export const apiPut = <T>(url: string, data?: unknown) =>
    apiClient.put<T>(url, data);

export const apiPatch = <T>(url: string, data?: unknown) =>
    apiClient.patch<T>(url, data);

export const apiDelete = <T>(url: string) =>
    apiClient.delete<T>(url);
