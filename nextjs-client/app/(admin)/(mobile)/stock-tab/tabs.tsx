"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StockTabs() {
    const pathname = usePathname();

    const tabs = [
        { name: "조회", path: "/stock-tab/item", value: "item" },
        { name: "입고", path: "/stock-tab/inbound", value: "inbound" },
        { name: "출고", path: "/stock-tab/outbound", value: "outbound" },
    ];

    return (
        <div className="px-4 py-2 bg-white shrink-0 z-20 border-b border-slate-200">
            <div className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 p-1.5 border border-slate-200">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.path;
                    return (
                        <Link
                            key={tab.value}
                            href={tab.path}
                            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg transition-all text-base
                                ${isActive
                                    ? 'bg-white shadow-md text-[#137fec] font-extrabold ring-1 ring-black/5'
                                    : 'text-slate-500 hover:text-slate-900 font-medium'
                                }`}
                        >
                            <span className="truncate">{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
