"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { OrderDetail } from "./types"
import { InputForm } from "./input-form"

interface InputDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    item: OrderDetail | null
    onSubmit: (data: Partial<OrderDetail>) => Promise<void>
    isSaving?: boolean
}

export function InputDialog({ open, onOpenChange, item, onSubmit, isSaving }: InputDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{item ? '주문 수정' : '주문 등록'}</DialogTitle>
                    <DialogDescription>
                        {item ? '주문 정보를 수정합니다.' : '새로운 주문을 등록합니다.'}
                    </DialogDescription>
                </DialogHeader>
                <InputForm
                    item={item}
                    onSubmit={onSubmit}
                    onCancel={() => onOpenChange(false)}
                    isSaving={isSaving}
                />
            </DialogContent>
        </Dialog>
    )
}
