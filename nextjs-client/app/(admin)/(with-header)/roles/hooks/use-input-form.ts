import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RoleInfo } from "../types";

export const roleFormSchema = z.object({
    roleId: z.string().min(2, "Role ID must be at least 2 characters."),
    roleName: z.string().min(1, "Name is required."),
    roleDesc: z.string().optional().or(z.literal("")),
    useYn: z.string().min(1),
    menuIds: z.array(z.string()),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;

export interface UseInputFormProps {
    item?: RoleInfo | null;
    initialMenuIds?: string[];
    onSubmit: (data: Partial<RoleInfo>, menuIds: string[]) => Promise<void>;
}

export interface UseInputFormReturn {
    form: UseFormReturn<RoleFormValues>;
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isEdit: boolean;
}

const defaultValues: RoleFormValues = {
    roleId: "",
    roleName: "",
    roleDesc: "",
    useYn: "1",
    menuIds: [],
};

export function useInputForm({ item, initialMenuIds = [], onSubmit }: UseInputFormProps): UseInputFormReturn {
    const isEdit = !!item;

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleFormSchema),
        defaultValues,
    });

    useEffect(() => {
        if (item) {
            form.reset({
                roleId: item.roleId || "",
                roleName: item.roleName || "",
                roleDesc: item.roleDesc || "",
                useYn: item.useYn || "1",
                menuIds: initialMenuIds,
            });
        } else {
            form.reset(defaultValues);
        }
    }, [item, initialMenuIds, form]);

    const onFormSubmit = async (data: RoleFormValues) => {
        const { menuIds, ...roleData } = data;
        await onSubmit(roleData, menuIds);
    };

    return {
        form,
        handleSubmit: form.handleSubmit(onFormSubmit),
        isEdit,
    };
}
