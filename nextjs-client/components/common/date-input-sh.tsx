"use client";

import * as React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

/**
 * 날짜 입력 컴포넌트 Props
 */
export interface DateInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void; // 호환성을 위해 유지하되 사용하지 않음
    placeholder?: string;
    className?: string;
    type?: string; // 호환성을 위해 유지
}

/**
 * Shadcn UI Calendar를 사용한 날짜 입력 컴포넌트
 */
export function DateInputSh({
    value,
    onChange,
    placeholder = "YYYY-MM-DD",
    className,
}: DateInputProps) {
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

    // 문자열 날짜를 Date 객체로 변환
    const date = React.useMemo(() => {
        if (!value) return undefined;
        const d = new Date(value);
        return isNaN(d.getTime()) ? undefined : d;
    }, [value]);

    const handleSelect = (newDate: Date | undefined) => {
        if (newDate) {
            onChange(format(newDate, "yyyy-MM-dd"));
            setIsCalendarOpen(false); // 날짜 선택 시 팝오버 닫기
        } else {
            onChange("");
        }
    };

    return (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[150px] justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    {date ? format(date, "yyyy-MM-dd") : <span>{placeholder}</span>}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    captionLayout="dropdown"
                    locale={ko}
                />
            </PopoverContent>
        </Popover>
    );
}

/**
 * 날짜 포맷 (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
