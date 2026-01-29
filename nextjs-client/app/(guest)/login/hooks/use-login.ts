import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { login, getTokens } from "@/app/actions/auth-actions";
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
        // 1. Redirect if already logged in (Async Check using Server Action)
        const checkLogin = async () => {
            try {
                const { accessToken } = await getTokens();
                if (accessToken) {
                    if (typeof window !== 'undefined' && window.AndroidBridge) {
                        try {
                            window.AndroidBridge.syncCookies();
                            console.log('[AuthService] Android Bridge syncCookies called');
                        } catch (e) {
                            console.error('[AuthService] Android Bridge syncCookies failed', e);
                        }
                    }

                    // Redirect based on device
                    const userAgent = navigator.userAgent;
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

                    if (isMobile) {
                        router.replace('/mainmobile', { scroll: false });
                    } else {
                        router.replace('/users', { scroll: false });
                    }
                }
            } catch (error) {
                console.error("Failed to check login status:", error);
            }
        };

        checkLogin();

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
                formData.append('userId', data.userId);
                formData.append('userPwd', data.userPwd);

                const loginResult = await login(formData);
                /*
                // Debug: 메시지 박스로 응답 데이터 확인
                if (typeof window !== 'undefined') {
                    window.alert(JSON.stringify(loginResult, null, 2));
                }
                */
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

                sessionManager.setSession(loginResult.data);

                // Initialize session activity timer
                sessionManager.updateLastActivity();

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
