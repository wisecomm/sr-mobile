/**
 * Role API Client
 * 
 * 역할 관리를 위한 API 클라이언트
 */

import { BaseResourceClient, paginateClientSide, filterItems } from '@/lib/base-resource-client';
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
     * 역할 검색 (클라이언트 사이드 페이지네이션)
     * Backend가 페이지네이션을 지원하지 않아 클라이언트에서 처리
     */
    async search(params: RoleSearchParams): Promise<ApiResponse<PageResponse<RoleInfo>>> {
        const response = await this.getList();

        if (response.code !== '200' || !response.data) {
            return {
                code: response.code,
                message: response.message,
                data: null,
            };
        }

        // 클라이언트 사이드 필터링
        let filteredRoles = response.data;
        if (params.searchId) {
            filteredRoles = filterItems(
                response.data,
                { roleId: params.searchId },
                ['roleId', 'roleName']
            );
        }

        // 클라이언트 사이드 페이지네이션
        const pagedData = paginateClientSide(filteredRoles, params.page, params.size);

        return {
            code: '200',
            message: 'Success',
            data: pagedData,
        };
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
