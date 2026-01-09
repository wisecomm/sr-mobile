/**
 * User API Client
 * 
 * 사용자 관리를 위한 API 클라이언트
 */

import { BaseResourceClient, PaginationParams } from '@/lib/base-resource-client';
import { apiClient } from '@/lib/api-client';
import { UserDetail, ApiResponse, PageResponse } from '@/types';

/**
 * 사용자 검색 파라미터
 */
export interface UserSearchParams extends PaginationParams {
    userName?: string;
    startDate?: string;
    endDate?: string;
}

/**
 * 사용자 API 클라이언트
 */
class UserApiClient extends BaseResourceClient<UserDetail> {
    constructor() {
        super({
            baseUrl: '/v1/mgmt/users',
            resourceName: 'user',
        });
    }

    /**
     * 사용자 검색
     */
    async search(params: UserSearchParams): Promise<ApiResponse<PageResponse<UserDetail>>> {
        return this.getPagedList(params);
    }

    /**
     * 사용자의 역할 목록 조회
     */
    async getRoles(userId: string): Promise<ApiResponse<string[]>> {
        return apiClient.get<string[]>(`${this.baseUrl}/${userId}/roles`);
    }

    /**
     * 사용자에게 역할 부여
     */
    async assignRoles(userId: string, roleIds: string[]): Promise<ApiResponse<void>> {
        return apiClient.post<void>(`${this.baseUrl}/assign-roles`, { userId, roleIds });
    }
}

/**
 * 싱글톤 인스턴스
 */
export const userApi = new UserApiClient();
