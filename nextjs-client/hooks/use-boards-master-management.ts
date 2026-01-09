/**
 * useBoardsMasterManagement - 게시판 마스터 관리 훅
 */

import { useState, useCallback } from 'react';
import { PaginationState } from '@tanstack/react-table';
import {
    useBoardsMasterList,
    useCreateBoardsMaster,
    useUpdateBoardsMaster,
    useDeleteBoardsMaster,
    BoardMaster,
    BoardMasterSearchParams,
} from '@/hooks/use-boards-master-query';
import { useToast } from '@/hooks/use-toast';

/**
 * 게시판 마스터 관리 훅 리턴 타입
 */
export interface UseBoardsMasterManagementReturn {
    // 데이터
    boards: BoardMaster[];
    totalPages: number;
    isLoading: boolean;

    // 페이지네이션
    pagination: PaginationState;
    onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;

    // 검색
    searchParams: Omit<BoardMasterSearchParams, 'page' | 'size'>;
    onSearch: (params: Omit<BoardMasterSearchParams, 'page' | 'size'>) => void;

    // 다이얼로그
    dialogOpen: boolean;
    selectedBoard: BoardMaster | null;
    openDialog: (board?: BoardMaster) => void;
    closeDialog: () => void;

    // CRUD 작업
    handleCreate: (data: Partial<BoardMaster>) => Promise<void>;
    handleUpdate: (data: Partial<BoardMaster>) => Promise<void>;
    handleDelete: (boardIds: string[]) => Promise<void>;
    handleSubmit: (data: Partial<BoardMaster>) => Promise<void>;
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
 * 게시판 마스터 관리 훅
 */
export function useBoardsMasterManagement(): UseBoardsMasterManagementReturn {
    const { toast } = useToast();

    // 검색 상태
    const [searchParams, setSearchParams] = useState<Omit<BoardMasterSearchParams, 'page' | 'size'>>({
        brdNm: '',
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
    const [selectedBoard, setSelectedBoard] = useState<BoardMaster | null>(null);

    // API 훅
    const { data: boardsData, isLoading } = useBoardsMasterList({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        ...searchParams,
    });

    const createMutation = useCreateBoardsMaster();
    const updateMutation = useUpdateBoardsMaster();
    const deleteMutation = useDeleteBoardsMaster();

    /**
     * 검색 핸들러
     */
    const handleSearch = useCallback((params: Omit<BoardMasterSearchParams, 'page' | 'size'>) => {
        setSearchParams(params);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, []);

    /**
     * 다이얼로그 열기
     */
    const openDialog = useCallback((board?: BoardMaster) => {
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
    const handleCreate = useCallback(async (data: Partial<BoardMaster>) => {
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
    const handleUpdate = useCallback(async (data: Partial<BoardMaster>) => {
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

        try {
            await Promise.all(
                boardIds.map(id => deleteMutation.mutateAsync(id))
            );

            toast({
                title: '삭제 완료',
                description: '게시판이 삭제되었습니다.',
                variant: 'success',
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : '게시판 삭제에 실패했습니다.';
            toast({
                title: '삭제 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [deleteMutation, toast]);

    /**
     * 폼 제출 (생성 또는 수정)
     */
    const handleSubmit = useCallback(async (data: Partial<BoardMaster>) => {
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
        onSearch: handleSearch,
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
