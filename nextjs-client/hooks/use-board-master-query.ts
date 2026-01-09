/**
 * Board Master Query Hooks (Refactored)
 * 
 * 표준화된 팩토리 함수를 사용하여 리팩토링
 */

import { boardMasterApi, BoardMaster, BoardMasterSearchParams } from '@/app/(admin)/(with-header)/boards/master/api';
import { PageResponse } from '@/types';
import { createPaginatedQuery, createMutation } from './query/factory';

/**
 * Query Keys
 */
export const boardMasterKeys = {
    all: ['boardMasters'] as const,
    lists: () => [...boardMasterKeys.all, 'list'] as const,
    list: (params: BoardMasterSearchParams) => [...boardMasterKeys.lists(), params] as const,
    detail: (id: string) => [...boardMasterKeys.all, 'detail', id] as const,
};

/**
 * Queries
 */

// 게시판 마스터 목록 조회
export const useBoardMasters = createPaginatedQuery<
    PageResponse<BoardMaster>,
    BoardMasterSearchParams
>({
    queryKey: (params) => boardMasterKeys.list(params),
    queryFn: (params) => boardMasterApi.search(params),
});

/**
 * Mutations
 */

// 게시판 마스터 생성
export const useCreateBoardMaster = createMutation<void, Partial<BoardMaster>>({
    mutationFn: (data) => boardMasterApi.create(data),
    invalidateKeys: [boardMasterKeys.all],
});

// 게시판 마스터 수정
export const useUpdateBoardMaster = createMutation<void, { id: string; data: Partial<BoardMaster> }>({
    mutationFn: ({ id, data }) => boardMasterApi.update(id, data),
    invalidateKeys: [boardMasterKeys.all],
});

// 게시판 마스터 삭제
export const useDeleteBoardMaster = createMutation<void, string>({
    mutationFn: (id) => boardMasterApi.delete(id),
    invalidateKeys: [boardMasterKeys.all],
});

// Re-export types for convenience
export type { BoardMaster, BoardMasterSearchParams } from '@/app/(admin)/(with-header)/boards/master/api';
