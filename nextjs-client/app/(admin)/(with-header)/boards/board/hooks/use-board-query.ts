/**
 * BoardsBoard API + Query Hooks
 *
 * 게시물 API 클라이언트와 React Query 훅 통합
 */

import { apiClient, api } from '@/lib/api-client';
import { ApiResponse, PageResponse } from '@/types';
import { createPaginatedQuery, createQuery, createMutation } from '@/hooks/query/factory';

import { BoardsBoard, BoardsBoardSearchParams } from '../types';


/**
 * API 함수들
 */
const BASE_URL = '/v1/boards/board';

export const boardsBoardApi = {
    search: (params: BoardsBoardSearchParams): Promise<ApiResponse<PageResponse<BoardsBoard>>> => {
        const queryParams: Record<string, string | number | string[]> = {
            page: params.page + 1,
            size: params.size,
            brdId: params.brdId,
        };
        if (params.searchType) queryParams.searchType = params.searchType;
        if (params.keyword) queryParams.keyword = params.keyword;
        if (params.startDate) queryParams.startDate = params.startDate;
        if (params.endDate) queryParams.endDate = params.endDate;
        if (params.sort) queryParams.sort = params.sort;

        return apiClient.get<PageResponse<BoardsBoard>>(BASE_URL, queryParams);
    },

    getById: (id: number): Promise<ApiResponse<BoardsBoard>> => {
        return apiClient.get<BoardsBoard>(`${BASE_URL}/${id}`);
    },

    createWithFiles: (formData: FormData): Promise<ApiResponse<void>> => {
        return apiClient.post<void>(BASE_URL, formData);
    },

    updateWithFiles: (id: number, formData: FormData): Promise<ApiResponse<void>> => {
        return apiClient.put<void>(`${BASE_URL}/${id}`, formData);
    },

    delete: (id: number): Promise<ApiResponse<void>> => {
        return apiClient.delete<void>(`${BASE_URL}/${id}`);
    },

    downloadFile: async (fileId: number, fileName: string): Promise<void> => {
        if (typeof window === 'undefined') return;

        try {
            const response = await api.get(`${BASE_URL}/files/${fileId}/download`, {
                responseType: 'blob',
            });

            const blob = response as unknown as Blob;

            // 에러 응답 (JSON)인 경우 처리
            if (blob.type === 'application/json') {
                const text = await blob.text();
                const errorResponse = JSON.parse(text);
                throw new Error(errorResponse.message || '파일 다운로드에 실패했습니다.');
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: unknown) {
            console.error('File download failed:', error);
            // 에러 메시지 추출 및 전파
            const errorMessage = error instanceof Error ? error.message : '파일 다운로드 중 오류가 발생했습니다.';
            throw new Error(errorMessage);
        }
    },
};

/**
 * Query Keys
 */
export const boardsBoardKeys = {
    all: ['boardsBoard'] as const,
    lists: () => [...boardsBoardKeys.all, 'list'] as const,
    list: (params: BoardsBoardSearchParams) => [...boardsBoardKeys.lists(), params] as const,
    detail: (id: number) => [...boardsBoardKeys.all, 'detail', id] as const,
};

/**
 * Queries
 */

// 게시물 목록 조회
export const useBoardsBoardList = createPaginatedQuery<
    PageResponse<BoardsBoard>,
    BoardsBoardSearchParams
>({
    queryKey: (params) => boardsBoardKeys.list(params),
    queryFn: (params) => boardsBoardApi.search(params),
    enabled: (params) => !!params.brdId,
});

// 게시물 상세 조회
export const useBoardsBoardDetail = createQuery<BoardsBoard, number | undefined>({
    queryKey: (boardId) => boardsBoardKeys.detail(boardId!),
    queryFn: (boardId) => boardsBoardApi.getById(boardId!),
    enabled: (boardId) => !!boardId,
});

/**
 * Mutations
 */

// 게시물 생성
export const useCreateBoardsBoard = createMutation<void, FormData>({
    mutationFn: (formData) => boardsBoardApi.createWithFiles(formData),
    invalidateKeys: [boardsBoardKeys.all],
});

// 게시물 수정
export const useUpdateBoardsBoard = createMutation<void, { id: number; data: FormData }>({
    mutationFn: ({ id, data }) => boardsBoardApi.updateWithFiles(id, data),
    invalidateKeys: [boardsBoardKeys.all],
});

// 게시물 삭제
export const useDeleteBoardsBoard = createMutation<void, number>({
    mutationFn: (id) => boardsBoardApi.delete(id),
    invalidateKeys: [boardsBoardKeys.all],
});
