/**
 * useOrderManagement Hook
 */

import { useState, useCallback, useEffect } from 'react';
import { PaginationState } from '@tanstack/react-table';
import {
    useOrders,
    useCreateOrder,
    useUpdateOrder,
    useDeleteOrder
} from './use-order-query';
import { useToast } from '@/hooks/use-toast';
import { OrderDetail } from '../types';
import { formatDate } from '@/components/common/date-input';

/**
 * 검색 파라미터
 */
export interface OrderManagementSearchParams {
    custNm: string;
    startDate: string;
    endDate: string;
}

/**
 * 주문 관리 훅 리턴 타입
 */
export interface UseOrderManagementReturn {
    // 데이터
    orders: OrderDetail[];
    totalPages: number;
    isLoading: boolean;

    // 페이지네이션
    pagination: PaginationState;
    onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;

    // 검색
    searchParams: OrderManagementSearchParams;
    onSearch: (params: Partial<OrderManagementSearchParams>) => void;

    // 다이얼로그
    dialogOpen: boolean;
    selectedOrder: OrderDetail | null;
    openDialog: (order?: OrderDetail) => void;
    closeDialog: () => void;

    // CRUD 작업
    handleCreate: (data: Partial<OrderDetail>) => Promise<void>;
    handleUpdate: (data: Partial<OrderDetail>) => Promise<void>;
    handleDelete: (orderIds: string[]) => Promise<void>;
    handleSubmit: (data: Partial<OrderDetail>) => Promise<void>;
}

/**
 * 주문 관리 훅
 */
export function useOrderManagement(): UseOrderManagementReturn {
    const { toast } = useToast();

    // 검색 상태
    const [searchParams, setSearchParams] = useState<OrderManagementSearchParams>({
        custNm: '',
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
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

    // API 훅
    const { data: ordersData, isLoading, isError, error } = useOrders({
        page: pagination.pageIndex,
        size: pagination.pageSize,
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
    }, [isError, error, toast]);

    const createOrderMutation = useCreateOrder();
    const updateOrderMutation = useUpdateOrder();
    const deleteOrderMutation = useDeleteOrder();

    const onSearch = useCallback((params: Partial<OrderManagementSearchParams>) => {
        setSearchParams((prev) => ({ ...prev, ...params }));
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

    const handleDelete = useCallback(async (orderIds: string[]) => {
        if (orderIds.length === 0) {
            toast({ title: '알림', description: '삭제할 주문을 선택해주세요.', variant: 'default' });
            return;
        }

        const confirmed = window.confirm(`선택한 ${orderIds.length}개의 주문을 삭제하시겠습니까?`);
        if (!confirmed) return;

        const results = await Promise.allSettled(
            orderIds.map(id => deleteOrderMutation.mutateAsync(id))
        );

        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        if (succeeded === orderIds.length) {
            toast({ title: '삭제 완료', description: `${succeeded}개의 주문이 삭제되었습니다.`, variant: 'success' });
        } else {
            toast({ title: '일부 삭제 실패', description: `${succeeded}개 성공, ${orderIds.length - succeeded}개 실패`, variant: 'destructive' });
        }
    }, [deleteOrderMutation, toast]);

    const handleSubmit = useCallback(async (data: Partial<OrderDetail>) => {
        if (selectedOrder) {
            await handleUpdate(data);
        } else {
            await handleCreate(data);
        }
    }, [selectedOrder, handleCreate, handleUpdate]);

    return {
        orders: ordersData?.list || [],
        totalPages: ordersData?.pages || 0,
        isLoading,
        pagination,
        onPaginationChange: setPagination,
        searchParams,
        onSearch,
        dialogOpen,
        selectedOrder,
        openDialog,
        closeDialog,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleSubmit,
    };
}
