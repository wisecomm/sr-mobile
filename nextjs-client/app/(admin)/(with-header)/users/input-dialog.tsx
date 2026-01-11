import * as React from "react";
import { UserDetail } from "./types";
import { UserPlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { InputForm } from "./input-form";

interface InputDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: UserDetail | null;
    onSubmit: (data: Partial<UserDetail>, roleIds: string[]) => Promise<void>;
}

export function InputDialog({ open, onOpenChange, user, onSubmit }: InputDialogProps) {
    const isEdit = !!user;

    return (
        <Dialog open={open} onOpenChange={onOpenChange} closeOnOutsideClick={false}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-background dark:bg-card rounded-xl border-none shadow-2xl">
                <div className="bg-background dark:bg-card px-6 py-5 border-b border-border dark:border-border flex items-center justify-between">
                    <h3 className="text-lg font-bold leading-6 text-foreground dark:text-foreground flex items-center gap-2">
                        <UserPlus className="text-primary w-6 h-6" />
                        {isEdit ? "사용자 수정" : "사용자 추가"}
                    </h3>
                </div>

                <InputForm
                    item={user}
                    onSubmit={onSubmit}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
