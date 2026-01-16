"use client";

import * as React from "react";
import { getColumns } from "./columns";
import { OrderDetail } from "./types";
import { DataTableToolbar } from "./data-table-toolbar";
import { SearchPageLayout } from "@/components/common/search-page-layout";
import { InputDialog } from "./input-dialog";
import { useOrderManagement } from "./hooks/use-order-management";
import { useToast } from "@/hooks/use-toast";
import 'so-grid-react/styles.css';
import { CustomPaginationM } from "@/components/utils/CustomPaginationM";
import { PaginationState, SortModel } from "so-grid-core";
import { SOGrid, SOGridApi } from "so-grid-react";

export default function OrdersPage() {
    const { toast } = useToast();

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
    // 이 부분은 적용되야 소트, 검색때 페이지가 처리가됨
    const gridApiRef = React.useRef<SOGridApi<OrderDetail> | null>(null);
    const onGridReady = React.useCallback((api: SOGridApi<OrderDetail>) => {
        gridApiRef.current = api;
    }, []);

    // paginationState 변경 시 그리드 페이지 동기화
    React.useEffect(() => {
        if (gridApiRef.current && typeof gridApiRef.current.setPage === 'function') {
            // 현재 그리드의 페이지와 state가 다를 때만 호출하여 무한루프 방지
            if (gridApiRef.current.getPage() !== pagination.pageIndex) {
                gridApiRef.current.setPage(pagination.pageIndex);
            }
        }
    }, [pagination.pageIndex]);


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
        return;
    }, []);

    /**
     * Delete Button Handler (Toolbar)
     */
    const handleDeleteClick = React.useCallback(async () => {
        return;
    }, []);

    return (
        <div className="w-full space-y-6">
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
                />
            </SearchPageLayout>

            <InputDialog
                open={dialogOpen}
                onOpenChange={closeDialog}
                item={selectedOrder}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
