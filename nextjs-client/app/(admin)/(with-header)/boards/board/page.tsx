"use client";

import * as React from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { InputDialog } from "./input-dialog";
import { useToast } from "@/hooks/use-toast";
import { useDataTable } from "@/components/data-table/use-data-table";
import { useSearchParams } from "next/navigation";
import { SearchPageLayout } from "@/components/common/search-page-layout";
import { useBoardManagement } from "./hooks/use-board-management";
import { BoardsBoardSearchParams } from "./hooks/use-board-query";

export default function BoardsPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <BoardsContent />
        </React.Suspense>
    );
}

function BoardsContent() {
    const { toast } = useToast();
    const searchParamsHook = useSearchParams();
    const brdIdParam = searchParamsHook.get("brdId") || "";

    // Management hook
    const {
        posts,
        totalPages,
        isLoading,
        pagination,
        onPaginationChange,
        searchParams,
        onSearch,
        setBoardId,
        dialogOpen,
        selectedPost,
        openDialog,
        closeDialog,
        handleSubmit,
        handleDelete,
    } = useBoardManagement(brdIdParam);

    // Sync URL param with management hook
    React.useEffect(() => {
        if (brdIdParam && searchParams.brdId !== brdIdParam) {
            setBoardId(brdIdParam);
        }
    }, [brdIdParam, searchParams.brdId, setBoardId]);

    const columns = React.useMemo(() => getColumns(), []);

    const table = useDataTable({
        data: posts,
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
                description: "수정할 게시물을 하나만 선택해주세요.",
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
                description: "삭제할 게시물을 선택해주세요.",
                variant: "default",
            });
            return;
        }

        const boardIds = selectedRows.map(row => row.original.boardId);
        await handleDelete(boardIds);
        table.resetRowSelection();
    }, [table, handleDelete, toast]);

    const handleSearch = (params: Partial<BoardsBoardSearchParams>) => {
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
                    initialStartDate={(searchParams.startDate as string) || ""}
                    initialEndDate={(searchParams.endDate as string) || ""}
                />
                <DataTable table={table} showSeparators={true} isLoading={isLoading} />
            </SearchPageLayout>

            <InputDialog
                open={dialogOpen}
                onOpenChange={(open) => !open && closeDialog()}
                board={selectedPost}
                defaultBrdId={searchParams.brdId}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
