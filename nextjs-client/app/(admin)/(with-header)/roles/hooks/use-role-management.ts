/**
 * useRoleManagement Hook
 * 
 * 역할 관리 페이지의 모든 비즈니스 로직을 캡슐화
 */

import { useState, useCallback, useEffect } from 'react';
import { PaginationState } from '@tanstack/react-table';
import {
    useRoles,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
    useAssignRoleMenus
} from './use-role-query';
import { useToast } from '@/hooks/use-toast';
import { RoleInfo } from '../types';
import { SortModel } from 'so-grid-core';

/**
 * 역할 검색 파라미터
 */
export interface RoleManagementSearchParams {
    searchId?: string;
}

/**
 * 역할 관리 훅 리턴 타입
 */
export interface UseRoleManagementReturn {
    // 데이터
    roles: RoleInfo[];
    totalRows: number;
    isLoading: boolean;

    // 페이지네이션
    pagination: PaginationState;
    onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;

    // 검색
    searchParams: RoleManagementSearchParams;
    onSearch: (params: Partial<RoleManagementSearchParams>) => void;
    onSortChange: (sortModel: SortModel[]) => void;

    // 다이얼로그
    dialogOpen: boolean;
    selectedRole: RoleInfo | null;
    openDialog: (role?: RoleInfo) => void;
    closeDialog: () => void;

    // CRUD 작업
    handleCreate: (data: Partial<RoleInfo>, menuIds: string[]) => Promise<void>;
    handleUpdate: (data: Partial<RoleInfo>, menuIds: string[]) => Promise<void>;
    handleDelete: (roleIds: string[]) => Promise<void>;
    handleSubmit: (data: Partial<RoleInfo>, menuIds: string[]) => Promise<void>;
}

export interface UseRoleManagementOptions {
    initialSearch?: Partial<RoleManagementSearchParams>;
    initialPagination?: Partial<PaginationState>;
}

/**
 * 역할 관리 훅
 */
export function useRoleManagement(options: UseRoleManagementOptions = {}): UseRoleManagementReturn {
    const { toast } = useToast();

    // 검색 상태
    const [searchParams, setSearchParams] = useState<RoleManagementSearchParams>({
        searchId: undefined,
        ...options.initialSearch,
    });

    const [sort, setSort] = useState<string[] | undefined>(undefined);

    // 페이지네이션 상태
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
        ...options.initialPagination,
    });

    // 다이얼로그 상태
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleInfo | null>(null);

    // API 훅
    const { data: rolesData, isLoading, isError, error, refetch } = useRoles({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sort,
        ...searchParams,
    });

    useEffect(() => {
        if (isError) {
            toast({
                title: '목록 조회 실패',
                description: error?.message || '권한 목록을 불러오는 중 오류가 발생했습니다.',
                variant: 'destructive',
            });
        }
    }, [isError, error, toast]);

    const createRoleMutation = useCreateRole();
    const updateRoleMutation = useUpdateRole();
    const deleteRoleMutation = useDeleteRole();
    const assignMenusMutation = useAssignRoleMenus();

    /**
     * 검색 핸들러
     */
    const onSearch = useCallback((params: Partial<RoleManagementSearchParams>) => {
        setSearchParams((prev) => ({ ...prev, ...params }));
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        refetch();
    }, [refetch]);

    const onSortChange = useCallback((sortModel: SortModel[]) => {
        const newSort = sortModel.map(s => `${s.colId},${s.sort}`);
        setSort(newSort.length > 0 ? newSort : undefined);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, []);

    /**
     * 다이얼로그 열기
     */
    const openDialog = useCallback((role?: RoleInfo) => {
        setSelectedRole(role || null);
        setDialogOpen(true);
    }, []);

    /**
     * 다이얼로그 닫기
     */
    const closeDialog = useCallback(() => {
        setDialogOpen(false);
        setSelectedRole(null);
    }, []);

    /**
     * 역할 생성
     */
    const handleCreate = useCallback(async (data: Partial<RoleInfo>, menuIds: string[]) => {
        try {
            await createRoleMutation.mutateAsync(data);

            if (data.roleId) {
                await assignMenusMutation.mutateAsync({
                    roleId: data.roleId,
                    menuIds
                });
            }

            toast({
                title: '등록 완료',
                description: '새 권한이 등록되었습니다.',
                variant: 'success',
            });

            closeDialog();
        } catch (error) {
            const message = error instanceof Error ? error.message : '권한 등록에 실패했습니다.';
            toast({
                title: '등록 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [createRoleMutation, assignMenusMutation, toast, closeDialog]);

    /**
     * 역할 수정
     */
    const handleUpdate = useCallback(async (data: Partial<RoleInfo>, menuIds: string[]) => {
        if (!selectedRole) {
            throw new Error('선택된 권한이 없습니다.');
        }

        try {
            await updateRoleMutation.mutateAsync({
                id: selectedRole.roleId,
                data,
            });

            await assignMenusMutation.mutateAsync({
                roleId: selectedRole.roleId,
                menuIds,
            });

            toast({
                title: '수정 완료',
                description: '권한 정보가 수정되었습니다.',
                variant: 'success',
            });

            closeDialog();
        } catch (error) {
            const message = error instanceof Error ? error.message : '권한 수정에 실패했습니다.';
            toast({
                title: '수정 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [selectedRole, updateRoleMutation, assignMenusMutation, toast, closeDialog]);

    /**
     * 역할 삭제
     */
    const handleDelete = useCallback(async (roleIds: string[]) => {
        if (roleIds.length === 0) {
            toast({ title: '알림', description: '삭제할 권한을 선택해주세요.', variant: 'default', });
            return;
        }

        const confirmed = window.confirm(`선택한 ${roleIds.length}개의 권한을 삭제하시겠습니까?`);
        if (!confirmed) return;

        const results = await Promise.allSettled(
            roleIds.map(id => deleteRoleMutation.mutateAsync(id))
        );

        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        if (succeeded === roleIds.length) {
            toast({ title: '삭제 완료', description: `${succeeded}개의 권한이 삭제되었습니다.`, variant: 'success' });
        } else {
            toast({ title: '일부 삭제 실패', description: `${succeeded}개 성공, ${roleIds.length - succeeded}개 실패`, variant: 'destructive' });
        }
    }, [deleteRoleMutation, toast]);

    /**
     * 폼 제출 (생성 또는 수정)
     */
    const handleSubmit = useCallback(async (data: Partial<RoleInfo>, menuIds: string[]) => {
        if (selectedRole) {
            await handleUpdate(data, menuIds);
        } else {
            await handleCreate(data, menuIds);
        }
    }, [selectedRole, handleCreate, handleUpdate]);

    return {
        // 데이터
        roles: rolesData?.list || [],
        totalRows: rolesData?.total || 0,
        isLoading,
        pagination,
        onPaginationChange: setPagination,
        searchParams,
        onSearch,
        onSortChange,
        dialogOpen,
        selectedRole,
        openDialog,
        closeDialog,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleSubmit,
    };
}
