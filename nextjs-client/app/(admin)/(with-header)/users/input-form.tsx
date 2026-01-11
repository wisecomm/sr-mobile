import * as React from "react";
import { UserDetail } from "@/types";
import { useRoles } from "@/app/(admin)/(with-header)/roles/hooks/use-role-query";
import { useUserRoles } from "./hooks/use-user-query";
import { Mail, Lock, IdCard, Loader2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useInputForm } from "./hooks/use-input-form";

export interface InputFormProps {
    item?: UserDetail | null;
    onSubmit: (data: Partial<UserDetail>, roleIds: string[]) => Promise<void>;
    onCancel: () => void;
}

export function InputForm({ item, onSubmit, onCancel }: InputFormProps) {
    const isEdit = !!item;

    const { data: rolesData } = useRoles({ page: 0, size: 100 });
    const { data: fetchedRoleIds, isLoading: isUserRolesLoading } = useUserRoles({ userId: item?.userId || "" });
    const assignedRoleIds = React.useMemo(() => fetchedRoleIds || [], [fetchedRoleIds]);

    const allRoles = React.useMemo(() => {
        return rolesData?.list.map(r => ({ roleId: r.roleId, roleName: r.roleName })) || [];
    }, [rolesData]);

    const { form, handleSubmit } = useInputForm({
        item,
        initialRoleIds: assignedRoleIds,
        onSubmit
    });

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
                <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                아이디 <span className="text-primary">*</span>
                            </FormLabel>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IdCard className="text-muted-foreground w-5 h-5" />
                                </div>
                                <FormControl>
                                    <Input
                                        className="block w-full pl-10 sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground"
                                        placeholder="사용자 아이디를 입력하세요"
                                        {...field}
                                        disabled={isEdit}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem className="w-1/2">
                                <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                    이름 <span className="text-primary">*</span>
                                </FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            className="block w-full sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground"
                                            placeholder="실명 입력"
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="userNick"
                        render={({ field }) => (
                            <FormItem className="w-1/2">
                                <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                    닉네임
                                </FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            className="block w-full sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground"
                                            placeholder="닉네임 입력"
                                            {...field}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="userEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                이메일 <span className="text-primary">*</span>
                            </FormLabel>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="text-muted-foreground w-5 h-5" />
                                </div>
                                <FormControl>
                                    <Input
                                        className="block w-full pl-10 sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground"
                                        placeholder="example@company.com"
                                        {...field}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="userPwd"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                {isEdit ? "새 비밀번호" : "초기 비밀번호"}
                            </FormLabel>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="text-muted-foreground w-5 h-5" />
                                </div>
                                <FormControl>
                                    <Input
                                        type="password"
                                        className="block w-full pl-10 sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground"
                                        placeholder="••••••••"
                                        {...field}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="roleIds"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                권한
                            </FormLabel>
                            <div className="bg-background dark:bg-card border border-border dark:border-border rounded-lg p-5">
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                    {isUserRolesLoading && isEdit ? (
                                        <div className="col-span-2 text-center text-xs text-slate-500 py-2">권한 로딩 중...</div>
                                    ) : (
                                        allRoles.map((role) => (
                                            <label key={role.roleId} className="inline-flex items-center space-x-3 cursor-pointer group">
                                                <Checkbox
                                                    className="h-5 w-5 rounded border-border dark:border-border dark:bg-input"
                                                    checked={field.value?.includes(role.roleId)}
                                                    onCheckedChange={(checked) => {
                                                        const current = field.value || [];
                                                        if (checked) {
                                                            field.onChange([...current, role.roleId]);
                                                        } else {
                                                            field.onChange(current.filter((id) => id !== role.roleId));
                                                        }
                                                    }}
                                                />
                                                <span className="text-base font-normal text-foreground dark:text-foreground group-hover:text-muted-foreground dark:group-hover:text-muted-foreground">
                                                    {role.roleName}
                                                </span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                <FormMessage />
                            </div>
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
