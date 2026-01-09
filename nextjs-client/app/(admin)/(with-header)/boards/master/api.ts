/**
 * Board Master API Client
 * 
 * 게시판 마스터 관리를 위한 API 클라이언트
 */

import { BaseResourceClient, PaginationParams } from '@/lib/base-resource-client';
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
        return this.getPagedList(params);
    }
}

/**
 * 싱글톤 인스턴스
 */
export const boardMasterApi = new BoardMasterApiClient();
