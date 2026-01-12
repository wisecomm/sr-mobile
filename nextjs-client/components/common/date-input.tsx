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
    type?: "date" | "datetime-local" | "month" | "time";
}

/**
 * 날짜 입력 컴포넌트
 * 
 * 텍스트 입력 + 캘린더 아이콘 클릭 시 날짜 선택기 표시
 */
import { useToast } from "@/hooks/use-toast";

/**
 * 날짜 유효성 검사 (YYYY-MM-DD)
 */
function isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;

    const [year, month, day] = dateString.split('-').map(Number);
    return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
    );
}

export function DateInput({
    value,
    onChange,
    onKeyDown,
    placeholder = "YYYY-MM-DD",
    className = "w-[140px]",
    type = "date",
}: DateInputProps) {
    const dateRef = React.useRef<HTMLInputElement>(null);
    const [isError, setIsError] = React.useState(false);
    const lastValidValue = React.useRef(value);
    const { toast } = useToast();

    // 초기값 또는 외부에서 값이 변경될 때가 유효하다면 lastValidValue 업데이트
    React.useEffect(() => {
        if (!value || isValidDate(value)) {
            lastValidValue.current = value;
            setIsError(false);
        } else {
            setIsError(true);
        }
    }, [value]);

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

    const handleChange = (newValue: string) => {
        // 숫자와 하이픈만 허용
        const filteredValue = newValue.replace(/[^0-9-]/g, '');
        onChange(filteredValue);
    };

    const handleBlur = () => {
        // 빈 값은 허용 (유효한 것으로 간주)
        if (!value) return;

        if (!isValidDate(value)) {
            toast({
                title: "입력 오류",
                description: "유효하지 않은 날짜입니다. 이전 값으로 복원됩니다.",
                variant: "destructive",
            });
            onChange(lastValidValue.current);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={onKeyDown}
                className="pr-8"
                aria-invalid={isError}
            />
            <input
                type={type}
                ref={dateRef}
                className="absolute opacity-0 pointer-events-none"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
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
