/**
 * useBoardsBoardQuery - 게시물 API 훅
 */

import { boardPostApi, Board, BoardPostSearchParams } from '@/app/(admin)/(with-header)/boards/board/api';
import { PageResponse } from '@/types';
import { createPaginatedQuery, createQuery, createMutation } from './query/factory';

/**
 * Query Keys
 */
export const boardsBoardKeys = {
    all: ['boardsBoard'] as const,
    lists: () => [...boardsBoardKeys.all, 'list'] as const,
    list: (params: BoardPostSearchParams) => [...boardsBoardKeys.lists(), params] as const,
    detail: (id: number) => [...boardsBoardKeys.all, 'detail', id] as const,
};

/**
 * Queries
 */

// 게시물 목록 조회
export const useBoardsBoardList = createPaginatedQuery<
    PageResponse<Board>,
    BoardPostSearchParams
>({
    queryKey: (params) => boardsBoardKeys.list(params),
    queryFn: (params) => boardPostApi.search(params),
    enabled: (params) => !!params.brdId,
});

// 게시물 상세 조회
export const useBoardsBoardDetail = createQuery<Board, number | undefined>({
    queryKey: (boardId) => boardsBoardKeys.detail(boardId!),
    queryFn: (boardId) => boardPostApi.getByIdNumber(boardId!),
    enabled: (boardId) => !!boardId,
});

/**
 * Mutations
 */

// 게시물 생성
export const useCreateBoardsBoard = createMutation<void, FormData>({
    mutationFn: (formData) => boardPostApi.createWithFiles(formData),
    invalidateKeys: [boardsBoardKeys.all],
});

// 게시물 수정
export const useUpdateBoardsBoard = createMutation<void, { id: number; data: FormData }>({
    mutationFn: ({ id, data }) => boardPostApi.updateWithFiles(id, data),
    invalidateKeys: [boardsBoardKeys.all],
});

// 게시물 삭제
export const useDeleteBoardsBoard = createMutation<void, number>({
    mutationFn: (id) => boardPostApi.deleteById(id),
    invalidateKeys: [boardsBoardKeys.all],
});

// Re-export types
export type { Board, BoardPostSearchParams, BoardFile } from '@/app/(admin)/(with-header)/boards/board/api';
