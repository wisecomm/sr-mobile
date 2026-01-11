import * as React from "react";
import { RoleInfo } from "./types";
import { ShieldCheck } from "lucide-react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { InputForm } from "./input-form";

interface InputDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role?: RoleInfo | null;
    onSubmit: (data: Partial<RoleInfo>, menuIds: string[]) => Promise<void>;
}

export function InputDialog({ open, onOpenChange, role, onSubmit }: InputDialogProps) {
    const isEdit = !!role;

    return (
        <Dialog open={open} onOpenChange={onOpenChange} closeOnOutsideClick={false}>
            <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-background dark:bg-card rounded-xl border-none shadow-2xl">
                <div className="bg-background dark:bg-card px-6 py-5 border-b border-border dark:border-border flex items-center justify-between">
                    <h3 className="text-lg font-bold leading-6 text-foreground dark:text-foreground flex items-center gap-2">
                        <ShieldCheck className="text-primary w-6 h-6" />
                        {isEdit ? "권한 수정" : "권한 추가"}
                    </h3>
                </div>

                <InputForm
                    item={role}
                    onSubmit={onSubmit}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
