"use client";

/**
 * User Actions (Refactored)
 * 
 * 새로운 API 클라이언트 레이어를 사용하여 리팩토링
 * 코드 중복이 제거되고 유지보수가 쉬워졌습니다.
 */

import { userApi, UserSearchParams } from '@/lib/api';
import { ApiResponse, PageResponse, UserDetail } from '@/types';

/**
 * 사용자 목록 조회 (페이징)
 */
export async function getUsers(
    page: number,
    size: number,
    userName?: string,
    startDate?: string,
    endDate?: string
): Promise<ApiResponse<PageResponse<UserDetail>>> {
    const params: UserSearchParams = {
        page,
        size,
        userName,
        startDate,
        endDate,
    };
    
    return userApi.search(params);
}

/**
 * 사용자 생성
 */
export async function createUser(data: Partial<UserDetail>): Promise<ApiResponse<void>> {
    return userApi.create(data);
}

/**
 * 사용자 수정
 */
export async function updateUser(userId: string, data: Partial<UserDetail>): Promise<ApiResponse<void>> {
    return userApi.update(userId, data);
}

/**
 * 사용자 삭제
 */
export async function deleteUser(userId: string): Promise<ApiResponse<void>> {
    return userApi.delete(userId);
}

/**
 * 사용자 역할 목록 조회
 */
export async function getUserRoles(userId: string): Promise<ApiResponse<string[]>> {
    return userApi.getRoles(userId);
}

/**
 * 사용자 역할 부여/수정
 */
export async function assignUserRoles(userId: string, roleIds: string[]): Promise<ApiResponse<void>> {
    return userApi.assignRoles(userId, roleIds);
}
