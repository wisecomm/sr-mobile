/**
 * Menu API Client
 * 
 * 메뉴 관리를 위한 API 클라이언트
 */

import { BaseResourceClient } from '@/lib/base-resource-client';
import { apiClient } from '@/lib/api-client';
import { MenuInfo, ApiResponse } from '@/types';

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
