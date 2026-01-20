"use client";

/**
 * Users Page (Refactored)
 * 
 * 비즈니스 로직을 커스텀 훅으로 분리하여 간결하고 명확한 구조
 */

import * as React from "react";
import 'so-grid-react/styles.css';
import { getColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { SearchPageLayout } from "@/components/common/search-page-layout";
import { InputDialog } from "./input-dialog";
import { useUserManagement } from "./hooks/use-user-management";
import { useToast } from "@/hooks/use-toast";
import { useExcel } from "@/hooks/use-excel";
import { formatDate } from '@/components/common';
import { PaginationState, SOGrid, SOGridApi, SortModel } from "so-grid-react";
import { UserDetail } from "./types";
import { CustomPagination } from "@/components/utils/CustomPagination";

export default function UsersPage() {
    const { toast } = useToast();
    const { downloadExcel, uploadExcel, isDownloading, isUploading } = useExcel();

    // 모든 비즈니스 로직을 커스텀 훅에서 관리
    const {
        users,
        totalRows,
        isLoading,
        pagination,
        onPaginationChange,
        searchParams,
        onSearch,
        dialogOpen,
        selectedUser,
        openDialog,
        closeDialog,
        handleSubmit,
        handleDelete,
        onSortChange,
    } = useUserManagement();

    // 테이블 컬럼 설정
    const columns = React.useMemo(() => getColumns(), []);

    const DEFAULT_COL_DEF = {
        headerStyle: { textAlign: 'center' as const },
        resizable: true,
    };

    // 그리드 API 참조
    const gridApiRef = React.useRef<SOGridApi<UserDetail> | null>(null);
    const onGridReady = React.useCallback((api: SOGridApi<UserDetail>) => {
        gridApiRef.current = api;
    }, []);

    /**
     * 추가 버튼 핸들러
     */
    const handleAdd = React.useCallback(() => {
        openDialog();
    }, [openDialog]);

    const handlePaginationChange = React.useCallback((pagination: PaginationState) => {
        onPaginationChange(pagination);
    }, [onPaginationChange]);

    const handleSortChange = React.useCallback((sort: SortModel[]) => {
        onSortChange(sort);
    }, [onSortChange]);

    /**
     * 수정 버튼 핸들러
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
     * 삭제 버튼 핸들러
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

        const userIds = selectedRows.map(row => row.userId);
        await handleDelete(userIds);
    }, [handleDelete, toast]);

    /**
     * 엑셀 다운로드 핸들러
     */
    const handleDownloadExcel = React.useCallback(() => {
        const today = formatDate(new Date());
        downloadExcel('/v1/mgmt/users/excel/download', `사용자목록_${today}.xlsx`, {
            userName: searchParams.userName,
            startDate: searchParams.startDate,
            endDate: searchParams.endDate,
        });
    }, [downloadExcel, searchParams]);

    /**
     * 엑셀 업로드 핸들러
     */
    const handleUploadExcel = React.useCallback((file: File) => {
        uploadExcel('/v1/mgmt/users/excel/upload', file, () => {
            // 성공 시 목록 갱신
            onSearch(searchParams);
        });
    }, [uploadExcel, onSearch, searchParams]);

    return (
        <div className="w-full space-y-6">
            <SearchPageLayout>
                <DataTableToolbar
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onSearch={onSearch}
                    isLoading={isLoading || isDownloading || isUploading}
                    initialStartDate={searchParams.startDate as string}
                    initialEndDate={searchParams.endDate as string}
                    onDownloadExcel={handleDownloadExcel}
                    onUploadExcel={handleUploadExcel}
                />
            </SearchPageLayout>
            <SOGrid
                rowData={users}
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
                user={selectedUser}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
