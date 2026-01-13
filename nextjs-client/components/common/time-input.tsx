"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TimeInputProps {
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    /** 시간 포맷: "HH:mm:ss" (초 포함) 또는 "HH:mm" (시:분만) */
    format?: "HH:mm:ss" | "HH:mm";
}

// shadcn ui time input 에서는 오전/오후 만 제공 24시간 제공시 따로 만들어야 함 
export function TimeInput({
    value = "",
    onChange,
    className,
    disabled = false,
    format = "HH:mm",
}: TimeInputProps) {
    const includeSeconds = format === "HH:mm:ss";

    // HH:mm:ss 형식 값을 HH:mm으로 변환 (format이 HH:mm인 경우)
    const displayValue = !includeSeconds && value.length > 5 ? value.slice(0, 5) : value;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (includeSeconds) {
            // HH:mm:ss 포맷: 5자리(HH:mm)면 :00 추가
            if (val.length === 5) {
                onChange?.(val + ":00");
            } else {
                onChange?.(val);
            }
        } else {
            onChange?.(val);
        }
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            <Input
                type="time"
                step={includeSeconds ? "1" : undefined}
                value={displayValue}
                onChange={handleChange}
                disabled={disabled}
                className={cn(
                    "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
                    includeSeconds ? "w-[120px]" : "w-[94px]"
                )}
            />
        </div>
    );
}

/**
 * 시간 포맷 (HH:mm:ss)
 */
export function formatTimeHHmmss(date: Date): string {
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    return `${hour}:${minute}:${second}`;
}
/**
 * 시간 포맷 (HH:mm)
 */
export function formatTimeHHmm(date: Date): string {
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${hour}:${minute}`;
}
