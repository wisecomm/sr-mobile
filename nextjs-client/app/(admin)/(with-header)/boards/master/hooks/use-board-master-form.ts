import { useEffect, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BoardsMaster } from "./use-board-master-query";

const boardFormSchema = z.object({
    brdId: z.string().min(1, "게시판 코드는 필수입니다.").max(20, "게시판 코드는 20자 이하여야 합니다."),
    brdNm: z.string().min(1, "게시판 명은 필수입니다.").max(100, "게시판 명은 100자 이하여야 합니다."),
    brdDesc: z.string(),
    replyUseYn: z.string(),
    fileUseYn: z.string(),
    fileMaxCnt: z.number().min(0).max(20),
    useYn: z.string(),
});

export type BoardMasterFormValues = z.infer<typeof boardFormSchema>;

export interface UseBoardMasterFormProps {
    board?: BoardsMaster | null;
    open: boolean;
    onSubmit: (data: Partial<BoardsMaster>) => Promise<void>;
}

export interface UseBoardMasterFormReturn {
    form: UseFormReturn<BoardMasterFormValues>;
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isEdit: boolean;
}

export function useBoardMasterForm({ board, open, onSubmit }: UseBoardMasterFormProps): UseBoardMasterFormReturn {
    const isEdit = !!board;

    const form = useForm<BoardMasterFormValues>({
        resolver: zodResolver(boardFormSchema),
        defaultValues: {
            brdId: "",
            brdNm: "",
            brdDesc: "",
            replyUseYn: "1",
            fileUseYn: "1",
            fileMaxCnt: 5,
            useYn: "1",
        },
    });

    useEffect(() => {
        if (open) {
            if (board) {
                form.reset({
                    brdId: board.brdId || "",
                    brdNm: board.brdNm || "",
                    brdDesc: board.brdDesc || "",
                    replyUseYn: board.replyUseYn || "1",
                    fileUseYn: board.fileUseYn || "1",
                    fileMaxCnt: board.fileMaxCnt || 5,
                    useYn: board.useYn || "1",
                });
            } else {
                form.reset({
                    brdId: "",
                    brdNm: "",
                    brdDesc: "",
                    replyUseYn: "1",
                    fileUseYn: "1",
                    fileMaxCnt: 5,
                    useYn: "1",
                });
            }
        }
    }, [open, board, form]);

    const onFormSubmit = useCallback(async (data: BoardMasterFormValues) => {
        await onSubmit(data);
    }, [onSubmit]);

    return {
        form,
        handleSubmit: form.handleSubmit(onFormSubmit),
        isEdit,
    };
}
