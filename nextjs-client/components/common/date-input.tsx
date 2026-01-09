"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

/**
 * 날짜 입력 컴포넌트 Props
 */
export interface DateInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    placeholder?: string;
    className?: string;
}

/**
 * 날짜 입력 컴포넌트
 * 
 * 텍스트 입력 + 캘린더 아이콘 클릭 시 날짜 선택기 표시
 */
export function DateInput({
    value,
    onChange,
    onKeyDown,
    placeholder = "YYYY-MM-DD",
    className = "w-[140px]",
}: DateInputProps) {
    const dateRef = React.useRef<HTMLInputElement>(null);

    const handleDateIconClick = () => {
        if (dateRef.current) {
            try {
                dateRef.current.showPicker();
            } catch {
                dateRef.current.focus();
                dateRef.current.click();
            }
        }
    };

    return (
        <div className={`relative ${className}`}>
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                className="pr-8"
            />
            <input
                type="date"
                ref={dateRef}
                className="absolute opacity-0 pointer-events-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{ right: 0, bottom: 0, width: 1, height: 1 }}
                tabIndex={-1}
            />
            <button
                className="absolute right-0 top-0 h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                type="button"
                onClick={handleDateIconClick}
            >
                <Calendar className="h-4 w-4" />
            </button>
        </div>
    );
}

/**
 * 오늘 날짜 포맷 (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * 오늘 날짜 문자열
 */
export function getTodayString(): string {
    return formatDate(new Date());
}
