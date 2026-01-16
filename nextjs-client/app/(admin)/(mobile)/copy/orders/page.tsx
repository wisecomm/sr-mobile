"use client";

import * as React from "react";
import { getColumns } from "./columns";
import { OrderDetail } from "./types";
import { DataTableToolbar } from "./data-table-toolbar";
import { SearchPageLayout } from "@/components/common/search-page-layout";
import { InputDialog } from "./input-dialog";
import { useOrderManagement } from "./hooks/use-order-management";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, History } from "lucide-react";
import { useRouter } from "next/navigation";
import 'so-grid-react/styles.css';
import { CustomPaginationM } from "@/components/utils/CustomPaginationM";
import { PaginationState, SortModel } from "so-grid-core";
import { SOGrid, SOGridApi } from "so-grid-react";

export default function OrdersPage() {
    const { toast } = useToast();
    const router = useRouter();

    // Use management hook
    const {
        orders,
        totalRows,
        isLoading,
        pagination,
        onPaginationChange,
        searchParams,
        onSearch,
        dialogOpen,
        selectedOrder,
        openDialog,
        closeDialog,
        handleSubmit,
        handleDelete,
        onSortChange,
    } = useOrderManagement({
        initialPagination: {
            pageIndex: 0, // 0페이지부터 시작
            pageSize: 5, // 한 페이지에 20개씩 표시
        }
    });

    // Define columns
    const columns = React.useMemo(() => getColumns(), []);

    const DEFAULT_COL_DEF = {
        headerStyle: { textAlign: 'center' as const },
        resizable: true,
    };

    // 그리드 API 참조
    const gridApiRef = React.useRef<SOGridApi<OrderDetail> | null>(null);
    const onGridReady = React.useCallback((api: SOGridApi<OrderDetail>) => {
        gridApiRef.current = api;
    }, []);


    const handlePaginationChange = React.useCallback((pagination: PaginationState) => {
        onPaginationChange(pagination);
    }, [onPaginationChange]);

    const handleSortChange = React.useCallback((sort: SortModel[]) => {
        onSortChange(sort);
    }, [onSortChange]);

    /**
     * Add Button Handler
     */
    const handleAdd = React.useCallback(() => {
        openDialog();
    }, [openDialog]);

    /**
     * Edit Button Handler (Toolbar)
     */
    const handleEdit = React.useCallback(() => {
        // API를 통해 선택된 행들 가져오기
        const selectedRows = gridApiRef.current?.getSelectedRows();

        if (!selectedRows || selectedRows.length === 0) {
            toast({
                title: "알림",
                description: "수정할 주문을 하나만 선택해주세요.",
                variant: "default",
            });
            return;
        }

        const selectedData = selectedRows[0];
        openDialog(selectedData);
    }, [toast, openDialog]);

    /**
     * Delete Button Handler (Toolbar)
     */
    const handleDeleteClick = React.useCallback(async () => {
        const selectedRows = gridApiRef.current?.getSelectedRows();

        if (!selectedRows || selectedRows.length === 0) {
            toast({
                title: "알림",
                description: "삭제할 주문을 선택해주세요.",
                variant: "default",
            });
            return;
        }

        const orderIds = selectedRows.map(row => row.orderId);
        await handleDelete(orderIds);
    }, [handleDelete, toast]);

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0 z-20">
                <button
                    onClick={() => router.replace('/mainmobile')}
                    className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors -ml-2"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight flex-1 text-center">출고 처리</h1>
                <div className="w-12 flex items-center justify-end -mr-2">
                    <button className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
                        <History className="w-6 h-6 text-slate-900" />
                    </button>
                </div>
            </header>
            <SearchPageLayout>
                <DataTableToolbar
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onSearch={onSearch}
                    isLoading={isLoading}
                    initialStartDate={searchParams.startDate}
                    initialEndDate={searchParams.endDate}
                />
            </SearchPageLayout>
            <SOGrid
                rowData={orders}
                columnDefs={columns}
                defaultColDef={DEFAULT_COL_DEF}
                pagination={true}
                PaginationComponent={CustomPaginationM}
                serverSide={true}
                totalRows={totalRows}
                paginationPageSize={5}
                onPaginationChange={handlePaginationChange}
                loading={isLoading}
                onSortChange={handleSortChange}
                onGridReady={onGridReady}
                pageIndex={pagination.pageIndex}
            />

            <InputDialog
                open={dialogOpen}
                onOpenChange={closeDialog}
                item={selectedOrder}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
