/**
 * Axios Client (Refactored)
 * 
 * 개선된 인증 시스템과 통합된 Axios 클라이언트
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types';
import { sessionManager } from '@/lib/auth/session-manager';
import { tokenService } from '@/lib/auth/token-service';
import { authService } from '@/lib/auth/auth-service';

// 환경 변수 설정
const baseURL = '/api';

/**
 * Axios 인스턴스 생성
 */
const axiosClient: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * 요청 인터셉터: 토큰 자동 주입
 */
axiosClient.interceptors.request.use(
    (config) => {
        const token = sessionManager.getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * 확장된 요청 설정 인터페이스
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

/**
 * 실패한 요청 큐
 */
interface FailedRequest {
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
}

let failedQueue: FailedRequest[] = [];

/**
 * 실패한 요청 큐 처리
 */
const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

/**
 * 응답 인터셉터: 에러 처리 및 토큰 갱신
 */
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // 활동 시간 업데이트
        sessionManager.updateLastActivity();
        return response.data;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;
        const status = error.response?.status;

        // 401 Unauthorized 처리
        if (status === 401 && originalRequest && !originalRequest._retry) {
            // 이미 토큰 갱신 중이면 큐에 추가
            if (tokenService.isCurrentlyRefreshing()) {
                console.log('[AxiosClient] Token refresh in progress, queueing request:', originalRequest.url);
                
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            // 토큰 갱신 시작
            originalRequest._retry = true;
            console.warn('[AxiosClient] 401 Unauthorized - attempting token refresh');

            try {
                const result = await tokenService.refreshToken();

                if (result.success && result.token) {
                    console.log('[AxiosClient] Token refresh successful, retrying requests');
                    processQueue(null, result.token);

                    // 원래 요청 재시도
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${result.token}`;
                    }
                    return axiosClient(originalRequest);
                } else {
                    console.error('[AxiosClient] Token refresh failed:', result.error);
                    processQueue(new Error(result.error || 'Token refresh failed'), null);
                }
            } catch (refreshError) {
                console.error('[AxiosClient] Token refresh exception:', refreshError);
                processQueue(refreshError, null);
            }

            // 갱신 실패 시 로그아웃
            console.error('[AxiosClient] Authentication failed - logging out');
            authService.handleUnauthorized();
        }

        // 기타 에러 처리
        if (error.response) {
            const { status } = error.response;
            
            if (status === 403) {
                console.error('[AxiosClient] 403 Forbidden - insufficient permissions');
            }
            if (status >= 500) {
                console.error('[AxiosClient] Server error:', status);
            }
        } else if (error.request) {
            console.error('[AxiosClient] No response from server');
        }

        return Promise.reject(error);
    }
);

/**
 * API 요청 래퍼
 */
export const api = {
    get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
        return axiosClient.get(url, config);
    },

    post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
        return axiosClient.post(url, data, config);
    },

    put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
        return axiosClient.put(url, data, config);
    },

    patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
        return axiosClient.patch(url, data, config);
    },

    delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
        return axiosClient.delete(url, config);
    },
};

export default axiosClient;
