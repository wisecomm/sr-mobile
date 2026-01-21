import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/store/use-app-store";
import { login, getAccessToken } from "@/app/actions/auth-actions";
import { sessionManager } from "@/lib/auth/session-manager";

// Schema Definition
export const accountFormSchema = z.object({
    userId: z.string().min(1, {
        message: "사용자 아이디를 입력하세요.",
    }),
    userPwd: z.string().min(4, {
        message: "패스워드는 4자리 이상입니다.",
    }),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;

const defaultValues: Partial<AccountFormValues> = {
    userId: "admin",
    userPwd: "12345678",
};

export function useLogin() {
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const setUser = useAppStore((state) => state.setUser);

    // UI State
    const [showPassword, setShowPassword] = useState(false);
    const [rememberId, setRememberId] = useState(false);

    // Form Initialization
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues,
    });

    // Check login status & Load saved ID
    useEffect(() => {
        // 1. Redirect if already logged in
        const token = getAccessToken();
        if (token) {
            // Redirect based on device
            const userAgent = navigator.userAgent;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

            if (isMobile) {
                router.replace('/mainmobile', { scroll: false });
            } else {
                router.replace('/users', { scroll: false });
            }
            return;
        }

        // 2. Load saved ID
        const savedId = sessionManager.getSavedId();
        if (savedId) {
            form.setValue("userId", savedId);
            setTimeout(() => setRememberId(true), 0);
        }
    }, [router, form]);

    const onSubmit = (data: AccountFormValues) => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append('userid', data.userId);
                formData.append('password', data.userPwd);

                const loginResult = await login(formData);

                if (loginResult.code !== '200' || !loginResult.data) {
                    toast({
                        title: "로그인 실패",
                        description: loginResult.message,
                        variant: "destructive",
                    });
                    return;
                }

                // Handle Remember ID
                if (rememberId) {
                    sessionManager.setSavedId(data.userId);
                } else {
                    sessionManager.clearSavedId();
                }

                setUser(loginResult.data.user);

                // Redirect based on device
                const userAgent = navigator.userAgent;
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

                if (isMobile) {
                    router.replace('/mainmobile', { scroll: false });
                } else {
                    router.replace('/users', { scroll: false });
                }
            } catch (error: unknown) {
                console.error("onSubmit error:", error);
                toast({
                    title: "오류",
                    description: "로그인 처리 중 오류가 발생했습니다.",
                    variant: "destructive",
                });
            }
        });
    };

    return {
        form,
        onSubmit,
        isPending,
        showPassword,
        setShowPassword,
        rememberId,
        setRememberId,
    };
}
