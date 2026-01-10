/**
 * Role API Client
 *
 * 역할 관리를 위한 API 클라이언트
 */

import { BaseResourceClient } from '@/lib/base-resource-client';
import { apiClient } from '@/lib/api-client';
import { RoleInfo, ApiResponse, PageResponse } from '@/types';

/**
 * 역할 검색 파라미터
 */
export interface RoleSearchParams {
    page: number;
    size: number;
    searchId?: string;
}

/**
 * 역할 API 클라이언트
 */
class RoleApiClient extends BaseResourceClient<RoleInfo> {
    constructor() {
        super({
            baseUrl: '/v1/mgmt/roles',
            resourceName: 'role',
        });
    }

    /**
     * 역할 검색 (서버 사이드 페이지네이션)
     */
    async search(params: RoleSearchParams): Promise<ApiResponse<PageResponse<RoleInfo>>> {
        const queryParams: Record<string, string | number> = {
            page: params.page + 1, // 백엔드는 1-based index
            size: params.size,
        };

        if (params.searchId) {
            queryParams.searchId = params.searchId;
        }

        return apiClient.get<PageResponse<RoleInfo>>(this.baseUrl, queryParams);
    }

    /**
     * 역할에 할당된 메뉴 목록 조회
     */
    async getMenus(roleId: string): Promise<ApiResponse<string[]>> {
        return apiClient.get<string[]>(`${this.baseUrl}/${roleId}/menus`);
    }

    /**
     * 역할에 메뉴 부여
     */
    async assignMenus(roleId: string, menuIds: string[]): Promise<ApiResponse<void>> {
        return apiClient.post<void>(`${this.baseUrl}/assign-menus`, { roleId, menuIds });
    }
}

/**
 * 싱글톤 인스턴스
 */
export const roleApi = new RoleApiClient();
