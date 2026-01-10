/**
 * Role API + Query Hooks
 *
 * 역할 API 클라이언트와 React Query 훅 통합
 */

import { apiClient } from '@/lib/api-client';
import { RoleInfo, ApiResponse, PageResponse } from '@/types';
import { createPaginatedQuery, createMutation } from './query/factory';

/**
 * 역할 검색 파라미터
 */
export interface RoleSearchParams {
    page: number;
    size: number;
    searchId?: string;
}

/**
 * API 함수들
 */
const BASE_URL = '/v1/mgmt/roles';

const roleApi = {
    search: (params: RoleSearchParams): Promise<ApiResponse<PageResponse<RoleInfo>>> => {
        const queryParams: Record<string, string | number> = {
            page: params.page + 1,
            size: params.size,
        };
        if (params.searchId) queryParams.searchId = params.searchId;

        return apiClient.get<PageResponse<RoleInfo>>(BASE_URL, queryParams);
    },

    getById: (id: string): Promise<ApiResponse<RoleInfo>> => {
        return apiClient.get<RoleInfo>(`${BASE_URL}/${id}`);
    },

    create: (data: Partial<RoleInfo>): Promise<ApiResponse<RoleInfo>> => {
        return apiClient.post<RoleInfo>(BASE_URL, data);
    },

    update: (id: string, data: Partial<RoleInfo>): Promise<ApiResponse<RoleInfo>> => {
        return apiClient.put<RoleInfo>(`${BASE_URL}/${id}`, data);
    },

    delete: (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<void>(`${BASE_URL}/${id}`);
    },

    getMenus: (roleId: string): Promise<ApiResponse<string[]>> => {
        return apiClient.get<string[]>(`${BASE_URL}/${roleId}/menus`);
    },

    assignMenus: (roleId: string, menuIds: string[]): Promise<ApiResponse<void>> => {
        return apiClient.post<void>(`${BASE_URL}/assign-menus`, { roleId, menuIds });
    },
};

/**
 * Query Keys
 */
export const roleKeys = {
    all: ['roles'] as const,
    lists: () => [...roleKeys.all, 'list'] as const,
    list: (page: number, size: number, searchId?: string) =>
        [...roleKeys.lists(), { page, size, searchId }] as const,
    detail: (id: string) => [...roleKeys.all, 'detail', id] as const,
    menus: (id: string) => [...roleKeys.detail(id), 'menus'] as const,
};

/**
 * Queries
 */

// 역할 목록 조회
export const useRoles = createPaginatedQuery<
    PageResponse<RoleInfo>,
    { page: number; size: number; searchId?: string }
>({
    queryKey: (params) => roleKeys.list(params.page, params.size, params.searchId),
    queryFn: (params) => roleApi.search(params),
});

// 역할 메뉴 목록 조회
export const useRoleMenus = createPaginatedQuery<
    string[],
    { roleId: string }
>({
    queryKey: (params) => roleKeys.menus(params.roleId),
    queryFn: (params) => roleApi.getMenus(params.roleId),
    enabled: (params) => !!params.roleId,
    placeholderData: false,
});

/**
 * Mutations
 */

// 역할 생성
export const useCreateRole = createMutation<RoleInfo, Partial<RoleInfo>>({
    mutationFn: (data) => roleApi.create(data),
    invalidateKeys: [roleKeys.all],
});

// 역할 수정
export const useUpdateRole = createMutation<RoleInfo, { id: string; data: Partial<RoleInfo> }>({
    mutationFn: ({ id, data }) => roleApi.update(id, data),
    invalidateKeys: [roleKeys.all],
});

// 역할 삭제
export const useDeleteRole = createMutation<void, string>({
    mutationFn: (id) => roleApi.delete(id),
    invalidateKeys: [roleKeys.all],
});

// 역할 메뉴 부여
export const useAssignRoleMenus = createMutation<void, { roleId: string; menuIds: string[] }>({
    mutationFn: ({ roleId, menuIds }) => roleApi.assignMenus(roleId, menuIds),
    invalidateKeys: [roleKeys.all],
});
