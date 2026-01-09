/**
 * Base Resource Client
 * 
 * CRUD 작업을 위한 기본 클래스
 * 각 도메인의 API 클라이언트는 이 클래스를 상속받아 구현합니다.
 */

import { apiClient } from './api-client';
import { ApiResponse, PageResponse } from '@/types';

/**
 * 페이지네이션 파라미터
 */
export interface PaginationParams {
    page: number;
    size: number;
    [key: string]: string | number | boolean | undefined;
}

/**
 * 리소스 클라이언트 설정
 */
export interface ResourceClientConfig {
    baseUrl: string;
    resourceName?: string; // 에러 메시지에 사용
}

/**
 * 기본 CRUD 작업을 제공하는 리소스 클라이언트
 */
export class BaseResourceClient<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
    protected baseUrl: string;
    protected resourceName: string;

    constructor(config: ResourceClientConfig) {
        this.baseUrl = config.baseUrl;
        this.resourceName = config.resourceName || 'resource';
    }

    /**
     * 전체 목록 조회
     */
    async getList(): Promise<ApiResponse<T[]>> {
        return apiClient.get<T[]>(this.baseUrl);
    }

    /**
     * 페이지네이션된 목록 조회
     */
    async getPagedList(params: PaginationParams): Promise<ApiResponse<PageResponse<T>>> {
        const { page, size, ...filters } = params;
        
        const queryParams = {
            page: page + 1, // Backend expects 1-based page index
            size,
            ...filters,
        };

        const url = apiClient.buildUrl(this.baseUrl, queryParams);
        return apiClient.get<PageResponse<T>>(url);
    }

    /**
     * 단일 항목 조회
     */
    async getById(id: string): Promise<ApiResponse<T>> {
        return apiClient.get<T>(`${this.baseUrl}/${id}`);
    }

    /**
     * 새 항목 생성
     */
    async create(data: TCreate): Promise<ApiResponse<void>> {
        return apiClient.post<void>(this.baseUrl, data);
    }

    /**
     * 항목 수정
     */
    async update(id: string, data: TUpdate): Promise<ApiResponse<void>> {
        return apiClient.put<void>(`${this.baseUrl}/${id}`, data);
    }

    /**
     * 항목 부분 수정
     */
    async patch(id: string, data: Partial<TUpdate>): Promise<ApiResponse<void>> {
        return apiClient.patch<void>(`${this.baseUrl}/${id}`, data);
    }

    /**
     * 항목 삭제
     */
    async delete(id: string): Promise<ApiResponse<void>> {
        return apiClient.delete<void>(`${this.baseUrl}/${id}`);
    }

    /**
     * 여러 항목 삭제
     */
    async deleteMany(ids: string[]): Promise<ApiResponse<void>> {
        return apiClient.post<void>(`${this.baseUrl}/batch-delete`, { ids });
    }
}

/**
 * 클라이언트 사이드 페이지네이션을 위한 헬퍼
 * 백엔드가 페이지네이션을 지원하지 않는 경우 사용
 */
export function paginateClientSide<T>(
    items: T[],
    page: number,
    size: number
): PageResponse<T> {
    const total = items.length;
    const start = page * size;
    const end = start + size;
    const list = items.slice(start, end);

    return {
        list,
        total,
        pageNum: page + 1,
        pageSize: size,
        pages: Math.ceil(total / size),
    };
}

/**
 * 클라이언트 사이드 필터링 헬퍼
 */
export function filterItems<T>(
    items: T[],
    filters: Record<string, string | number | boolean>,
    searchableFields: (keyof T)[]
): T[] {
    return items.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value || value === '') return true;

            const field = key as keyof T;
            if (!searchableFields.includes(field)) return true;

            const itemValue = String(item[field]).toLowerCase();
            const searchValue = String(value).toLowerCase();

            return itemValue.includes(searchValue);
        });
    });
}
