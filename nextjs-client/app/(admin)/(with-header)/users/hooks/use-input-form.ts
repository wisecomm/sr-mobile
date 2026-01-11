import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserDetail } from "@/types";

export const userFormSchema = z.object({
    userId: z.string().min(2, "사용자 ID는 2글자 이상이어야 합니다."),
    userName: z.string().min(1, "이름은 필수입니다."),
    userEmail: z.string().email("유효하지 않은 이메일 주소입니다."),
    userNick: z.string().min(2, "닉네임은 2글자 이상이어야 합니다."),
    userPwd: z.string().min(4, "비밀번호는 4글자 이상이어야 합니다.").optional().or(z.literal("")),
    useYn: z.string().min(1),
    roleIds: z.array(z.string()),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export interface UseInputFormProps {
    item?: UserDetail | null;
    initialRoleIds?: string[];
    onSubmit: (data: Partial<UserDetail>, roleIds: string[]) => Promise<void>;
}

export interface UseInputFormReturn {
    form: UseFormReturn<UserFormValues>;
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isEdit: boolean;
}

const defaultValues: UserFormValues = {
    userId: "",
    userName: "",
    userEmail: "",
    userNick: "",
    userPwd: "",
    useYn: "1",
    roleIds: [],
};

export function useInputForm({ item, initialRoleIds = [], onSubmit }: UseInputFormProps): UseInputFormReturn {
    const isEdit = !!item;

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues,
    });

    useEffect(() => {
        if (item) {
            form.reset({
                userId: item.userId || "",
                userName: item.userName || "",
                userEmail: item.userEmail || "",
                userNick: item.userNick || "",
                userPwd: "",
                useYn: item.useYn || "1",
                roleIds: initialRoleIds,
            });
        } else {
            form.reset(defaultValues);
        }
    }, [item, initialRoleIds, form]);

    const onFormSubmit = async (data: UserFormValues) => {
        const { roleIds, ...rest } = data;
        const submitData: Partial<UserDetail> & { userPwd?: string } = { ...rest };

        if (isEdit && !data.userPwd) {
            delete submitData.userPwd;
        }

        await onSubmit(submitData, roleIds);
    };

    return {
        form,
        handleSubmit: form.handleSubmit(onFormSubmit),
        isEdit,
    };
}
