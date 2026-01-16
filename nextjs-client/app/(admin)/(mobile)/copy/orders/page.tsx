"use client";

import * as React from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { useDataTable } from "@/components/data-table/use-data-table";
import { SearchPageLayout } from "@/components/common/search-page-layout";
import { InputDialog } from "./input-dialog";
import { useOrderManagement } from "./hooks/use-order-management";
import { useToast } from "@/hooks/use-toast";
import 'so-grid-react/styles.css';
import { CustomPaginationM } from "@/components/utils/CustomPaginationM";
import { PaginationState } from "so-grid-core";
import { SOGrid } from "so-grid-react";

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

    const handlePaginationChange = React.useCallback((pagination: PaginationState) => {
        onPaginationChange(pagination);
    }, [onPaginationChange]);

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
