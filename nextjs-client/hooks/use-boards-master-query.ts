/**
 * BoardMaster API + Query Hooks
 *
 * 게시판 마스터 API 클라이언트와 React Query 훅 통합
 */

import { apiClient } from '@/lib/api-client';
import { ApiResponse, PageResponse } from '@/types';
import { createPaginatedQuery, createQuery, createMutation } from './query/factory';

/**
 * 게시판 마스터 타입
 */
export interface BoardMaster {
    brdId: string;
    brdNm: string;
    brdDesc?: string;
    replyUseYn: string;
    fileUseYn: string;
    fileMaxCnt: number;
    useYn: string;
    sysInsertDtm?: string;
    sysInsertUserId?: string;
    sysUpdateDtm?: string;
    sysUpdateUserId?: string;
}

/**
 * 게시판 마스터 검색 파라미터
 */
export interface BoardMasterSearchParams {
    page: number;
    size: number;
    brdNm?: string;
    startDate?: string;
    endDate?: string;
}

/**
 * API 함수들
 */
const BASE_URL = '/v1/mgmt/boards/master';

const boardMasterApi = {
    search: (params: BoardMasterSearchParams): Promise<ApiResponse<PageResponse<BoardMaster>>> => {
        const queryParams: Record<string, string | number> = {
            page: params.page + 1,
            size: params.size,
        };
        if (params.brdNm) queryParams.brdNm = params.brdNm;
        if (params.startDate) queryParams.startDate = params.startDate;
        if (params.endDate) queryParams.endDate = params.endDate;

        return apiClient.get<PageResponse<BoardMaster>>(BASE_URL, queryParams);
    },

    getById: (id: string): Promise<ApiResponse<BoardMaster>> => {
        return apiClient.get<BoardMaster>(`${BASE_URL}/${id}`);
    },

    create: (data: Partial<BoardMaster>): Promise<ApiResponse<BoardMaster>> => {
        return apiClient.post<BoardMaster>(BASE_URL, data);
    },

    update: (id: string, data: Partial<BoardMaster>): Promise<ApiResponse<BoardMaster>> => {
        return apiClient.put<BoardMaster>(`${BASE_URL}/${id}`, data);
    },

    delete: (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<void>(`${BASE_URL}/${id}`);
    },
};

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
export const useBoardsMasterList = createPaginatedQuery<
    PageResponse<BoardMaster>,
    BoardMasterSearchParams
>({
    queryKey: (params) => boardsMasterKeys.list(params),
    queryFn: (params) => boardMasterApi.search(params),
});

export const useBoardsMasterDetail = createQuery<BoardMaster, string | undefined>({
    queryKey: (boardId) => boardsMasterKeys.detail(boardId!),
    queryFn: (boardId) => boardMasterApi.getById(boardId!),
    enabled: (boardId) => !!boardId,
});

/**
 * Mutations
 */
export const useCreateBoardsMaster = createMutation<BoardMaster, Partial<BoardMaster>>({
    mutationFn: (data) => boardMasterApi.create(data),
    invalidateKeys: [boardsMasterKeys.all],
});

export const useUpdateBoardsMaster = createMutation<BoardMaster, { id: string; data: Partial<BoardMaster> }>({
    mutationFn: ({ id, data }) => boardMasterApi.update(id, data),
    invalidateKeys: [boardsMasterKeys.all],
});

export const useDeleteBoardsMaster = createMutation<void, string>({
    mutationFn: (id) => boardMasterApi.delete(id),
    invalidateKeys: [boardsMasterKeys.all],
});
