"use client";

import * as React from "react";
import { BoardsMaster } from "./hooks/use-board-master-query";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { LayoutDashboard } from "lucide-react";
import { BoardForm } from "./board-form";

interface BoardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    board?: BoardsMaster | null;
    onSubmit: (data: Partial<BoardsMaster>) => Promise<void>;
}

export function BoardDialog({ open, onOpenChange, board, onSubmit }: BoardDialogProps) {
    const isEdit = !!board;

    return (
        <Dialog open={open} onOpenChange={onOpenChange} closeOnOutsideClick={false}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-background dark:bg-card rounded-xl border-none shadow-2xl">
                <div className="bg-background dark:bg-card px-6 py-5 border-b border-border dark:border-border flex items-center justify-between">
                    <h3 className="text-lg font-bold leading-6 text-foreground dark:text-foreground flex items-center gap-2">
                        <LayoutDashboard className="text-primary w-6 h-6" />
                        {isEdit ? "게시판 수정" : "게시판 추가"}
                    </h3>
                </div>

                <BoardForm
                    board={board}
                    open={open}
                    onCancel={() => onOpenChange(false)}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}
