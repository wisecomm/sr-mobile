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
}

// shadcn ui time input 에서는 오전/오후 만 제공 24시간 제공시 따로 만들어야 함 
export function TimeInputSh({
    value = "",
    onChange,
    className,
    disabled = false,
}: TimeInputProps) {
    return (
        <div className={cn("flex items-center gap-1", className)}>
            <Input
                type="time"
                step="1"
                value={value}
                onChange={(e) => {
                    const val = e.target.value;
                    if (val.length === 5) {
                        onChange?.(val + ":00");
                    } else {
                        onChange?.(val);
                    }
                }}
                disabled={disabled}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-[120px]"
            />
        </div>
    );
}

/**
 * 시간 포맷 (HH:mm:ss  )
 */
export function formatTime(date: Date): string {
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    return `${hour}:${minute}:${second}`;
}
