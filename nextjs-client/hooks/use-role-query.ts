/**
 * Role Query Hooks (Refactored)
 * 
 * 표준화된 팩토리 함수를 사용하여 리팩토링
 */

import { roleApi } from '@/app/(admin)/(with-header)/roles/api';
import { RoleInfo, PageResponse } from '@/types';
import { createPaginatedQuery, createMutation } from './query/factory';

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
export const useCreateRole = createMutation<void, Partial<RoleInfo>>({
    mutationFn: (data) => roleApi.create(data),
    invalidateKeys: [roleKeys.all],
});

// 역할 수정
export const useUpdateRole = createMutation<void, { id: string; data: Partial<RoleInfo> }>({
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
