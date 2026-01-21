"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
    Button,
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
    Input,
    Textarea,
    Switch,
} from "@/components/ui";
import { useInputForm } from "../hooks/use-input-form";
import { BoardsMaster } from '../types';

interface InputFormProps {
    board?: BoardsMaster | null;
    open: boolean;
    onCancel: () => void;
    onSubmit: (data: Partial<BoardsMaster>) => Promise<void>;
}

export function InputForm({ board, open, onCancel, onSubmit }: InputFormProps) {
    const { form, handleSubmit, isEdit } = useInputForm({ board, open, onSubmit });

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
                <FormField
                    control={form.control}
                    name="brdId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                게시판 코드 <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="block w-full sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground"
                                    placeholder="예: NOTICE, FREE, QNA"
                                    {...field}
                                    disabled={isEdit}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="brdNm"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                게시판 명 <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="block w-full sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground"
                                    placeholder="예: 공지사항, 자유게시판"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="brdDesc"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                게시판 설명
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className="block w-full sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground"
                                    placeholder="게시판에 대한 설명을 입력하세요"
                                    rows={3}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-6">
                    <FormField
                        control={form.control}
                        name="replyUseYn"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormLabel className="text-xs font-bold text-muted-foreground dark:text-muted-foreground">
                                    댓글 사용
                                </FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value === "1"}
                                        onCheckedChange={(checked) => field.onChange(checked ? "1" : "0")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fileUseYn"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormLabel className="text-xs font-bold text-muted-foreground dark:text-muted-foreground">
                                    파일 첨부
                                </FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value === "1"}
                                        onCheckedChange={(checked) => field.onChange(checked ? "1" : "0")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="useYn"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormLabel className="text-xs font-bold text-muted-foreground dark:text-muted-foreground">
                                    사용
                                </FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value === "1"}
                                        onCheckedChange={(checked) => field.onChange(checked ? "1" : "0")}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="fileMaxCnt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                최대 파일 첨부 수
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={0}
                                    max={20}
                                    className="w-24 sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="bg-background dark:bg-card border-t border-border dark:border-border pt-4 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={form.formState.isSubmitting}
                        className="px-4 py-2 bg-background dark:bg-card text-muted-foreground dark:text-muted-foreground border border-border dark:border-border rounded-md text-sm font-bold hover:bg-muted dark:hover:bg-muted"
                    >
                        취소
                    </Button>
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="px-6 py-2 bg-primary border border-transparent rounded-md shadow-sm text-sm font-bold text-white hover:opacity-90 hover:bg-primary disabled:opacity-50"
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                저장 중...
                            </>
                        ) : (
                            "저장"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
