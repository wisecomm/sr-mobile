"use client";

import * as React from "react";
import { getColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { InputDialog } from "./input-dialog";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { SearchPageLayout } from "@/components/common/search-page-layout";
import { useBoardManagement } from "./hooks/use-board-management";
import { BoardsBoard } from './types';
import 'so-grid-react/styles.css';
import { CustomPagination } from "@/components/utils/CustomPagination";
import { PaginationState, SortModel } from "so-grid-core";
import { SOGrid, SOGridApi } from "so-grid-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
        onSortChange,
        // Delete Confirmation
        deleteConfirmOpen,
        deleteTargetIds,
        openDeleteConfirm,
        closeDeleteConfirm,
        executeDelete,
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
                description: "삭제할 게시물을 선택해주세요.",
                variant: "default",
            });
            return;
        }

        const boardIds = selectedRows.map(row => row.boardId);
        openDeleteConfirm(boardIds);
    }, [openDeleteConfirm, toast]);

    return (
        <div className="w-full space-y-6">
            <SearchPageLayout>
                <DataTableToolbar
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onSearch={onSearch}
                    isLoading={isLoading}
                    initialStartDate={(searchParams.startDate as string) || ""}
                    initialEndDate={(searchParams.endDate as string) || ""}
                />
            </SearchPageLayout>
            <SOGrid
                rowData={posts}
                columnDefs={columns}
                defaultColDef={DEFAULT_COL_DEF}
                pagination={true}
                PaginationComponent={CustomPagination}
                serverSide={true}
                totalRows={totalRows}
                paginationPageSize={pagination.pageSize}
                onPaginationChange={handlePaginationChange}
                loading={isLoading}
                onSortChange={handleSortChange}
                onGridReady={onGridReady}
                pageIndex={pagination.pageIndex}
            />

            <InputDialog
                open={dialogOpen}
                onOpenChange={(open) => !open && closeDialog()}
                board={selectedPost}
                defaultBrdId={brdIdParam}
                onSubmit={handleSubmit}
            />

            <Dialog open={deleteConfirmOpen} onOpenChange={closeDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>게시물 삭제</DialogTitle>
                        <DialogDescription>
                            선택한 {deleteTargetIds.length}개의 게시물을 삭제하시겠습니까?
                            <br />
                            이 작업은 되돌릴 수 없습니다.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeDeleteConfirm}>
                            취소
                        </Button>
                        <Button variant="destructive" onClick={executeDelete}>
                            삭제
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
