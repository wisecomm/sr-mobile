/**
 * useBoardsMasterManagement - 게시판 마스터 관리 훅
 */

import { useState, useCallback, useEffect } from 'react';
import { PaginationState } from '@tanstack/react-table';
import {
    useBoardsMasterList,
    useCreateBoardsMaster,
    useUpdateBoardsMaster,
    useDeleteBoardsMaster,
    BoardsMaster,
    BoardsMasterSearchParams,
} from './use-board-master-query';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/components/common/date-input';

/**
 * 게시판 마스터 관리 훅 리턴 타입
 */
export interface UseBoardsMasterManagementReturn {
    // 데이터
    boards: BoardsMaster[];
    totalPages: number;
    isLoading: boolean;

    // 페이지네이션
    pagination: PaginationState;
    onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;

    // 검색
    searchParams: BoardsMasterSearchParams;
    onSearch: (params: Partial<BoardsMasterSearchParams>) => void;

    // 다이얼로그
    dialogOpen: boolean;
    selectedBoard: BoardsMaster | null;
    openDialog: (board?: BoardsMaster) => void;
    closeDialog: () => void;

    // CRUD 작업
    handleCreate: (data: Partial<BoardsMaster>) => Promise<void>;
    handleUpdate: (data: Partial<BoardsMaster>) => Promise<void>;
    handleDelete: (boardIds: string[]) => Promise<void>;
    handleSubmit: (data: Partial<BoardsMaster>) => Promise<void>;
}

/**
 * 게시판 마스터 관리 훅
 */
export function useBoardsMasterManagement(): UseBoardsMasterManagementReturn {
    const { toast } = useToast();

    // 검색 상태
    const [searchParams, setSearchParams] = useState<BoardsMasterSearchParams>({
        brdNm: '',
        startDate: '',
        endDate: formatDate(new Date()),
        page: 0,
        size: 10,
    });

    // 페이지네이션 상태
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // 다이얼로그 상태
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState<BoardsMaster | null>(null);

    // API 훅
    const { data: boardsData, isLoading, isError, error } = useBoardsMasterList({
        ...searchParams,
        page: pagination.pageIndex,
        size: pagination.pageSize,
    });

    useEffect(() => {
        if (isError) {
            toast({
                title: '목록 조회 실패',
                description: error?.message || '게시판 목록을 불러오는 중 오류가 발생했습니다.',
                variant: 'destructive',
            });
        }
    }, [isError, error, toast]);

    const createMutation = useCreateBoardsMaster();
    const updateMutation = useUpdateBoardsMaster();
    const deleteMutation = useDeleteBoardsMaster();

    /**
     * 검색 핸들러
     */
    const onSearch = useCallback((params: Partial<BoardsMasterSearchParams>) => {
        setSearchParams((prev) => ({ ...prev, ...params }));
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, []);

    /**
     * 다이얼로그 열기
     */
    const openDialog = useCallback((board?: BoardsMaster) => {
        setSelectedBoard(board || null);
        setDialogOpen(true);
    }, []);

    /**
     * 다이얼로그 닫기
     */
    const closeDialog = useCallback(() => {
        setDialogOpen(false);
        setSelectedBoard(null);
    }, []);

    /**
     * 게시판 생성
     */
    const handleCreate = useCallback(async (data: Partial<BoardsMaster>) => {
        try {
            await createMutation.mutateAsync(data);

            toast({
                title: '등록 완료',
                description: '새 게시판이 등록되었습니다.',
                variant: 'success',
            });

            closeDialog();
        } catch (error) {
            const message = error instanceof Error ? error.message : '게시판 등록에 실패했습니다.';
            toast({
                title: '등록 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [createMutation, toast, closeDialog]);

    /**
     * 게시판 수정
     */
    const handleUpdate = useCallback(async (data: Partial<BoardsMaster>) => {
        if (!selectedBoard) {
            throw new Error('선택된 게시판이 없습니다.');
        }

        try {
            await updateMutation.mutateAsync({
                id: selectedBoard.brdId,
                data,
            });

            toast({
                title: '수정 완료',
                description: '게시판 정보가 수정되었습니다.',
                variant: 'success',
            });

            closeDialog();
        } catch (error) {
            const message = error instanceof Error ? error.message : '게시판 수정에 실패했습니다.';
            toast({
                title: '수정 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [selectedBoard, updateMutation, toast, closeDialog]);

    /**
     * 게시판 삭제
     */
    const handleDelete = useCallback(async (boardIds: string[]) => {
        if (boardIds.length === 0) {
            toast({
                title: '알림',
                description: '삭제할 게시판을 선택해주세요.',
                variant: 'default',
            });
            return;
        }

        const confirmed = window.confirm(
            `선택한 ${boardIds.length}개의 게시판을 삭제하시겠습니까?`
        );

        if (!confirmed) return;

        const results = await Promise.allSettled(
            boardIds.map(id => deleteMutation.mutateAsync(id))
        );

        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        if (failed === 0) {
            toast({
                title: '삭제 완료',
                description: `${succeeded}개의 게시판이 삭제되었습니다.`,
                variant: 'success',
            });
        } else if (succeeded === 0) {
            toast({
                title: '삭제 실패',
                description: '게시판 삭제에 실패했습니다.',
                variant: 'destructive',
            });
        } else {
            toast({
                title: '부분 삭제',
                description: `${succeeded}개 성공, ${failed}개 실패`,
                variant: 'destructive',
            });
        }
    }, [deleteMutation, toast]);

    /**
     * 폼 제출 (생성 또는 수정)
     */
    const handleSubmit = useCallback(async (data: Partial<BoardsMaster>) => {
        if (selectedBoard) {
            await handleUpdate(data);
        } else {
            await handleCreate(data);
        }
    }, [selectedBoard, handleCreate, handleUpdate]);

    return {
        boards: boardsData?.list || [],
        totalPages: boardsData?.pages || 0,
        isLoading,
        pagination,
        onPaginationChange: setPagination,
        searchParams,
        onSearch,
        dialogOpen,
        selectedBoard,
        openDialog,
        closeDialog,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleSubmit,
    };
}
