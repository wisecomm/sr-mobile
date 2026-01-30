import {
    useOrders,
    useCreateOrder,
    useUpdateOrder,
    useDeleteOrder
} from './use-order-query';
import { OrderSearchParams } from '../types';

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { OrderDetail } from '../types';
import { formatDate } from '@/components/common';
import { PaginationState, SortModel } from "so-grid-core";


/**
 * 주문 관리 훅 리턴 타입
 */
export interface UseOrderManagementReturn {
    // 데이터
    orders: OrderDetail[];
    totalRows: number;
    isLoading: boolean;

    // 페이지네이션
    pagination: PaginationState;
    onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;

    // 검색
    searchParams: Partial<OrderSearchParams>;
    onSearch: (params: Partial<OrderSearchParams>) => void;
    onSortChange: (sortModel: SortModel[]) => void;

    // 다이얼로그
    dialogOpen: boolean;
    selectedOrder: OrderDetail | null;
    openDialog: (order?: OrderDetail) => void;
    closeDialog: () => void;

    // CRUD 작업
    handleCreate: (data: Partial<OrderDetail>) => Promise<void>;
    handleUpdate: (data: Partial<OrderDetail>) => Promise<void>;
    handleSubmit: (data: Partial<OrderDetail>) => Promise<void>;
    isSaving: boolean;

    // 삭제 확인 다이얼로그
    deleteConfirmOpen: boolean;
    deleteTargetIds: string[];
    openDeleteConfirm: (orderIds: string[]) => void;
    closeDeleteConfirm: () => void;
    executeDelete: () => Promise<void>;
}

/**
 * 주문 관리 훅
 */
export interface UseOrderManagementOptions {
    initialSearch?: Partial<OrderSearchParams>;
    initialPagination?: Partial<PaginationState>;
}

export function useOrderManagement(options: UseOrderManagementOptions = {}): UseOrderManagementReturn {
    const { toast } = useToast();

    // 검색 상태
    const [searchParams, setSearchParams] = useState<Partial<OrderSearchParams>>({
        custNm: '',
        startDate: '',
        endDate: formatDate(new Date()),
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
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

    // 삭제 확인 다이얼로그 상태
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

    // API 훅
    const { data: ordersData, isLoading, isError, error } = useOrders({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sort,
        ...searchParams,
    });

    useEffect(() => {
        if (isError) {
            toast({
                title: '목록 조회 실패',
                description: error?.message || '주문 목록을 불러오는 중 오류가 발생했습니다.',
                variant: 'destructive',
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, error]);

    const createOrderMutation = useCreateOrder();
    const updateOrderMutation = useUpdateOrder();
    const deleteOrderMutation = useDeleteOrder();

    const onSearch = useCallback((params: Partial<OrderSearchParams>) => {
        setSearchParams((prev) => ({ ...prev, ...params }));
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
        // queryKey 변경으로 자동 refetch됨
    }, []);

    const onSortChange = useCallback((sortModel: SortModel[]) => {
        const newSort = sortModel.map(s => `${s.colId},${s.sort}`);
        setSort(newSort.length > 0 ? newSort : undefined);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, []);

    const openDialog = useCallback((order?: OrderDetail) => {
        setSelectedOrder(order || null);
        setDialogOpen(true);
    }, []);

    const closeDialog = useCallback(() => {
        setDialogOpen(false);
        setSelectedOrder(null);
    }, []);

    const handleCreate = useCallback(async (data: Partial<OrderDetail>) => {
        try {
            await createOrderMutation.mutateAsync(data);
            toast({
                title: '등록 완료',
                description: '새 주문이 등록되었습니다.',
                variant: 'success',
            });
            closeDialog();
        } catch (error) {
            const message = error instanceof Error ? error.message : '주문 등록에 실패했습니다.';
            toast({
                title: '등록 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [createOrderMutation, toast, closeDialog]);

    const handleUpdate = useCallback(async (data: Partial<OrderDetail>) => {
        if (!selectedOrder) throw new Error('선택된 주문이 없습니다.');

        try {
            await updateOrderMutation.mutateAsync({
                id: selectedOrder.orderId,
                data,
            });
            toast({
                title: '수정 완료',
                description: '주문 정보가 수정되었습니다.',
                variant: 'success',
            });
            closeDialog();
        } catch (error) {
            const message = error instanceof Error ? error.message : '주문 수정에 실패했습니다.';
            toast({
                title: '수정 실패',
                description: message,
                variant: 'destructive',
            });
            throw error;
        }
    }, [selectedOrder, updateOrderMutation, toast, closeDialog]);

    // 삭제 확인 다이얼로그 열기
    const openDeleteConfirm = useCallback((orderIds: string[]) => {
        if (orderIds.length === 0) {
            toast({ title: '알림', description: '삭제할 주문을 선택해주세요.', variant: 'default' });
            return;
        }
        setDeleteTargetIds(orderIds);
        setDeleteConfirmOpen(true);
    }, [toast]);

    // 삭제 확인 다이얼로그 닫기
    const closeDeleteConfirm = useCallback(() => {
        setDeleteConfirmOpen(false);
        setDeleteTargetIds([]);
    }, []);

    // 실제 삭제 실행
    const executeDelete = useCallback(async () => {
        const results = await Promise.allSettled(
            deleteTargetIds.map(id => deleteOrderMutation.mutateAsync(id))
        );

        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        if (succeeded === deleteTargetIds.length) {
            toast({ title: '삭제 완료', description: `${succeeded}개의 주문이 삭제되었습니다.`, variant: 'success' });
        } else {
            toast({ title: '일부 삭제 실패', description: `${succeeded}개 성공, ${deleteTargetIds.length - succeeded}개 실패`, variant: 'destructive' });
        }
        closeDeleteConfirm();
    }, [deleteTargetIds, deleteOrderMutation, toast, closeDeleteConfirm]);

    const handleSubmit = useCallback(async (data: Partial<OrderDetail>) => {
        if (selectedOrder) {
            await handleUpdate(data);
        } else {
            await handleCreate(data);
        }
    }, [selectedOrder, handleCreate, handleUpdate]);

    return {
        orders: ordersData?.list || [],
        totalRows: ordersData?.total || 0,
        isLoading,
        pagination,
        onPaginationChange: setPagination,
        searchParams,
        onSearch,
        onSortChange,
        dialogOpen,
        selectedOrder,
        openDialog,
        closeDialog,
        handleCreate,
        handleUpdate,
        handleSubmit,
        isSaving: createOrderMutation.isPending || updateOrderMutation.isPending,
        deleteConfirmOpen,
        deleteTargetIds,
        openDeleteConfirm,
        closeDeleteConfirm,
        executeDelete,
    };
}
