/**
 * Board Post Query Hooks (Refactored)
 * 
 * 표준화된 팩토리 함수를 사용하여 리팩토링
 */

import { boardPostApi, Board, BoardPostSearchParams } from '@/app/(admin)/(with-header)/boards/board/api';
import { PageResponse } from '@/types';
import { createPaginatedQuery, createQuery, createMutation } from './query/factory';

/**
 * Query Keys
 */
export const boardPostKeys = {
    all: ['boardPosts'] as const,
    lists: () => [...boardPostKeys.all, 'list'] as const,
    list: (params: BoardPostSearchParams) => [...boardPostKeys.lists(), params] as const,
    detail: (id: number) => [...boardPostKeys.all, 'detail', id] as const,
};

/**
 * Queries
 */

// 게시물 목록 조회
export const useBoardPosts = createPaginatedQuery<
    PageResponse<Board>,
    BoardPostSearchParams
>({
    queryKey: (params) => boardPostKeys.list(params),
    queryFn: (params) => boardPostApi.search(params),
    enabled: (params) => !!params.brdId,
});

// 게시물 상세 조회
export const useBoardPost = createQuery<Board, number | undefined>({
    queryKey: (boardId) => boardPostKeys.detail(boardId!),
    queryFn: (boardId) => boardPostApi.getByIdNumber(boardId!),
    enabled: (boardId) => !!boardId,
});

/**
 * Mutations
 */

// 게시물 생성 (파일 업로드 지원)
export const useCreateBoardPost = createMutation<void, FormData>({
    mutationFn: (formData) => boardPostApi.createWithFiles(formData),
    invalidateKeys: [boardPostKeys.all],
});

// 게시물 수정 (파일 업로드 지원)
export const useUpdateBoardPost = createMutation<void, { id: number; data: FormData }>({
    mutationFn: ({ id, data }) => boardPostApi.updateWithFiles(id, data),
    invalidateKeys: [boardPostKeys.all],
});

// 게시물 삭제
export const useDeleteBoardPost = createMutation<void, number>({
    mutationFn: (id) => boardPostApi.deleteById(id),
    invalidateKeys: [boardPostKeys.all],
});

// Re-export types for convenience
export type { Board, BoardPostSearchParams, BoardFile } from '@/app/(admin)/(with-header)/boards/board/api';
