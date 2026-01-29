import * as React from "react";
import { RoleInfo } from "./types";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useMenus } from "@/app/(admin)/(with-header)/menus/hooks/use-menu-query";
import { useRoleMenus } from "./hooks/use-role-query";
import { MenuCheckboxTree } from "./menu-checkbox-tree";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useInputForm } from "./hooks/use-input-form";

export interface InputFormProps {
    item?: RoleInfo | null;
    onSubmit: (data: Partial<RoleInfo>, menuIds: string[]) => Promise<void>;
    onCancel: () => void;
}

export function InputForm({ item, onSubmit, onCancel }: InputFormProps) {
    const isEdit = !!item;


    // Fetch related data
    const { data: menusData } = useMenus({ page: 0, size: 1000 });
    const allMenus = menusData?.list ?? [];

    // For specific role, fetch assigned menus
    const { data: fetchedRoleMenuIds, isLoading: isRoleMenusLoading } = useRoleMenus({
        roleId: item?.roleId || ""
    });
    const roleMenuIds = React.useMemo(() => fetchedRoleMenuIds || [], [fetchedRoleMenuIds]);

    const { form, handleSubmit } = useInputForm({
        item,
        initialMenuIds: roleMenuIds,
        onSubmit
    });

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="roleId"
                        render={({ field }) => (
                            <FormItem className="w-1/2">
                                <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                    권한 ID <span className="text-primary">*</span>
                                </FormLabel>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ShieldCheck className="text-muted-foreground w-5 h-5" />
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="ROLE_USER"
                                            {...field}
                                            disabled={isEdit}
                                            className="block w-full pl-10 sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground"
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="roleName"
                        render={({ field }) => (
                            <FormItem className="w-1/2">
                                <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                    권한 이름 <span className="text-primary">*</span>
                                </FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            placeholder="일반 사용자"
                                            {...field}
                                            className="block w-full sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground"
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
                    name="roleDesc"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                권한 설명
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="이 권한에 대한 설명을 입력하세요"
                                    {...field}
                                    className="block w-full sm:text-sm border-border dark:border-border dark:bg-input rounded-md py-2.5 placeholder:text-muted-foreground"
                                    rows={3}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="menuIds"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-xs font-bold text-muted-foreground dark:text-muted-foreground mb-1.5">
                                메뉴 권한
                            </FormLabel>
                            <FormControl>
                                <div className="bg-background dark:bg-card border border-border dark:border-border rounded-lg p-5 max-h-[300px] overflow-y-auto">
                                    {isRoleMenusLoading && isEdit ? (
                                        <div className="h-20 flex items-center justify-center text-sm text-slate-500">권한 로딩 중...</div>
                                    ) : (
                                        <MenuCheckboxTree
                                            items={allMenus}
                                            selectedIds={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium text-foreground dark:text-foreground">사용 여부</FormLabel>
                        <FormDescription className="text-sm text-muted-foreground dark:text-muted-foreground">
                            이 권한을 활성화하거나 비활성화합니다.
                        </FormDescription>
                    </div>
                    <FormField
                        control={form.control}
                        name="useYn"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Switch
                                        className=""
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
