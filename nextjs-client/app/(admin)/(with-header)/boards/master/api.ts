/**
 * Board Master API Client
 * 
 * 게시판 마스터 관리를 위한 API 클라이언트
 */

import { BaseResourceClient, PaginationParams } from '@/lib/base-resource-client';
import { apiClient } from '@/lib/api-client';
import { ApiResponse, PageResponse } from '@/types';

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
export interface BoardMasterSearchParams extends PaginationParams {
    brdNm?: string;
    startDate?: string;
    endDate?: string;
    [key: string]: unknown;
}

/**
 * 게시판 마스터 API 클라이언트
 */
class BoardMasterApiClient extends BaseResourceClient<BoardMaster> {
    constructor() {
        super({
            baseUrl: '/v1/mgmt/boards/master',
            resourceName: 'boardMaster',
        });
    }

    /**
     * 게시판 목록 조회 (페이지네이션)
     */
    async search(params: BoardMasterSearchParams): Promise<ApiResponse<PageResponse<BoardMaster>>> {
        // Backend uses 1-based pagination, while frontend uses 0-based
        const adjustedParams = {
            ...params,
            page: params.page + 1,
        };
        return this.getPagedList(adjustedParams);
    }

    /**
     * 게시판 상세 조회
     */
    async getById(id: string): Promise<ApiResponse<BoardMaster>> {
        return apiClient.get<BoardMaster>(`${this.baseUrl}/${id}`);
    }

    /**
     * 게시판 생성
     */
    async create(data: Partial<BoardMaster>): Promise<ApiResponse<BoardMaster>> {
        return apiClient.post<BoardMaster>(this.baseUrl, data);
    }

    /**
     * 게시판 수정
     */
    async update(id: string, data: Partial<BoardMaster>): Promise<ApiResponse<BoardMaster>> {
        return apiClient.put<BoardMaster>(`${this.baseUrl}/${id}`, data);
    }

    /**
     * 게시판 삭제
     */
    async delete(id: string): Promise<ApiResponse<void>> {
        return apiClient.delete<void>(`${this.baseUrl}/${id}`);
    }
}

/**
 * 싱글톤 인스턴스
 */
export const boardMasterApi = new BoardMasterApiClient();
