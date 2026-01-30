"use client"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useInputForm } from "./hooks/use-input-form"
import { OrderDetail } from "./types"
import { DateInput } from "@/components/common"


interface InputFormProps {
    item?: OrderDetail | null
    onSubmit: (data: Partial<OrderDetail>) => Promise<void>
    onCancel: () => void
    isSaving?: boolean
}

export function InputForm({ item, onSubmit, onCancel, isSaving = false }: InputFormProps) {
    const { form, handleSubmit, isEdit } = useInputForm({ item, onSubmit })

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="orderId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>주문번호</FormLabel>
                                <FormControl>
                                    <Input placeholder="주문번호 입력" {...field} disabled={isEdit} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="custNm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>고객명</FormLabel>
                                <FormControl>
                                    <Input placeholder="고객명 입력" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="orderNm"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>주문명</FormLabel>
                            <FormControl>
                                <Input placeholder="주문명 입력" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="orderStatus"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>주문 상태</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="상태 선택" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ORDERED">주문됨</SelectItem>
                                        <SelectItem value="PAID">결제됨</SelectItem>
                                        <SelectItem value="SHIPPED">배송중</SelectItem>
                                        <SelectItem value="COMPLETED">완료됨</SelectItem>
                                        <SelectItem value="CANCELLED">취소됨</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="orderAmt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>주문 금액</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="금액 입력" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="orderDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>주문 일시</FormLabel>
                                <FormControl>
                                    <DateInput
                                        {...field}
                                        placeholder="주문 일시 선택"
                                        value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ""}
                                        onChange={(value) => {
                                            const date = new Date(value);
                                            // Ensure valid date before setting
                                            if (!isNaN(date.getTime())) {
                                                field.onChange(date.toISOString());
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="useYn"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>사용 여부</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="선택" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1">사용</SelectItem>
                                        <SelectItem value="0">미사용</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
                        취소
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? '저장 중...' : (isEdit ? '수정' : '등록')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
