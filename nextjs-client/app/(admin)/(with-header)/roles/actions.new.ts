"use client";

/**
 * Role Actions (Refactored)
 * 
 * 새로운 API 클라이언트 레이어를 사용하여 리팩토링
 */

import { roleApi, RoleSearchParams } from '@/lib/api';
import { ApiResponse, PageResponse, RoleInfo } from '@/types';

/**
 * 역할 목록 조회 (클라이언트 사이드 페이지네이션)
 */
export async function getRoles(
    page: number,
    size: number,
    searchId?: string
): Promise<ApiResponse<PageResponse<RoleInfo>>> {
    const params: RoleSearchParams = {
        page,
        size,
        searchId,
    };
    
    return roleApi.search(params);
}

/**
 * 역할 생성
 */
export async function createRole(data: Partial<RoleInfo>): Promise<ApiResponse<void>> {
    return roleApi.create(data);
}

/**
 * 역할 수정
 */
export async function updateRole(roleId: string, data: Partial<RoleInfo>): Promise<ApiResponse<void>> {
    return roleApi.update(roleId, data);
}

/**
 * 역할 삭제
 */
export async function deleteRole(roleId: string): Promise<ApiResponse<void>> {
    return roleApi.delete(roleId);
}

/**
 * 역할의 메뉴 목록 조회
 */
export async function getRoleMenus(roleId: string): Promise<ApiResponse<string[]>> {
    return roleApi.getMenus(roleId);
}

/**
 * 역할에 메뉴 부여
 */
export async function assignRoleMenus(roleId: string, menuIds: string[]): Promise<ApiResponse<void>> {
    return roleApi.assignMenus(roleId, menuIds);
}
