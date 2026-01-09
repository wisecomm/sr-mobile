/**
 * Menu Query Hooks (Refactored)
 * 
 * 표준화된 팩토리 함수를 사용하여 리팩토링
 */

import { menuApi } from '@/app/(admin)/(with-header)/menus/api';
import { MenuInfo } from '@/types';
import { createQuery, createMutation } from './query/factory';

/**
 * Query Keys
 */
export const menuKeys = {
    all: ['menus'] as const,
    lists: () => [...menuKeys.all, 'list'] as const,
    my: () => [...menuKeys.all, 'my'] as const,
    detail: (id: string) => [...menuKeys.all, 'detail', id] as const,
};

/**
 * Queries
 */

// 전체 메뉴 목록 조회
export const useMenus = createQuery<MenuInfo[], void>({
    queryKey: () => menuKeys.lists(),
    queryFn: () => menuApi.getList(),
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
export const useCreateMenu = createMutation<void, Partial<MenuInfo>>({
    mutationFn: (data) => menuApi.create(data),
    invalidateKeys: [menuKeys.all],
});

// 메뉴 수정
export const useUpdateMenu = createMutation<void, { id: string; data: Partial<MenuInfo> }>({
    mutationFn: ({ id, data }) => menuApi.update(id, data),
    invalidateKeys: [menuKeys.all],
});

// 메뉴 삭제
export const useDeleteMenu = createMutation<void, string>({
    mutationFn: (id) => menuApi.delete(id),
    invalidateKeys: [menuKeys.all],
});
