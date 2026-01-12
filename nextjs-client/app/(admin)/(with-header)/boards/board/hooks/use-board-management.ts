/**
 * useBoardManagement - 게시물 관리 훅
 */

import { useState, useCallback, useEffect } from 'react';
import { PaginationState } from '@tanstack/react-table';
import {
    useBoardsBoardList,
    useCreateBoardsBoard,
    useUpdateBoardsBoard,
    useDeleteBoardsBoard,
    BoardsBoard,
    BoardsBoardSearchParams,
} from './use-board-query';
import { useToast } from '@/hooks/use-toast';

/**
 * 게시물 관리 훅 리턴 타입
 */
export interface UseBoardManagementReturn {
    // 데이터
    posts: BoardsBoard[];
    totalPages: number;
    isLoading: boolean;

    // 페이지네이션
    pagination: PaginationState;
    onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;

    // 검색
    searchParams: BoardsBoardSearchParams;
    onSearch: (params: Partial<BoardsBoardSearchParams>) => void;
    setBoardId: (brdId: string) => void;

    // 다이얼로그
    dialogOpen: boolean;
    selectedPost: BoardsBoard | null;
    openDialog: (post?: BoardsBoard) => void;
    closeDialog: () => void;

    // CRUD 작업
    handleCreate: (data: FormData) => Promise<void>;
    handleUpdate: (data: FormData) => Promise<void>;
    handleDelete: (postIds: number[]) => Promise<void>;
    handleSubmit: (data: Partial<BoardsBoard> & { deleteFileIds?: number[] }, files?: File[] | null) => Promise<void>;
}

/**
 * 게시물 관리 훅
 */
export function useBoardManagement(initialBrdId?: string): UseBoardManagementReturn {
    const { toast } = useToast();

    // 검색 상태
    const [searchParams, setSearchParams] = useState<BoardsBoardSearchParams>({
        brdId: initialBrdId || '',
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
    const [selectedPost, setSelectedPost] = useState<BoardsBoard | null>(null);

    // API 훅
    const { data: postsData, isLoading, isError, error } = useBoardsBoardList({
        ...searchParams,
        page: pagination.pageIndex,
        size: pagination.pageSize,
    });

    useEffect(() => {
        if (isError) {
            toast({
                title: '목록 조회 실패',
                description: error?.message || '게시물 목록을 불러오는 중 오류가 발생했습니다.',
                variant: 'destructive',
            });
        }
    }, [isError, error, toast]);

    const createMutation = useCreateBoardsBoard();
    const updateMutation = useUpdateBoardsBoard();
    const deleteMutation = useDeleteBoardsBoard();

    /**
     * 게시판 ID 설정
     */
    const setBoardId = useCallback((brdId: string) => {
        setSearchParams((prev: BoardsBoardSearchParams) => ({ ...prev, brdId }));
        setPagination((prev: PaginationState) => ({ ...prev, pageIndex: 0 }));
    }, []);

    /**
     * 검색 핸들러
     */
    const handleSearch = useCallback((params: Partial<BoardsBoardSearchParams>) => {
        setSearchParams((prev: BoardsBoardSearchParams) => ({ ...prev, ...params }));
        setPagination((prev: PaginationState) => ({ ...prev, pageIndex: 0 }));
    }, []);

    /**
     * 다이얼로그 열기
     */
    const openDialog = useCallback((post?: BoardsBoard) => {
        setSelectedPost(post || null);
        setDialogOpen(true);
    }, []);

    /**
     * 다이얼로그 닫기
     */
    const closeDialog = useCallback(() => {
        setDialogOpen(false);
        setSelectedPost(null);
    }, []);

    /**
     * 게시물 생성
     */
    const handleCreate = useCallback(async (data: FormData) => {
        try {
            await createMutation.mutateAsync(data);

            toast({
                title: '등록 완료',
                description: '새 게시물이 등록되었습니다.',
                variant: 'success',
            });

            closeDialog();
        } catch (error) {
            const message = error instanceof Error ? error.message : '게시물 등록에 실패했습니다.';
            toast({
                title: '등록 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [createMutation, toast, closeDialog]);

    /**
     * 게시물 수정
     */
    const handleUpdate = useCallback(async (data: FormData) => {
        if (!selectedPost) {
            throw new Error('선택된 게시물이 없습니다.');
        }

        try {
            await updateMutation.mutateAsync({
                id: selectedPost.boardId,
                data,
            });

            toast({
                title: '수정 완료',
                description: '게시물이 수정되었습니다.',
                variant: 'success',
            });

            closeDialog();
        } catch (error) {
            const message = error instanceof Error ? error.message : '게시물 수정에 실패했습니다.';
            toast({
                title: '수정 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [selectedPost, updateMutation, toast, closeDialog]);

    /**
     * 게시물 삭제
     */
    const handleDelete = useCallback(async (postIds: number[]) => {
        if (postIds.length === 0) {
            toast({
                title: '알림',
                description: '삭제할 게시물을 선택해주세요.',
                variant: 'default',
            });
            return;
        }

        const confirmed = window.confirm(
            `선택한 ${postIds.length}개의 게시물을 삭제하시겠습니까?`
        );

        if (!confirmed) return;

        const results = await Promise.allSettled(
            postIds.map(id => deleteMutation.mutateAsync(id))
        );

        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        if (failed === 0) {
            toast({
                title: '삭제 완료',
                description: `${succeeded}개의 게시물이 삭제되었습니다.`,
                variant: 'success',
            });
        } else if (succeeded === 0) {
            toast({
                title: '삭제 실패',
                description: '게시물 삭제에 실패했습니다.',
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
    const handleSubmit = useCallback(async (data: Partial<BoardsBoard> & { deleteFileIds?: number[] }, files?: File[] | null) => {
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        formData.append('request', jsonBlob);

        if (files) {
            files.forEach((file) => {
                formData.append('files', file);
            });
        }

        if (selectedPost) {
            await handleUpdate(formData);
        } else {
            await handleCreate(formData);
        }
    }, [selectedPost, handleCreate, handleUpdate]);

    return {
        posts: postsData?.list || [],
        totalPages: postsData?.pages || 0,
        isLoading,
        pagination,
        onPaginationChange: setPagination,
        searchParams,
        onSearch: handleSearch,
        setBoardId,
        dialogOpen,
        selectedPost,
        openDialog,
        closeDialog,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleSubmit,
    };
}
