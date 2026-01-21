/**
 * BoardsMaster API + Query Hooks
 *
 * 게시판 마스터 API 클라이언트와 React Query 훅 통합
 */

import { apiClient } from '@/lib/api-client';
import { ApiResponse, PageResponse } from '@/types';
import { createPaginatedQuery, createQuery, createMutation } from '@/hooks/query/factory';

import { BoardsMaster, BoardsMasterSearchParams } from '../types';


/**
 * API 함수들
 */
const BASE_URL = '/v1/mgmt/boards/master';

const boardsMasterApi = {
    search: (params: BoardsMasterSearchParams): Promise<ApiResponse<PageResponse<BoardsMaster>>> => {
        const queryParams: Record<string, string | number | string[]> = {
            page: params.page + 1,
            size: params.size,
        };
        if (params.brdNm) queryParams.brdNm = params.brdNm;
        if (params.startDate) queryParams.startDate = params.startDate;
        if (params.endDate) queryParams.endDate = params.endDate;
        if (params.sort) queryParams.sort = params.sort;

        return apiClient.get<PageResponse<BoardsMaster>>(BASE_URL, queryParams);
    },

    getById: (id: string): Promise<ApiResponse<BoardsMaster>> => {
        return apiClient.get<BoardsMaster>(`${BASE_URL}/${id}`);
    },

    create: (data: Partial<BoardsMaster>): Promise<ApiResponse<BoardsMaster>> => {
        return apiClient.post<BoardsMaster>(BASE_URL, data);
    },

    update: (id: string, data: Partial<BoardsMaster>): Promise<ApiResponse<BoardsMaster>> => {
        return apiClient.put<BoardsMaster>(`${BASE_URL}/${id}`, data);
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
    list: (params: BoardsMasterSearchParams) => [...boardsMasterKeys.lists(), params] as const,
    detail: (id: string) => [...boardsMasterKeys.all, 'detail', id] as const,
};

/**
 * Queries
 */
export const useBoardsMasterList = createPaginatedQuery<
    PageResponse<BoardsMaster>,
    BoardsMasterSearchParams
>({
    queryKey: (params) => boardsMasterKeys.list(params),
    queryFn: (params) => boardsMasterApi.search(params),
});

export const useBoardsMasterDetail = createQuery<BoardsMaster, string | undefined>({
    queryKey: (boardId) => boardsMasterKeys.detail(boardId!),
    queryFn: (boardId) => boardsMasterApi.getById(boardId!),
    enabled: (boardId) => !!boardId,
});

/**
 * Mutations
 */
export const useCreateBoardsMaster = createMutation<BoardsMaster, Partial<BoardsMaster>>({
    mutationFn: (data) => boardsMasterApi.create(data),
    invalidateKeys: [boardsMasterKeys.all],
});

export const useUpdateBoardsMaster = createMutation<BoardsMaster, { id: string; data: Partial<BoardsMaster> }>({
    mutationFn: ({ id, data }) => boardsMasterApi.update(id, data),
    invalidateKeys: [boardsMasterKeys.all],
});

export const useDeleteBoardsMaster = createMutation<void, string>({
    mutationFn: (id) => boardsMasterApi.delete(id),
    invalidateKeys: [boardsMasterKeys.all],
});
