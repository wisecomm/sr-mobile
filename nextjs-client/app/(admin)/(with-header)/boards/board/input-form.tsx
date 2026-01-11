"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/file-upload";
import { useInputForm } from "./hooks/use-input-form";
import { BoardsBoard } from "./hooks/use-board-query";

export interface InputFormProps {
    board?: BoardsBoard | null;
    defaultBrdId?: string;
    onCancel: () => void;
    onSubmit: (data: Partial<BoardsBoard> & { deleteFileIds?: number[] }, files: File[] | null) => Promise<void>;
}

export function InputForm({ board, defaultBrdId, onCancel, onSubmit }: InputFormProps) {
    const {
        form,
        files,
        setFiles,
        existingFiles,
        handleDeleteExisting,
        handleDownload,
        handleSubmit,
    } = useInputForm({ board, defaultBrdId, onSubmit });

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                제목 <span className="text-primary">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="block w-full sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground"
                                    placeholder="제목을 입력하세요"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contents"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                내용
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className="block w-full sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground min-h-[150px]"
                                    placeholder="내용을 입력하세요"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <FileUpload
                        files={files}
                        onFilesChange={setFiles}
                        existingFiles={existingFiles}
                        onDeleteExisting={handleDeleteExisting}
                        onDownloadExisting={handleDownload}
                        maxSize={50 * 1024 * 1024}
                    />
                </div>

                <div className="flex gap-6">
                    <FormField
                        control={form.control}
                        name="secretYn"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3">
                                <FormLabel className="text-xs font-bold text-muted-foreground dark:text-muted-foreground">
                                    비밀글
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
