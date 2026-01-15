"use client";

import Link from "next/link";
import {
    Barcode,
    Scan,
    Boxes,
    RotateCcw,
    ClipboardList,
    Bird,
    MapPin,
    PackagePlus,
    PackageSearch,
    Settings2,
    Power,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/store/use-app-store";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/actions/auth-actions";
import { useRouter } from "next/navigation";

const menuItems = [
    { title: "재고 입고", icon: Barcode, color: "text-primary", href: "/stock/inbound" },
    { title: "재고 조회", icon: Scan, color: "text-primary", href: "/stock/item" },
    { title: "재고 출고", icon: Boxes, color: "text-foreground", href: "/stock/outbound" },
    { title: "탭 업무", icon: RotateCcw, color: "text-foreground", href: "/stock-tab" },
    { title: "스캔 작업", icon: ClipboardList, color: "text-foreground", href: "/stock-test/item" },
    { title: "Stock Eagle", icon: Bird, color: "text-foreground", href: "/stock-eagle" },
];

export default function MainMenuPage() {
    const user = useAppStore((state) => state.user);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex flex-col min-h-screen bg-muted/30 text-foreground max-w-md mx-auto border-x shadow-2xl relative overflow-hidden">
            {/* Background Gradient Blob */}
            <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />

            {/* Header */}
            <header className="flex items-center justify-between p-5 bg-background/80 backdrop-blur-md border-b sticky top-0 z-20">
                <div className="flex items-center gap-3">

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="cursor-pointer">
                                <Avatar className="h-11 w-11 border-2 border-background shadow-sm">
                                    <AvatarImage src="/images/avatar-placeholder.png" />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                        {user?.userName?.[0] || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive cursor-pointer gap-2"
                                onClick={async () => {
                                    await logout();
                                    router.replace("/login");
                                }}
                            >
                                <Power className="h-4 w-4" />
                                <span>로그아웃</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium">
                            {user?.roles?.includes('ROLE_ADMIN') ? '관리자' : '작업자'}
                        </span>
                        <span className="text-base font-bold leading-none mt-0.5">
                            {user?.userName || '사용자'}님, 안녕하세요
                        </span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-destructive border-2 border-background rounded-full animate-pulse" />
                </Button>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 p-5 overflow-y-auto pb-24">
                <div className="grid grid-cols-2 gap-4">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="block group"
                        >
                            <Card
                                className="border-none shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-[0.97] bg-card h-full rounded-2xl overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <CardContent className="flex flex-col items-center justify-center p-6 gap-4 h-full min-h-[150px]">
                                    <div className={`
                                        p-4 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300
                                        ${item.color}
                                    `}>
                                        <item.icon className="h-8 w-8 stroke-[1.5]" />
                                    </div>
                                    <span className="text-sm font-bold text-center leading-snug text-muted-foreground group-hover:text-foreground transition-colors">
                                        {item.title}
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background to-transparent pointer-events-none flex justify-center max-w-md mx-auto z-10">
                <Button
                    variant="destructive"
                    className="w-full h-14 rounded-xl shadow-lg font-bold text-lg pointer-events-auto gap-2 hover:bg-destructive/90 transition-all active:scale-95"
                >
                    <Power className="h-5 w-5" />
                    작업 종료
                </Button>
            </div>
        </div>
    );
}
