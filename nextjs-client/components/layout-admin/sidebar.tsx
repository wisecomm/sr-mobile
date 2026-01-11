"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMyMenus } from "@/app/(admin)/(with-header)/menus/hooks/use-menu-query";
import { MenuInfo } from "@/app/(admin)/(with-header)/menus/types";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarItem {
    id: string;
    title: string;
    href?: string;
    icon?: LucideIcon;
    image?: string;
    children?: SidebarItem[];
}

const staticSidebarItems: SidebarItem[] = [
    {
        id: "dashboard",
        title: "대시보드",
        href: "/dashboard",
        image: "/images/menus/dashboard.svg",
    },
];

/**
 * 메뉴 데이터를 트리 구조로 변환
 */
const buildMenuTree = (menus: MenuInfo[]): SidebarItem[] => {
    const menuMap: Record<string, SidebarItem> = {};
    const rootItems: SidebarItem[] = [];

    // 1. Map all items (Level 2 and below)
    menus.forEach((menu) => {
        if (menu.menuLvl === 1) return;

        menuMap[menu.menuId] = {
            id: menu.menuId,
            title: menu.menuName,
            href: menu.menuUri || undefined,
            image: menu.menuImgUri || undefined,
            children: [],
        };
    });

    // 2. Build hierarchy
    menus.forEach((menu) => {
        if (menu.menuLvl === 1) return;

        const item = menuMap[menu.menuId];

        if (menu.menuLvl === 2) {
            rootItems.push(item);
        } else if (menu.upperMenuId && menuMap[menu.upperMenuId]) {
            menuMap[menu.upperMenuId].children!.push(item);
        } else {
            rootItems.push(item);
        }
    });

    // 3. Cleanup empty children
    const finalizeItems = (items: SidebarItem[]) => {
        items.forEach(it => {
            if (it.children?.length === 0) {
                delete it.children;
            } else if (it.children) {
                finalizeItems(it.children);
            }
        });
    };
    finalizeItems(rootItems);

    return rootItems;
};

/**
 * 아이콘 렌더러
 */
const IconRenderer = ({ icon: Icon, image, className }: { icon?: LucideIcon, image?: string, className?: string }) => {
    if (image) {
        return (
            <div className={cn("relative h-5 w-5 shrink-0", className)}>
                <Image src={image} alt="" fill className="object-contain" />
            </div>
        );
    }
    if (Icon) {
        return <Icon className={cn("h-4 w-4 shrink-0", className)} />;
    }
    return null;
};

export function Sidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);
    const { data: menus } = useMyMenus();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const [hasInitializedGroups, setHasInitializedGroups] = useState(false);

    const sidebarItems = menus ? buildMenuTree(menus) : staticSidebarItems;

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    // 메뉴 로드 시 모든 그룹 열기
    if (menus && menus.length > 0 && !hasInitializedGroups) {
        const dynamicItems = buildMenuTree(menus);
        const initialOpen: Record<string, boolean> = {};
        dynamicItems.forEach(item => {
            if (item.children) initialOpen[item.title] = true;
        });
        setOpenGroups(initialOpen);
        setHasInitializedGroups(true);
    }

    const toggleGroup = (title: string) => {
        setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
    };

    /**
     * Check if the menu item is active
     */
    const isMenuActive = (href?: string) => {
        if (!href) return false;
        if (pathname === href) return true;

        // Split href into path and query
        const [menuPath, menuQuery] = href.split('?');

        // Path must match exactly
        if (pathname !== menuPath) return false;

        // If no query in menu href, it matches (assuming strict path match is good enough, or we can enforce exact match)
        // But usually sidebar menu /users should be active for /users?sort=desc
        // However, if we have different menus for same path different params, we must check params.

        if (menuQuery) {
            const params = new URLSearchParams(menuQuery);
            // Check if all params in menu href are present and equal in current searchParams
            for (const [key, value] of params.entries()) {
                if (searchParams.get(key) !== value) {
                    return false;
                }
            }
            return true;
        }

        // If menu href has no query, but current URL has query.
        // e.g. menu: /users, current: /users?page=1 -> Active
        // e.g. menu: /board, current: /board?id=1 -> Active (unless there is a competing menu)
        // For now, accept this as match.
        return true;
    };

    if (!mounted) return null;

    return (
        <div className="flex flex-col w-[240px] border-r bg-muted/40 dark:bg-card/40">
            {/* 로고 */}
            <div className="flex h-[60px] items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Image
                        src="/next.svg"
                        alt="Logo"
                        width={24}
                        height={24}
                        className="dark:invert"
                    />
                    <span className="text-lg">Admin Panel</span>
                </Link>
            </div>

            {/* 메뉴 */}
            <nav className="flex-1 overflow-auto py-2 px-2">
                <div className="grid gap-1 text-sm font-medium">
                    {sidebarItems.map((item) => (
                        item.children ? (
                            // 그룹 메뉴
                            <Collapsible
                                key={item.id}
                                open={openGroups[item.title]}
                                onOpenChange={() => toggleGroup(item.title)}
                            >
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex w-full items-center justify-between p-2 hover:bg-muted dark:hover:bg-card"
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconRenderer icon={item.icon} image={item.image} />
                                            <span className="font-semibold">{item.title}</span>
                                        </div>
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 transition-transform duration-200",
                                                openGroups[item.title] ? "" : "-rotate-90"
                                            )}
                                        />
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="space-y-1 px-2 py-1">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={child.href || "#"}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary pl-9",
                                                isMenuActive(child.href)
                                                    ? "bg-muted text-primary dark:bg-card"
                                                    : "text-muted-foreground"
                                            )}
                                        >
                                            <IconRenderer icon={child.icon} image={child.image} />
                                            <span>{child.title}</span>
                                        </Link>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        ) : (
                            // 단일 메뉴
                            <Link
                                key={item.id}
                                href={item.href || "#"}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    isMenuActive(item.href)
                                        ? "bg-muted text-primary dark:bg-card"
                                        : "text-muted-foreground"
                                )}
                            >
                                <IconRenderer icon={item.icon} image={item.image} />
                                <span>{item.title}</span>
                            </Link>
                        )
                    ))}
                </div>
            </nav>
        </div>
    );
}
