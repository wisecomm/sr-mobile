/**
 * Board Post API Client
 * 
 * 게시물 관리를 위한 API 클라이언트
 */

import { BaseResourceClient, PaginationParams } from '@/lib/base-resource-client';
import { apiClient } from '@/lib/api-client';
import { api } from '@/lib/api-client';
import { ApiResponse, PageResponse } from '@/types';

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
export interface BoardPostSearchParams extends PaginationParams {
    brdId: string;
    searchType?: string;
    keyword?: string;
    startDate?: string;
    endDate?: string;
    [key: string]: unknown;
}

/**
 * 게시물 API 클라이언트
 */
class BoardPostApiClient extends BaseResourceClient<Board> {
    constructor() {
        super({
            baseUrl: '/v1/boards/board',
            resourceName: 'boardPost',
        });
    }

    /**
     * 게시물 목록 조회 (페이지네이션)
     */
    async search(params: BoardPostSearchParams): Promise<ApiResponse<PageResponse<Board>>> {
        // Backend uses 1-based pagination, while frontend uses 0-based
        const adjustedParams = {
            ...params,
            page: params.page + 1,
        };
        return this.getPagedList(adjustedParams);
    }

    /**
     * 게시물 상세 조회
     */
    async getByIdNumber(id: number): Promise<ApiResponse<Board>> {
        return apiClient.get<Board>(`${this.baseUrl}/${id}`);
    }

    /**
     * 게시물 생성 (파일 업로드 지원)
     */
    async createWithFiles(formData: FormData): Promise<ApiResponse<void>> {
        return apiClient.post<void>(this.baseUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    /**
     * 게시물 수정 (파일 업로드 지원)
     */
    async updateWithFiles(id: number, formData: FormData): Promise<ApiResponse<void>> {
        return apiClient.put<void>(`${this.baseUrl}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    /**
     * 게시물 삭제
     */
    async deleteById(id: number): Promise<ApiResponse<void>> {
        return apiClient.delete<void>(`${this.baseUrl}/${id}`);
    }

    /**
     * 게시물 첨부파일 다운로드
     */
    async downloadFile(fileId: number, fileName: string): Promise<void> {
        try {
            const response = await api.get(`${this.baseUrl}/files/${fileId}/download`, {
                responseType: 'blob',
            });

            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response as unknown as Blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: unknown) {
            console.error('File download failed:', error);
            throw new Error('파일 다운로드에 실패했습니다.');
        }
    }
}

/**
 * 싱글톤 인스턴스
 */
export const boardPostApi = new BoardPostApiClient();
