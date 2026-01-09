"use client";

/**
 * Menu Actions (Refactored)
 * 
 * 새로운 API 클라이언트 레이어를 사용하여 리팩토링
 */

import { menuApi } from '@/lib/api';
import { ApiResponse, MenuInfo } from '@/types';

/**
 * 전체 메뉴 목록 조회
 */
export async function getMenus(): Promise<ApiResponse<MenuInfo[]>> {
    return menuApi.getList();
}

/**
 * 내 메뉴 목록 조회
 */
export async function getMyMenus(): Promise<ApiResponse<MenuInfo[]>> {
    return menuApi.getMyMenus();
}

/**
 * 메뉴 상세 조회
 */
export async function getMenu(menuId: string): Promise<ApiResponse<MenuInfo>> {
    return menuApi.getById(menuId);
}

/**
 * 메뉴 생성
 */
export async function createMenu(data: Partial<MenuInfo>): Promise<ApiResponse<void>> {
    return menuApi.create(data);
}

/**
 * 메뉴 수정
 */
export async function updateMenu(menuId: string, data: Partial<MenuInfo>): Promise<ApiResponse<void>> {
    return menuApi.update(menuId, data);
}

/**
 * 메뉴 삭제
 */
export async function deleteMenu(menuId: string): Promise<ApiResponse<void>> {
    return menuApi.delete(menuId);
}
