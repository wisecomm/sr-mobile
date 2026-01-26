"use client";

import * as React from "react";
import { getColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { InputDialog } from "./input-dialog";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useBoardManagement } from "./hooks/use-board-management";
import { BoardsBoard } from './types';
import 'so-grid-react/styles.css';
import { PaginationState, SortModel } from "so-grid-core";
import { SOGrid, SOGridApi } from "so-grid-react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomPaginationM } from "@/components/utils/CustomPaginationM";

export default function BoardsPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <BoardsContent />
        </React.Suspense>
    );
}

function BoardsContent() {
    const { toast } = useToast();
    const router = useRouter();

    const searchParamsHook = useSearchParams();
    const brdIdParam = searchParamsHook.get("brdId") || "";

    // Management hook
    const {
        posts,
        totalRows,
        isLoading,
        pagination,
        onPaginationChange,
        searchParams,
        onSearch,
        dialogOpen,
        selectedPost,
        openDialog,
        closeDialog,
        handleSubmit,
        handleDelete,
        onSortChange,
    } = useBoardManagement(brdIdParam);

    const columns = React.useMemo(() => getColumns(), []);

    const DEFAULT_COL_DEF = {
        headerStyle: { textAlign: 'center' as const },
        resizable: true,
    };

    // 그리드 API 참조
    const gridApiRef = React.useRef<SOGridApi<BoardsBoard> | null>(null);
    const onGridReady = React.useCallback((api: SOGridApi<BoardsBoard>) => {
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

        const boardIds = selectedRows.map(row => row.boardId);
        await handleDelete(boardIds);
    }, [handleDelete, toast]);

    return (
        <div className="w-full max-w-[100vw] overflow-x-hidden h-screen flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-300 shrink-0 z-20">
                <button
                    onClick={() => router.replace('/mainmobile')}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">주문 등록</h1>
                <div className="w-10 h-10" />
            </header>

            <main className="flex-1 overflow-y-auto overflow-x-auto space-y-2 mt-2 mx-2">
                <DataTableToolbar
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onSearch={onSearch}
                    isLoading={isLoading}
                    initialStartDate={(searchParams.startDate as string) || ""}
                    initialEndDate={(searchParams.endDate as string) || ""}
                />
                <SOGrid
                    rowData={posts}
                    columnDefs={columns}
                    defaultColDef={DEFAULT_COL_DEF}
                    pagination={true}
                    PaginationComponent={CustomPaginationM}
                    serverSide={true}
                    totalRows={totalRows}
                    paginationPageSize={pagination.pageSize}
                    onPaginationChange={handlePaginationChange}
                    loading={isLoading}
                    onSortChange={handleSortChange}
                    onGridReady={onGridReady}
                    pageIndex={pagination.pageIndex}
                />
            </main>

            <InputDialog
                open={dialogOpen}
                onOpenChange={(open) => !open && closeDialog()}
                board={selectedPost}
                defaultBrdId={brdIdParam}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
