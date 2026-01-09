"use client";

import * as React from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { BoardDialog } from "./board-dialog";
import { useToast } from "@/hooks/use-toast";
import { useDataTable } from "@/components/data-table/use-data-table";
import { SearchPageLayout } from "@/components/common/search-page-layout";
import { useBoardsMasterManagement } from "@/hooks/use-boards-master-management";

export default function BoardsMasterPage() {
    const { toast } = useToast();

    // Management hook
    const {
        boards,
        totalPages,
        isLoading,
        pagination,
        onPaginationChange,
        searchParams,
        onSearch,
        dialogOpen,
        selectedBoard,
        openDialog,
        closeDialog,
        handleSubmit,
        handleDelete,
    } = useBoardsMasterManagement();

    const columns = React.useMemo(() => getColumns(), []);

    const table = useDataTable({
        data: boards,
        columns,
        pageCount: totalPages || -1,
        pagination,
        onPaginationChange,
        enableMultiRowSelection: false,
    });

    const handleAdd = React.useCallback(() => {
        openDialog();
    }, [openDialog]);

    const handleEdit = React.useCallback(() => {
        const selectedRows = table.getSelectedRowModel().rows;
        if (selectedRows.length !== 1) {
            toast({
                title: "알림",
                description: "수정할 게시판을 하나만 선택해주세요.",
                variant: "default",
            });
            return;
        }
        const board = selectedRows[0].original;
        openDialog(board);
    }, [table, toast, openDialog]);

    const handleDeleteClick = React.useCallback(async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        if (selectedRows.length === 0) {
            toast({
                title: "알림",
                description: "삭제할 게시판을 선택해주세요.",
                variant: "default",
            });
            return;
        }

        const boardIds = selectedRows.map(row => row.original.brdId);
        await handleDelete(boardIds);
        table.resetRowSelection();
    }, [table, handleDelete, toast]);

    const handleSearch = (params: { brdNm: string; startDate: string; endDate: string }) => {
        onSearch(params);
    };

    return (
        <div className="w-full space-y-6">
            <SearchPageLayout>
                <DataTableToolbar
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    initialStartDate={searchParams.startDate}
                    initialEndDate={searchParams.endDate}
                />
                <DataTable table={table} showSeparators={true} />
            </SearchPageLayout>

            <BoardDialog
                open={dialogOpen}
                onOpenChange={(open) => !open && closeDialog()}
                board={selectedBoard}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
