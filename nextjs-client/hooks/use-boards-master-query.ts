/**
 * useBoardsMasterQuery - 게시판 마스터 API 훅
 */

import { boardMasterApi, BoardMaster, BoardMasterSearchParams } from '@/app/(admin)/(with-header)/boards/master/api';
import { PageResponse } from '@/types';
import { createPaginatedQuery, createMutation } from './query/factory';

/**
 * Query Keys
 */
export const boardsMasterKeys = {
    all: ['boardsMaster'] as const,
    lists: () => [...boardsMasterKeys.all, 'list'] as const,
    list: (params: BoardMasterSearchParams) => [...boardsMasterKeys.lists(), params] as const,
    detail: (id: string) => [...boardsMasterKeys.all, 'detail', id] as const,
};

/**
 * Queries
 */

// 게시판 마스터 목록 조회
export const useBoardsMasterList = createPaginatedQuery<
    PageResponse<BoardMaster>,
    BoardMasterSearchParams
>({
    queryKey: (params) => boardsMasterKeys.list(params),
    queryFn: (params) => boardMasterApi.search(params),
});

/**
 * Mutations
 */

// 게시판 마스터 생성
export const useCreateBoardsMaster = createMutation<void, Partial<BoardMaster>>({
    mutationFn: (data) => boardMasterApi.create(data),
    invalidateKeys: [boardsMasterKeys.all],
});

// 게시판 마스터 수정
export const useUpdateBoardsMaster = createMutation<void, { id: string; data: Partial<BoardMaster> }>({
    mutationFn: ({ id, data }) => boardMasterApi.update(id, data),
    invalidateKeys: [boardsMasterKeys.all],
});

// 게시판 마스터 삭제
export const useDeleteBoardsMaster = createMutation<void, string>({
    mutationFn: (id) => boardMasterApi.delete(id),
    invalidateKeys: [boardsMasterKeys.all],
});

// Re-export types
export type { BoardMaster, BoardMasterSearchParams } from '@/app/(admin)/(with-header)/boards/master/api';
