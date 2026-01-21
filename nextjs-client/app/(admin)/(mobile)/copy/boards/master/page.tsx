"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { useToast } from "@/hooks/use-toast";
import { useBoardsMasterManagement } from "./hooks/use-board-master-management";
import { BoardsMaster } from './types';
import 'so-grid-react/styles.css';
import { PaginationState, SortModel } from "so-grid-core";
import { SOGrid, SOGridApi } from "so-grid-react";
import { CustomPaginationM } from "@/components/utils/CustomPaginationM";

export default function BoardsMasterPage() {
    const { toast } = useToast();
    const router = useRouter();

    // Management hook
    const {
        boards,
        totalRows,
        isLoading,
        pagination,
        onPaginationChange,
        searchParams,
        onSearch,
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
        router.push('/copy/boards/master/new');
    }, [router]);

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
        router.push(`/copy/boards/master/${selectedData.brdId}`);
    }, [toast, router]);

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
                    initialStartDate={searchParams.startDate as string | undefined}
                    initialEndDate={searchParams.endDate as string | undefined}
                />
                <SOGrid
                    rowData={boards}
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
        </div>
    );
}
