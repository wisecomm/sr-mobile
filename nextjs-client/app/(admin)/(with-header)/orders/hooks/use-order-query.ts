/**
 * Order API + Query Hooks
 */

import { apiClient } from '@/lib/api-client';
import { ApiResponse, PageResponse } from '@/types';
import { OrderDetail } from '../types';
import { createPaginatedQuery, createMutation } from '@/hooks/query/factory';

/**
 * 주문 검색 파라미터
 */
export interface OrderSearchParams {
    page: number;
    size: number;
    custNm?: string;
    startDate?: string;
    endDate?: string;
    sort?: string[];
    [key: string]: unknown;
}

/**
 * API 함수들
 */
const BASE_URL = '/v1/mgmt/orders';

const orderApi = {
    search: (params: OrderSearchParams): Promise<ApiResponse<PageResponse<OrderDetail>>> => {
        const queryParams: Record<string, string | number | string[]> = {
            page: params.page + 1,
            size: params.size,
        };
        if (params.custNm) queryParams.custNm = params.custNm;
        if (params.startDate) queryParams.startDate = params.startDate;
        if (params.endDate) queryParams.endDate = params.endDate;
        if (params.sort) queryParams.sort = params.sort;

        return apiClient.get<PageResponse<OrderDetail>>(BASE_URL, queryParams);
    },

    getById: (id: string): Promise<ApiResponse<OrderDetail>> => {
        return apiClient.get<OrderDetail>(`${BASE_URL}/${id}`);
    },

    create: (data: Partial<OrderDetail>): Promise<ApiResponse<OrderDetail>> => {
        return apiClient.post<OrderDetail>(BASE_URL, data);
    },

    update: (id: string, data: Partial<OrderDetail>): Promise<ApiResponse<OrderDetail>> => {
        return apiClient.put<OrderDetail>(`${BASE_URL}/${id}`, data);
    },

    delete: (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<void>(`${BASE_URL}/${id}`);
    },
};

/**
 * Query Keys
 */
export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    list: (page: number, size: number, custNm?: string, startDate?: string, endDate?: string, sort?: string[]) =>
        [...orderKeys.lists(), { page, size, custNm, startDate, endDate, sort }] as const,
    detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

/**
 * Queries
 */
export const useOrders = createPaginatedQuery<
    PageResponse<OrderDetail>,
    { page: number; size: number; custNm?: string; startDate?: string; endDate?: string; sort?: string[] }
>({
    queryKey: (params) => orderKeys.list(params.page, params.size, params.custNm, params.startDate, params.endDate, params.sort),
    queryFn: (params) => orderApi.search(params),
});

/**
 * Mutations
 */
export const useCreateOrder = createMutation<OrderDetail, Partial<OrderDetail>>({
    mutationFn: (data) => orderApi.create(data),
    invalidateKeys: [orderKeys.all],
});

export const useUpdateOrder = createMutation<OrderDetail, { id: string; data: Partial<OrderDetail> }>({
    mutationFn: ({ id, data }) => orderApi.update(id, data),
    invalidateKeys: [orderKeys.all],
});

export const useDeleteOrder = createMutation<void, string>({
    mutationFn: (id) => orderApi.delete(id),
    invalidateKeys: [orderKeys.all],
});
