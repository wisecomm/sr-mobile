"use client";

import {
    Barcode,
    Scan,
    Boxes,
    RotateCcw,
    ClipboardList,
    Bird,
    MapPin,
    PackagePlus,
    Power,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const menuItems = [
    { title: "반품 스캔", icon: Barcode, color: "text-blue-600", href: "/return-scan" },
    { title: "재고 스캔", icon: Scan, color: "text-blue-600", href: "/inventory-scan" },
    { title: "재고 업무", icon: Boxes, color: "text-slate-800", href: "/inventory-task" },
    { title: "반품 업무", icon: RotateCcw, color: "text-slate-800", href: "/return-task" },
    { title: "스캔 작업", icon: ClipboardList, color: "text-slate-800", href: "/scan-work" },
    { title: "Stock Eagle", icon: Bird, color: "text-slate-800", href: "/stock-eagle" },
    { title: "로케이션 관리", icon: MapPin, color: "text-slate-800", href: "/location-management" },
    { title: "입고 업무", icon: PackagePlus, color: "text-slate-800", href: "/receiving-task" },
];

export default function MainMenuPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto border-x shadow-sm">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src="/images/avatar-placeholder.png" />
                        <AvatarFallback className="bg-orange-100 text-orange-600">관리</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-medium">상고 A</span>
                        <span className="text-sm font-bold">환영합니다, 관리자님</span>
                    </div>
                </div>
                <div className="relative">
                    <Button variant="ghost" size="icon" className="text-slate-600">
                        <Bell className="h-6 w-6" />
                        <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-red-500 border-2 border-white rounded-full" />
                    </Button>
                </div>
            </header>

            {/* Grid Content */}
            <main className="flex-1 p-4 bg-slate-50/50">
                <div className="grid grid-cols-2 gap-3">
                    {menuItems.map((item, index) => (
                        <Card
                            key={index}
                            className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
                        >
                            <CardContent className="flex flex-col items-center justify-center p-6 gap-3 min-h-[140px]">
                                <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon className="h-10 w-10 stroke-[1.5]" />
                                </div>
                                <span className="text-base font-bold text-center leading-tight">
                                    {item.title}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Action Button */}
                <div className="mt-4 pb-8">
                    <Button
                        variant="outline"
                        className="w-full h-14 border-none shadow-sm text-red-500 font-bold text-lg bg-white hover:bg-red-50 hover:text-red-600 transition-colors gap-2"
                    >
                        <Power className="h-5 w-5" />
                        작업 종료
                    </Button>
                </div>
            </main>
        </div>
    );
}
