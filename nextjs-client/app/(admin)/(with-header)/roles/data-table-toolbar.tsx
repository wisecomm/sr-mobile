"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { ActionButtons, toolbarButtonClass } from "@/components/common";

interface DataTableToolbarProps {
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => Promise<void>;
    onSearch: (term: string) => void;
}

export function DataTableToolbar({
    onAdd,
    onEdit,
    onDelete,
    onSearch,
}: DataTableToolbarProps) {
    const [searchTerm, setSearchTerm] = React.useState("");

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center space-x-2">
                    <span className="text-sm font-medium whitespace-nowrap">권한 아이디</span>
                    <Input
                        placeholder="권한 아이디 입력"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-9 w-[150px] lg:w-[250px]"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSearch}
                        className={toolbarButtonClass}
                    >
                        <Search className="mr-2 h-4 w-4" />
                        조회
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <ActionButtons
                        onAdd={onAdd}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
