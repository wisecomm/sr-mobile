/**
 * Menu API Client
 *
 * 메뉴 관리를 위한 API 클라이언트
 */

import { BaseResourceClient } from '@/lib/base-resource-client';
import { apiClient } from '@/lib/api-client';
import { MenuInfo, ApiResponse, PageResponse } from '@/types';

/**
 * 메뉴 검색 파라미터
 */
export interface MenuSearchParams {
    page: number;
    size: number;
    searchId?: string;
}

/**
 * 메뉴 API 클라이언트
 */
class MenuApiClient extends BaseResourceClient<MenuInfo> {
    constructor() {
        super({
            baseUrl: '/v1/mgmt/menus',
            resourceName: 'menu',
        });
    }

    /**
     * 메뉴 검색 (서버 사이드 페이지네이션)
     */
    async search(params: MenuSearchParams): Promise<ApiResponse<PageResponse<MenuInfo>>> {
        const queryParams: Record<string, string | number> = {
            page: params.page + 1, // 백엔드는 1-based index
            size: params.size,
        };

        if (params.searchId) {
            queryParams.searchId = params.searchId;
        }

        return apiClient.get<PageResponse<MenuInfo>>(this.baseUrl, queryParams);
    }

    /**
     * 내 메뉴 목록 조회
     */
    async getMyMenus(): Promise<ApiResponse<MenuInfo[]>> {
        return apiClient.get<MenuInfo[]>(`${this.baseUrl}/me`);
    }
}

/**
 * 싱글톤 인스턴스
 */
export const menuApi = new MenuApiClient();
