"use client";

import * as React from "react";
import { BoardsBoard } from "./hooks/use-board-query";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { BoardForm } from "./board-form";

interface BoardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    board?: BoardsBoard | null;
    defaultBrdId?: string;
    onSubmit: (data: Partial<BoardsBoard> & { deleteFileIds?: number[] }, files: File[] | null) => Promise<void>;
}

export function BoardDialog({ open, onOpenChange, board, defaultBrdId, onSubmit }: BoardDialogProps) {
    const isEdit = !!board;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-background dark:bg-card rounded-xl border-none shadow-2xl">
                <div className="bg-background dark:bg-card px-6 py-5 border-b border-border dark:border-border flex items-center justify-between">
                    <h3 className="text-lg font-bold leading-6 text-foreground dark:text-foreground flex items-center gap-2">
                        <FileText className="text-primary w-6 h-6" />
                        {isEdit ? "게시물 수정" : "게시물 작성"}
                    </h3>
                </div>

                <BoardForm
                    key={`${board?.boardId || 'new'}-${open ? 'open' : 'closed'}`}
                    board={board}
                    defaultBrdId={defaultBrdId}
                    onCancel={() => onOpenChange(false)}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}
