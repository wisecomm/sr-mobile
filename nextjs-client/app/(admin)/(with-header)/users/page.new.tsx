"use client";

/**
 * Users Page (Refactored)
 * 
 * 비즈니스 로직을 커스텀 훅으로 분리하여 간결하고 명확한 구조
 */

import * as React from "react";
import { getColumns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { useDataTable } from "@/components/data-table/use-data-table";
import { SearchPageLayout } from "@/components/common/search-page-layout";
import { UserDialog } from "./user-dialog";
import { useUserManagement } from "@/hooks/use-user-management";
import { useToast } from "@/hooks/use-toast";

export default function UsersPage() {
    const { toast } = useToast();
    
    // 모든 비즈니스 로직을 커스텀 훅에서 관리
    const {
        users,
        totalPages,
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
    } = useUserManagement();
    
    // 테이블 컬럼 설정
    const columns = React.useMemo(() => getColumns(), []);
    
    // 테이블 인스턴스
    const table = useDataTable({
        data: users,
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
                description: "수정할 사용자를 한 명만 선택해주세요.",
                variant: "default",
            });
            return;
        }
        
        const user = selectedRows[0].original;
        openDialog(user);
    }, [table, toast, openDialog]);
    
    /**
     * 삭제 버튼 핸들러
     */
    const handleDeleteClick = React.useCallback(async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const userIds = selectedRows.map(row => row.original.userId);
        
        await handleDelete(userIds);
        table.resetRowSelection();
    }, [table, handleDelete]);
    
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
                <DataTable table={table} showSeparators={true} />
            </SearchPageLayout>

            <UserDialog
                open={dialogOpen}
                onOpenChange={closeDialog}
                user={selectedUser}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
