/**
 * User API + Query Hooks
 *
 * 사용자 API 클라이언트와 React Query 훅 통합
 */

import { apiClient } from '@/lib/api-client';
import { ApiResponse, PageResponse } from '@/types';
import { UserDetail } from '../types';
import { createPaginatedQuery, createMutation } from '@/hooks/query/factory';

/**
 * 사용자 검색 파라미터
 */
export interface UserSearchParams {
    page: number;
    size: number;
    userName?: string;
    startDate?: string;
    endDate?: string;
    sort?: string[];
    [key: string]: unknown;
}

/**
 * API 함수들
 */
const BASE_URL = '/v1/mgmt/users';

const userApi = {
    search: (params: UserSearchParams): Promise<ApiResponse<PageResponse<UserDetail>>> => {
        const queryParams: Record<string, string | number | string[]> = {
            page: params.page + 1,
            size: params.size,
        };
        if (params.userName) queryParams.userName = params.userName;
        if (params.startDate) queryParams.startDate = params.startDate;
        if (params.endDate) queryParams.endDate = params.endDate;
        if (params.sort) queryParams.sort = params.sort;

        return apiClient.get<PageResponse<UserDetail>>(BASE_URL, queryParams);
    },

    getById: (id: string): Promise<ApiResponse<UserDetail>> => {
        return apiClient.get<UserDetail>(`${BASE_URL}/${id}`);
    },

    create: (data: Partial<UserDetail>): Promise<ApiResponse<UserDetail>> => {
        return apiClient.post<UserDetail>(BASE_URL, data);
    },

    update: (id: string, data: Partial<UserDetail>): Promise<ApiResponse<UserDetail>> => {
        return apiClient.put<UserDetail>(`${BASE_URL}/${id}`, data);
    },

    delete: (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<void>(`${BASE_URL}/${id}`);
    },

    getRoles: (userId: string): Promise<ApiResponse<string[]>> => {
        return apiClient.get<string[]>(`${BASE_URL}/${userId}/roles`);
    },

    assignRoles: (userId: string, roleIds: string[]): Promise<ApiResponse<void>> => {
        return apiClient.post<void>(`${BASE_URL}/assign-roles`, { userId, roleIds });
    },
};

/**
 * Query Keys
 */
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (page: number, size: number, userName?: string, startDate?: string, endDate?: string, sort?: string[]) =>
        [...userKeys.lists(), { page, size, userName, startDate, endDate, sort }] as const,
    detail: (id: string) => [...userKeys.all, 'detail', id] as const,
    roles: (id: string) => [...userKeys.detail(id), 'roles'] as const,
};

/**
 * Queries
 */

// 사용자 목록 조회
export const useUsers = createPaginatedQuery<
    PageResponse<UserDetail>,
    { page: number; size: number; userName?: string; startDate?: string; endDate?: string; sort?: string[] }
>({
    queryKey: (params) => userKeys.list(params.page, params.size, params.userName, params.startDate, params.endDate, params.sort),
    queryFn: (params) => userApi.search(params),
});

// 사용자 역할 목록 조회
export const useUserRoles = createPaginatedQuery<
    string[],
    { userId: string }
>({
    queryKey: (params) => userKeys.roles(params.userId),
    queryFn: (params) => userApi.getRoles(params.userId),
    enabled: (params) => !!params.userId,
    placeholderData: false,
});

/**
 * Mutations
 */

// 사용자 생성
export const useCreateUser = createMutation<UserDetail, Partial<UserDetail>>({
    mutationFn: (data) => userApi.create(data),
    invalidateKeys: [userKeys.all],
});

// 사용자 수정
export const useUpdateUser = createMutation<UserDetail, { id: string; data: Partial<UserDetail> }>({
    mutationFn: ({ id, data }) => userApi.update(id, data),
    invalidateKeys: [userKeys.all],
});

// 사용자 삭제
export const useDeleteUser = createMutation<void, string>({
    mutationFn: (id) => userApi.delete(id),
    invalidateKeys: [userKeys.all],
});

// 사용자 역할 부여
export const useAssignUserRoles = createMutation<void, { userId: string; roleIds: string[] }>({
    mutationFn: ({ userId, roleIds }) => userApi.assignRoles(userId, roleIds),
    invalidateKeys: [userKeys.all],
});
