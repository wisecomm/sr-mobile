/**
 * useBoardPostManagement Hook
 * 
 * 게시물 관리 페이지의 모든 비즈니스 로직을 캡슐화
 */

import { useState, useCallback } from 'react';
import { PaginationState } from '@tanstack/react-table';
import {
    useBoardPosts,
    useCreateBoardPost,
    useUpdateBoardPost,
    useDeleteBoardPost,
    Board,
    BoardPostSearchParams,
} from '@/hooks/use-board-post-query';
import { useToast } from '@/hooks/use-toast';

/**
 * 게시물 관리 훅 리턴 타입
 */
export interface UseBoardPostManagementReturn {
    // 데이터
    posts: Board[];
    totalPages: number;
    isLoading: boolean;

    // 페이지네이션
    pagination: PaginationState;
    onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;

    // 검색
    searchParams: BoardPostSearchParams;
    onSearch: (params: Partial<BoardPostSearchParams>) => void;
    setBoardId: (brdId: string) => void;

    // 다이얼로그
    dialogOpen: boolean;
    selectedPost: Board | null;
    openDialog: (post?: Board) => void;
    closeDialog: () => void;

    // CRUD 작업
    handleCreate: (data: FormData) => Promise<void>;
    handleUpdate: (data: FormData) => Promise<void>;
    handleDelete: (postIds: number[]) => Promise<void>;
    handleSubmit: (data: Partial<Board> & { deleteFileIds?: number[] }, files?: File[] | null) => Promise<void>;
}

/**
 * 게시물 관리 훅
 */
export function useBoardPostManagement(initialBrdId?: string): UseBoardPostManagementReturn {
    const { toast } = useToast();

    // 검색 상태
    const [searchParams, setSearchParams] = useState<BoardPostSearchParams>({
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
    const [selectedPost, setSelectedPost] = useState<Board | null>(null);

    // API 훅
    const { data: postsData, isLoading } = useBoardPosts({
        ...searchParams,
        page: pagination.pageIndex,
        size: pagination.pageSize,
    });

    const createPostMutation = useCreateBoardPost();
    const updatePostMutation = useUpdateBoardPost();
    const deletePostMutation = useDeleteBoardPost();

    /**
     * 게시판 ID 설정
     */
    const setBoardId = useCallback((brdId: string) => {
        setSearchParams((prev: BoardPostSearchParams) => ({ ...prev, brdId }));
        setPagination((prev: PaginationState) => ({ ...prev, pageIndex: 0 }));
    }, []);

    /**
     * 검색 핸들러
     */
    const handleSearch = useCallback((params: Partial<BoardPostSearchParams>) => {
        setSearchParams((prev: BoardPostSearchParams) => ({ ...prev, ...params }));
        setPagination((prev: PaginationState) => ({ ...prev, pageIndex: 0 }));
    }, []);

    /**
     * 다이얼로그 열기
     */
    const openDialog = useCallback((post?: Board) => {
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
            await createPostMutation.mutateAsync(data);

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
    }, [createPostMutation, toast, closeDialog]);

    /**
     * 게시물 수정
     */
    const handleUpdate = useCallback(async (data: FormData) => {
        if (!selectedPost) {
            throw new Error('선택된 게시물이 없습니다.');
        }

        try {
            await updatePostMutation.mutateAsync({
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
    }, [selectedPost, updatePostMutation, toast, closeDialog]);

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

        try {
            await Promise.all(
                postIds.map(id => deletePostMutation.mutateAsync(id))
            );

            toast({
                title: '삭제 완료',
                description: '게시물이 삭제되었습니다.',
                variant: 'success',
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : '게시물 삭제에 실패했습니다.';
            toast({
                title: '삭제 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [deletePostMutation, toast]);

    /**
     * 폼 제출 (생성 또는 수정) - 파일 업로드 지원
     */
    const handleSubmit = useCallback(async (data: Partial<Board> & { deleteFileIds?: number[] }, files?: File[] | null) => {
        // FormData 빌드
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        formData.append('request', jsonBlob);

        // 파일 추가
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
        // 데이터
        posts: postsData?.list || [],
        totalPages: postsData?.pages || 0,
        isLoading,

        // 페이지네이션
        pagination,
        onPaginationChange: setPagination,

        // 검색
        searchParams,
        onSearch: handleSearch,
        setBoardId,

        // 다이얼로그
        dialogOpen,
        selectedPost,
        openDialog,
        closeDialog,

        // CRUD
        handleCreate,
        handleUpdate,
        handleDelete,
        handleSubmit,
    };
}
