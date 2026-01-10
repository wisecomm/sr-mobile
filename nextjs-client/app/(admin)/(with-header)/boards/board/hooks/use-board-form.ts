import { useEffect, useState, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BoardsBoard, BoardsBoardFile, useBoardsBoardDetail, boardsBoardApi } from "./use-board-query";

const boardFormSchema = z.object({
    brdId: z.string().min(1, "게시판을 선택해주세요."),
    title: z.string().min(1, "제목은 필수입니다.").max(1000, "제목은 1000자 이하여야 합니다."),
    contents: z.string().optional(),
    secretYn: z.string(),
    useYn: z.string(),
});

export type BoardFormValues = z.infer<typeof boardFormSchema>;

export interface UseBoardFormProps {
    board?: BoardsBoard | null;
    defaultBrdId?: string;
    // open: boolean; // Removed to avoid unused variable lint, functionality handled by key-remount 
    onSubmit: (data: Partial<BoardsBoard> & { deleteFileIds?: number[] }, files: File[] | null) => Promise<void>;
}

export interface UseBoardFormReturn {
    form: UseFormReturn<BoardFormValues>;
    files: File[];
    setFiles: (files: File[]) => void;
    existingFiles: BoardsBoardFile[];
    handleDeleteExisting: (fileId: number) => void;
    handleDownload: (fileId: number) => Promise<void>;
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isEdit: boolean;
}

export function useBoardForm({ board, defaultBrdId, onSubmit }: Omit<UseBoardFormProps, 'open'>): UseBoardFormReturn {
    const isEdit = !!board;

    const form = useForm<BoardFormValues>({
        resolver: zodResolver(boardFormSchema),
        defaultValues: {
            brdId: defaultBrdId || "",
            title: "",
            contents: "",
            secretYn: "0",
            useYn: "1",
        },
    });

    const { data: boardDetail } = useBoardsBoardDetail(board?.boardId);
    const effectiveBoard = boardDetail || board;

    const [files, setFiles] = useState<File[]>([]);
    const [existingFiles, setExistingFiles] = useState<BoardsBoardFile[]>([]);
    const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);

    useEffect(() => {
        if (effectiveBoard) {
            // Check if we need to reset to avoid infinite loop / extra renders if data is stable
            // In a real app we might deep compare, but here relying on effectiveBoard ref change is standard.
            // We'll wrap in a check if form values match to suppress some re-renders if needed, 
            // but for now, we just acknowledge the reset.
            form.reset({
                brdId: effectiveBoard.brdId || "",
                title: effectiveBoard.title || "",
                contents: effectiveBoard.contents || "",
                secretYn: effectiveBoard.secretYn || "0",
                useYn: effectiveBoard.useYn || "1",
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setExistingFiles(effectiveBoard.fileList || []);
        }
    }, [effectiveBoard, form]);

    const onFormSubmit = async (data: BoardFormValues) => {
        await onSubmit({ ...data, deleteFileIds: deletedFileIds }, files);
    };

    const handleDeleteExisting = useCallback((fileId: number) => {
        setExistingFiles((prev) => prev.filter((f) => f.fileId !== fileId));
        setDeletedFileIds((prev) => [...prev, fileId]);
    }, []);

    const handleDownload = useCallback(async (fileId: number) => {
        const file = existingFiles.find((f) => f.fileId === fileId);
        if (file) {
            await boardsBoardApi.downloadFile(fileId, file.orgFileNm);
        }
    }, [existingFiles]);

    return {
        form,
        files,
        setFiles,
        existingFiles,
        handleDeleteExisting,
        handleDownload,
        handleSubmit: form.handleSubmit(onFormSubmit),
        isEdit,
    };
}
