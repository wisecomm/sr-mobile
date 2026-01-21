"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InputForm } from "./input-form";
import { useBoardsMasterDetail, useCreateBoardsMaster, useUpdateBoardsMaster } from "../hooks/use-board-master-query";
import { BoardsMaster } from "../types";

export default function BoardMasterDetailClientPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const brdId = params.brdId as string;
    const isNew = brdId === "new";

    // Query
    const { data: board, isLoading: isQueryLoading } = useBoardsMasterDetail(isNew ? undefined : brdId);

    // Mutations
    const createMutation = useCreateBoardsMaster();
    const updateMutation = useUpdateBoardsMaster();

    const handleSubmit = async (data: Partial<BoardsMaster>) => {
        try {
            if (isNew) {
                await createMutation.mutateAsync(data);
                toast({
                    title: "성공",
                    description: "게시판이 등록되었습니다.",
                });
            } else {
                await updateMutation.mutateAsync({ id: brdId, data });
                toast({
                    title: "성공",
                    description: "게시판이 수정되었습니다.",
                });
            }
            router.back();
        } catch (error) {
            console.error(error);
            toast({
                title: "오류",
                description: "작업 중 오류가 발생했습니다.",
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (!isNew && isQueryLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="w-full max-w-[100vw] overflow-x-hidden h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-300 shrink-0 z-20">
                <button
                    onClick={handleCancel}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                    {isNew ? "게시판 등록" : "게시판 수정"}
                </h1>
                <div className="w-10 h-10" />
            </header>

            <main className="flex-1 overflow-y-auto p-4 pb-safe">
                <InputForm
                    board={board}
                    open={true} // Always open as it's a page
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                />
            </main>
        </div>
    );
}
