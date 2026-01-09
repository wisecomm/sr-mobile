/**
 * User Query Hooks (Refactored)
 * 
 * 표준화된 팩토리 함수를 사용하여 리팩토링
 */

import { userApi } from '@/app/(admin)/(with-header)/users/api';
import { UserDetail, PageResponse } from '@/types';
import { createPaginatedQuery, createMutation } from './query/factory';

/**
 * Query Keys
 */
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (page: number, size: number, userName?: string, startDate?: string, endDate?: string) =>
        [...userKeys.lists(), { page, size, userName, startDate, endDate }] as const,
    detail: (id: string) => [...userKeys.all, 'detail', id] as const,
    roles: (id: string) => [...userKeys.detail(id), 'roles'] as const,
};

/**
 * Queries
 */

// 사용자 목록 조회
export const useUsers = createPaginatedQuery<
    PageResponse<UserDetail>,
    { page: number; size: number; userName?: string; startDate?: string; endDate?: string }
>({
    queryKey: (params) => userKeys.list(params.page, params.size, params.userName, params.startDate, params.endDate),
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
