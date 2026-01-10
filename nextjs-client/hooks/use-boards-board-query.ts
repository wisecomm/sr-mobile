/**
 * BoardPost API + Query Hooks
 *
 * 게시물 API 클라이언트와 React Query 훅 통합
 */

import { apiClient, api } from '@/lib/api-client';
import { ApiResponse, PageResponse } from '@/types';
import { createPaginatedQuery, createQuery, createMutation } from './query/factory';

/**
 * 게시물 첨부파일 타입
 */
export interface BoardFile {
    fileId: number;
    boardId: number;
    filePath: string;
    orgFileNm: string;
    fileSize: number;
    fileExt: string;
}

/**
 * 게시물 타입
 */
export interface Board {
    boardId: number;
    brdId: string;
    userId: string;
    title: string;
    contents?: string;
    hitCnt: number;
    secretYn: string;
    useYn: string;
    sysInsertDtm?: string;
    sysInsertUserId?: string;
    sysUpdateDtm?: string;
    sysUpdateUserId?: string;
    fileList?: BoardFile[];
}

/**
 * 게시물 검색 파라미터
 */
export interface BoardPostSearchParams {
    page: number;
    size: number;
    brdId: string;
    searchType?: string;
    keyword?: string;
    startDate?: string;
    endDate?: string;
    [key: string]: unknown;
}

/**
 * API 함수들
 */
const BASE_URL = '/v1/boards/board';

export const boardPostApi = {
    search: (params: BoardPostSearchParams): Promise<ApiResponse<PageResponse<Board>>> => {
        const queryParams: Record<string, string | number> = {
            page: params.page + 1,
            size: params.size,
            brdId: params.brdId,
        };
        if (params.searchType) queryParams.searchType = params.searchType;
        if (params.keyword) queryParams.keyword = params.keyword;
        if (params.startDate) queryParams.startDate = params.startDate;
        if (params.endDate) queryParams.endDate = params.endDate;

        return apiClient.get<PageResponse<Board>>(BASE_URL, queryParams);
    },

    getById: (id: number): Promise<ApiResponse<Board>> => {
        return apiClient.get<Board>(`${BASE_URL}/${id}`);
    },

    createWithFiles: (formData: FormData): Promise<ApiResponse<void>> => {
        return apiClient.post<void>(BASE_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    updateWithFiles: (id: number, formData: FormData): Promise<ApiResponse<void>> => {
        return apiClient.put<void>(`${BASE_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    delete: (id: number): Promise<ApiResponse<void>> => {
        return apiClient.delete<void>(`${BASE_URL}/${id}`);
    },

    downloadFile: async (fileId: number, fileName: string): Promise<void> => {
        try {
            const response = await api.get(`${BASE_URL}/files/${fileId}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response as unknown as Blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: unknown) {
            console.error('File download failed:', error);
            throw new Error('파일 다운로드에 실패했습니다.');
        }
    },
};

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
    queryFn: (boardId) => boardPostApi.getById(boardId!),
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
    mutationFn: (id) => boardPostApi.delete(id),
    invalidateKeys: [boardsBoardKeys.all],
});
