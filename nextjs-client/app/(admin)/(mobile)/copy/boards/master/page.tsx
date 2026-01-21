"use client";

import * as React from "react";
import { getColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { InputDialog } from "./input-dialog";
import { useToast } from "@/hooks/use-toast";
import { SearchPageLayout } from "@/components/common/search-page-layout";
import { useBoardsMasterManagement } from "./hooks/use-board-master-management";
import { BoardsMaster } from './types';
import 'so-grid-react/styles.css';
import { CustomPagination } from "@/components/utils/CustomPagination";
import { PaginationState, SortModel } from "so-grid-core";
import { SOGrid, SOGridApi } from "so-grid-react";

export default function BoardsMasterPage() {
    const { toast } = useToast();

    // Management hook
    const {
        boards,
        totalRows,
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
        onSortChange,
    } = useBoardsMasterManagement();

    const columns = React.useMemo(() => getColumns(), []);

    const DEFAULT_COL_DEF = {
        headerStyle: { textAlign: 'center' as const },
        resizable: true,
    };

    // 그리드 API 참조
    const gridApiRef = React.useRef<SOGridApi<BoardsMaster> | null>(null);
    const onGridReady = React.useCallback((api: SOGridApi<BoardsMaster>) => {
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
                description: "수정할 게시판을 하나만 선택해주세요.",
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
                description: "삭제할 게시판을 선택해주세요.",
                variant: "default",
            });
            return;
        }

        const boardIds = selectedRows.map(row => row.brdId);
        await handleDelete(boardIds);
    }, [handleDelete, toast]);

    return (
        <div className="w-full space-y-6">
            <SearchPageLayout>
                <DataTableToolbar
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onSearch={onSearch}
                    isLoading={isLoading}
                    initialStartDate={searchParams.startDate as string | undefined}
                    initialEndDate={searchParams.endDate as string | undefined}
                />
            </SearchPageLayout>
            <SOGrid
                rowData={boards}
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
                onOpenChange={closeDialog}
                board={selectedBoard}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
