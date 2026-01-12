"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DateInput, ActionButtons, toolbarButtonClass } from "@/components/common";
import { useToast } from "@/hooks/use-toast";

interface DataTableToolbarProps {
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onSearch: (params: {
        brdId: string;
        searchType: string;
        keyword: string;
        startDate: string;
        endDate: string
    }) => void;
    isLoading?: boolean;
    initialStartDate?: string;
    initialEndDate?: string;
}

export function DataTableToolbar({
    onAdd,
    onEdit,
    onDelete,
    onSearch,
    isLoading,
    initialStartDate = "",
    initialEndDate = ""
}: DataTableToolbarProps) {
    const [searchType, setSearchType] = React.useState("title");
    const [keyword, setKeyword] = React.useState("");
    const [startDate, setStartDate] = React.useState(initialStartDate);
    const [endDate, setEndDate] = React.useState(initialEndDate);

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
        onSearch({ brdId: "", searchType, keyword, startDate, endDate });
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex flex-1 items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">검색</span>
                        <Select value={searchType} onValueChange={setSearchType}>
                            <SelectTrigger className="w-[100px] h-9">
                                <SelectValue placeholder="유형" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="title">제목</SelectItem>
                                <SelectItem value="contents">내용</SelectItem>
                                <SelectItem value="userId">작성자</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="검색어 입력"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-[200px] h-9"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium whitespace-nowrap">기간</span>
                        <DateInput
                            value={startDate}
                            onChange={setStartDate}
                            onKeyDown={handleKeyDown}
                            className="w-[130px]"
                        />
                        <span>~</span>
                        <DateInput
                            value={endDate}
                            onChange={setEndDate}
                            onKeyDown={handleKeyDown}
                            className="w-[130px]"
                        />
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleSearch}
                        disabled={isLoading}
                        className={toolbarButtonClass}
                    >
                        <Search className="mr-2 h-4 w-4" />
                        조회
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
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
