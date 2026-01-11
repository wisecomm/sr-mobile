"use client";

/**
 * Roles Page (Refactored)
 * 
 * 비즈니스 로직을 커스텀 훅으로 분리하여 간결하고 명확한 구조
 */

import * as React from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { useDataTable } from "@/components/data-table/use-data-table";
import { SearchPageLayout } from "@/components/common/search-page-layout";
import { InputDialog } from "./input-dialog";
import { useRoleManagement, RoleManagementSearchParams } from "./hooks/use-role-management";
import { useToast } from "@/hooks/use-toast";

export default function RolesPage() {
    const { toast } = useToast();

    // 모든 비즈니스 로직을 커스텀 훅에서 관리
    const {
        roles,
        totalPages,
        isLoading,
        pagination,
        onPaginationChange,
        onSearch,
        dialogOpen,
        selectedRole,
        openDialog,
        closeDialog,
        handleSubmit,
        handleDelete,
    } = useRoleManagement();

    // 테이블 컬럼 설정
    const columns = React.useMemo(() => getColumns(), []);

    // 테이블 인스턴스
    const table = useDataTable({
        data: roles,
        columns,
        pageCount: totalPages,
        pagination,
        onPaginationChange,
        enableMultiRowSelection: false, // 단일 선택 모드
    });

    /**
     * 추가 버튼 핸들러
     */
    const handleAdd = React.useCallback(() => {
        openDialog();
    }, [openDialog]);

    /**
     * 수정 버튼 핸들러
     */
    const handleEdit = React.useCallback(() => {
        const selectedRows = table.getSelectedRowModel().rows;

        if (selectedRows.length !== 1) {
            toast({
                title: "알림",
                description: "수정할 권한을 하나만 선택해주세요.",
                variant: "default",
            });
            return;
        }

        const role = selectedRows[0].original;
        openDialog(role);
    }, [table, toast, openDialog]);

    /**
     * 삭제 버튼 핸들러
     */
    const handleDeleteClick = React.useCallback(async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const roleIds = selectedRows.map(row => row.original.roleId);

        await handleDelete(roleIds);
        table.resetRowSelection();
    }, [table, handleDelete]);

    const handleSearch = (params: Partial<RoleManagementSearchParams>) => {
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
                />
                <DataTable table={table} showSeparators={true} isLoading={isLoading} />
            </SearchPageLayout>

            <InputDialog
                open={dialogOpen}
                onOpenChange={closeDialog}
                role={selectedRole}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
