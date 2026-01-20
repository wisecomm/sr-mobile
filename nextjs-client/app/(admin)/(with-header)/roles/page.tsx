"use client";

/**
 * Roles Page (Refactored)
 * 
 * 비즈니스 로직을 커스텀 훅으로 분리하여 간결하고 명확한 구조
 */

import * as React from "react";
import { getColumns } from "./columns";
import { DataTableToolbar } from "./data-table-toolbar";
import { SearchPageLayout } from "@/components/common/search-page-layout";
import { InputDialog } from "./input-dialog";
import { useRoleManagement } from "./hooks/use-role-management";
import { useToast } from "@/hooks/use-toast";
import 'so-grid-react/styles.css';
import { CustomPagination } from "@/components/utils/CustomPagination";
import { PaginationState, SortModel } from "so-grid-core";
import { SOGrid, SOGridApi } from "so-grid-react";
import { RoleInfo } from "./types";

export default function RolesPage() {
    const { toast } = useToast();

    // 모든 비즈니스 로직을 커스텀 훅에서 관리
    const {
        roles,
        totalRows,
        isLoading,
        pagination,
        onPaginationChange,
        //        searchParams,
        onSearch,
        dialogOpen,
        selectedRole,
        openDialog,
        closeDialog,
        handleSubmit,
        handleDelete,
        onSortChange,
    } = useRoleManagement();

    // 테이블 컬럼 설정
    const columns = React.useMemo(() => getColumns(), []);

    const DEFAULT_COL_DEF = {
        headerStyle: { textAlign: 'center' as const },
        resizable: true,
    };

    // 그리드 API 참조
    const gridApiRef = React.useRef<SOGridApi<RoleInfo> | null>(null);
    const onGridReady = React.useCallback((api: SOGridApi<RoleInfo>) => {
        gridApiRef.current = api;
    }, []);


    const handlePaginationChange = React.useCallback((pagination: PaginationState) => {
        onPaginationChange(pagination);
    }, [onPaginationChange]);

    const handleSortChange = React.useCallback((sort: SortModel[]) => {
        onSortChange(sort);
    }, [onSortChange]);


    /**
     * 추가 버튼 핸들러
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

        const roleIds = selectedRows.map(row => row.roleId);
        await handleDelete(roleIds);
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
                />
            </SearchPageLayout>
            <SOGrid
                rowData={roles}
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
                role={selectedRole}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
