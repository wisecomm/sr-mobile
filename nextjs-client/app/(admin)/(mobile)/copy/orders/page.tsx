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

export default function OrdersPage() {
    const { toast } = useToast();

    // Use management hook
    const {
        orders,
        totalPages,
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
    } = useOrderManagement();

    // Define columns
    const columns = React.useMemo(() => getColumns(), []);

    // Table instance
    const table = useDataTable({
        data: orders,
        columns,
        pageCount: totalPages,
        pagination,
        onPaginationChange,
        enableMultiRowSelection: true,
    });

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
        const selectedRows = table.getSelectedRowModel().rows;

        if (selectedRows.length !== 1) {
            toast({
                title: "알림",
                description: "수정할 주문을 하나만 선택해주세요.",
                variant: "default",
            });
            return;
        }

        const order = selectedRows[0].original;
        openDialog(order);
    }, [table, toast, openDialog]);

    /**
     * Delete Button Handler (Toolbar)
     */
    const handleDeleteClick = React.useCallback(async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        if (selectedRows.length === 0) {
            toast({
                title: "알림",
                description: "삭제할 주문을 선택해주세요.",
                variant: "default",
            });
            return;
        }

        const orderIds = selectedRows.map(row => row.original.orderId);
        await handleDelete(orderIds);
        table.resetRowSelection();
    }, [table, handleDelete, toast]);

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
                <DataTable table={table} showSeparators={true} isLoading={isLoading} />
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
