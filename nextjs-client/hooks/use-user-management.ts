/**
 * useUserManagement Hook
 * 
 * 사용자 관리 페이지의 모든 비즈니스 로직을 캡슐화
 */

import { useState, useCallback } from 'react';
import { PaginationState } from '@tanstack/react-table';
import {
    useUsers,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
    useAssignUserRoles
} from '@/hooks/use-user-query';
import { useToast } from '@/hooks/use-toast';
import { UserDetail } from '@/types';

/**
 * 검색 파라미터
 */
export interface UserManagementSearchParams {
    userName: string;
    startDate: string;
    endDate: string;
}

/**
 * 사용자 관리 훅 리턴 타입
 */
export interface UseUserManagementReturn {
    // 데이터
    users: UserDetail[];
    totalPages: number;
    isLoading: boolean;

    // 페이지네이션
    pagination: PaginationState;
    onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;

    // 검색
    searchParams: UserManagementSearchParams;
    onSearch: (params: UserManagementSearchParams) => void;

    // 다이얼로그
    dialogOpen: boolean;
    selectedUser: UserDetail | null;
    openDialog: (user?: UserDetail) => void;
    closeDialog: () => void;

    // CRUD 작업
    handleCreate: (data: Partial<UserDetail>, roleIds: string[]) => Promise<void>;
    handleUpdate: (data: Partial<UserDetail>, roleIds: string[]) => Promise<void>;
    handleDelete: (userIds: string[]) => Promise<void>;
    handleSubmit: (data: Partial<UserDetail>, roleIds: string[]) => Promise<void>;
}

/**
 * 오늘 날짜 포맷
 */
const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * 사용자 관리 훅
 */
export function useUserManagement(): UseUserManagementReturn {
    const { toast } = useToast();

    // 검색 상태
    const [searchParams, setSearchParams] = useState<UserManagementSearchParams>({
        userName: '',
        startDate: '',
        endDate: formatDate(new Date()),
    });

    // 페이지네이션 상태
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // 다이얼로그 상태
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);

    // API 훅
    const { data: usersData, isLoading } = useUsers({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        ...searchParams,
    });

    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();
    const assignRolesMutation = useAssignUserRoles();

    /**
     * 검색 핸들러
     */
    const handleSearch = useCallback((params: UserManagementSearchParams) => {
        setSearchParams(params);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, []);

    /**
     * 다이얼로그 열기
     */
    const openDialog = useCallback((user?: UserDetail) => {
        setSelectedUser(user || null);
        setDialogOpen(true);
    }, []);

    /**
     * 다이얼로그 닫기
     */
    const closeDialog = useCallback(() => {
        setDialogOpen(false);
        setSelectedUser(null);
    }, []);

    /**
     * 사용자 생성
     */
    const handleCreate = useCallback(async (data: Partial<UserDetail>, roleIds: string[]) => {
        try {
            await createUserMutation.mutateAsync(data);

            if (data.userId) {
                await assignRolesMutation.mutateAsync({
                    userId: data.userId,
                    roleIds
                });
            }

            toast({
                title: '등록 완료',
                description: '새 사용자가 등록되었습니다.',
                variant: 'success',
            });

            closeDialog();
        } catch (error) {
            const message = error instanceof Error ? error.message : '사용자 등록에 실패했습니다.';
            toast({
                title: '등록 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [createUserMutation, assignRolesMutation, toast, closeDialog]);

    /**
     * 사용자 수정
     */
    const handleUpdate = useCallback(async (data: Partial<UserDetail>, roleIds: string[]) => {
        if (!selectedUser) {
            throw new Error('선택된 사용자가 없습니다.');
        }

        try {
            await updateUserMutation.mutateAsync({
                id: selectedUser.userId,
                data,
            });

            await assignRolesMutation.mutateAsync({
                userId: selectedUser.userId,
                roleIds,
            });

            toast({
                title: '수정 완료',
                description: '사용자 정보가 수정되었습니다.',
                variant: 'success',
            });

            closeDialog();
        } catch (error) {
            const message = error instanceof Error ? error.message : '사용자 수정에 실패했습니다.';
            toast({
                title: '수정 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [selectedUser, updateUserMutation, assignRolesMutation, toast, closeDialog]);

    /**
     * 사용자 삭제
     */
    const handleDelete = useCallback(async (userIds: string[]) => {
        if (userIds.length === 0) {
            toast({
                title: '알림',
                description: '삭제할 사용자를 선택해주세요.',
                variant: 'default',
            });
            return;
        }

        const confirmed = window.confirm(
            `선택한 ${userIds.length}명의 사용자를 삭제하시겠습니까?`
        );

        if (!confirmed) return;

        const results = await Promise.allSettled(
            userIds.map(id => deleteUserMutation.mutateAsync(id))
        );

        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        if (failed === 0) {
            toast({
                title: '삭제 완료',
                description: `${succeeded}명의 사용자가 삭제되었습니다.`,
                variant: 'success',
            });
        } else if (succeeded === 0) {
            toast({
                title: '삭제 실패',
                description: '사용자 삭제에 실패했습니다.',
                variant: 'destructive',
            });
        } else {
            toast({
                title: '부분 삭제',
                description: `${succeeded}명 성공, ${failed}명 실패`,
                variant: 'destructive',
            });
        }
    }, [deleteUserMutation, toast]);

    /**
     * 폼 제출 (생성 또는 수정)
     */
    const handleSubmit = useCallback(async (data: Partial<UserDetail>, roleIds: string[]) => {
        if (selectedUser) {
            await handleUpdate(data, roleIds);
        } else {
            await handleCreate(data, roleIds);
        }
    }, [selectedUser, handleCreate, handleUpdate]);

    return {
        // 데이터
        users: usersData?.list || [],
        totalPages: usersData?.pages || 0,
        isLoading,

        // 페이지네이션
        pagination,
        onPaginationChange: setPagination,

        // 검색
        searchParams,
        onSearch: handleSearch,

        // 다이얼로그
        dialogOpen,
        selectedUser,
        openDialog,
        closeDialog,

        // CRUD
        handleCreate,
        handleUpdate,
        handleDelete,
        handleSubmit,
    };
}
