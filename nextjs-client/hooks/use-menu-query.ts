/**
 * Menu Query Hooks (Refactored)
 *
 * 표준화된 팩토리 함수를 사용하여 리팩토링
 */

import { menuApi } from '@/app/(admin)/(with-header)/menus/api';
import { MenuInfo, PageResponse } from '@/types';
import { createQuery, createPaginatedQuery, createMutation } from './query/factory';

/**
 * Query Keys
 */
export const menuKeys = {
    all: ['menus'] as const,
    lists: () => [...menuKeys.all, 'list'] as const,
    list: (page: number, size: number, searchId?: string) =>
        [...menuKeys.lists(), { page, size, searchId }] as const,
    my: () => [...menuKeys.all, 'my'] as const,
    detail: (id: string) => [...menuKeys.all, 'detail', id] as const,
};

/**
 * Queries
 */

// 전체 메뉴 목록 조회 (페이지네이션)
export const useMenus = createPaginatedQuery<
    PageResponse<MenuInfo>,
    { page: number; size: number; searchId?: string }
>({
    queryKey: (params) => menuKeys.list(params.page, params.size, params.searchId),
    queryFn: (params) => menuApi.search(params),
});

// 내 메뉴 목록 조회
export const useMyMenus = createQuery<MenuInfo[], void>({
    queryKey: () => menuKeys.my(),
    queryFn: () => menuApi.getMyMenus(),
});

/**
 * Mutations
 */

// 메뉴 생성
export const useCreateMenu = createMutation<MenuInfo, Partial<MenuInfo>>({
    mutationFn: (data) => menuApi.create(data),
    invalidateKeys: [menuKeys.all],
});

// 메뉴 수정
export const useUpdateMenu = createMutation<MenuInfo, { id: string; data: Partial<MenuInfo> }>({
    mutationFn: ({ id, data }) => menuApi.update(id, data),
    invalidateKeys: [menuKeys.all],
});

// 메뉴 삭제
export const useDeleteMenu = createMutation<void, string>({
    mutationFn: (id) => menuApi.delete(id),
    invalidateKeys: [menuKeys.all],
});
