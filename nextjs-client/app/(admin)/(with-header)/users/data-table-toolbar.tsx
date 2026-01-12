"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Download, Upload } from "lucide-react";
import { DateInputSh, ActionButtons, toolbarButtonClass } from "@/components/common";
import { useToast } from "@/hooks/use-toast";

interface DataTableToolbarProps {
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onSearch: (params: { userName: string; startDate: string; endDate: string }) => void;
    isLoading?: boolean;
    initialStartDate?: string;
    initialEndDate?: string;
    onDownloadExcel?: () => void;
    onUploadExcel?: (file: File) => void;
}

export function DataTableToolbar({
    onAdd,
    onEdit,
    onDelete,
    onSearch,
    isLoading,
    initialStartDate = "",
    initialEndDate = "",
    onDownloadExcel,
    onUploadExcel
}: DataTableToolbarProps) {
    const [userName, setUserName] = React.useState("");
    const [startDate, setStartDate] = React.useState(initialStartDate);
    const [endDate, setEndDate] = React.useState(initialEndDate);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const { toast } = useToast();

    const handleSearch = () => {
        if (startDate && endDate && startDate > endDate) {
            toast({
                title: "입력 오류",
                description: "종료일은 시작일보다 빠를 수 없습니다.",
                variant: "destructive",
            });
            return;
        }
        onSearch({ userName, startDate, endDate });
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onUploadExcel) {
            onUploadExcel(file);
        }
        e.target.value = '';
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex flex-1 items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">이름</span>
                        <Input
                            placeholder="사용자명 입력"
                            value={userName}
                            onChange={(event) => setUserName(event.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-[150px] lg:w-[200px]"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">등록일</span>
                        <DateInputSh
                            value={startDate}
                            onChange={setStartDate}
                            onKeyDown={handleKeyDown}
                        />
                        <span>-</span>
                        <DateInputSh
                            value={endDate}
                            onChange={setEndDate}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleSearch}
                        className={toolbarButtonClass}
                        disabled={isLoading}
                    >
                        <Search className="mr-2 h-4 w-4" />
                        조회
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    {onUploadExcel && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                            />
                            <Button
                                variant="outline"
                                onClick={handleUploadClick}
                                className={toolbarButtonClass}
                                disabled={isLoading}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                엑셀 업로드
                            </Button>
                        </>
                    )}
                    {onDownloadExcel && (
                        <Button
                            variant="outline"
                            onClick={onDownloadExcel}
                            className={toolbarButtonClass}
                            disabled={isLoading}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            엑셀 다운로드
                        </Button>
                    )}

                    {(onUploadExcel || onDownloadExcel) && (
                        <div className="w-[1px] h-4 bg-border mx-2" />
                    )}

                    <ActionButtons
                        onAdd={onAdd}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        disabled={isLoading}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
