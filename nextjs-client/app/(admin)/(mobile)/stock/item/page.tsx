"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Search,
    QrCode,
    Filter,
    MapPin,
    Package,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StockItemPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("전체");

    const filters = ["전체", "원자재", "완제품", "재고부족"];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans mx-auto max-w-md shadow-2xl overflow-hidden border-x border-slate-200">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white border-b border-slate-100 px-4 py-4 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center hover:bg-slate-100 rounded-full p-2 -ml-2 transition-colors"
                >
                    <ArrowLeft className="w-7 h-7 text-slate-900" />
                </button>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">재고 조회</h1>
            </header>

            {/* Search Bar */}
            <div className="px-4 py-4 z-10 bg-white">
                <div className="flex gap-2">
                    <div className="flex flex-1 items-center rounded-xl bg-slate-50 border border-slate-200 h-12 px-3 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                        <Search className="w-[22px] h-[22px] text-slate-400 shrink-0" />
                        <input
                            className="w-full h-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 ml-2 text-base font-normal outline-none"
                            placeholder="상품명 또는 바코드 입력"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="h-12 w-12 flex-shrink-0 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all">
                        <QrCode className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 pb-4 bg-white border-b border-slate-50">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`flex h-10 shrink-0 items-center justify-center px-6 rounded-full shadow-sm transition-all text-base
                                ${activeFilter === filter
                                    ? 'bg-slate-900 text-white font-semibold'
                                    : 'bg-white border border-slate-200 text-slate-600 font-medium hover:bg-slate-50'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Result Count & Filter Button */}
            <div className="px-5 py-4 flex items-center justify-between bg-slate-50/50">
                <p className="text-slate-500 text-base">검색 결과: <span className="text-slate-900 font-bold">15건</span></p>
                <div className="flex items-center gap-1 text-blue-600 text-base font-semibold cursor-pointer hover:text-blue-700 active:scale-95 transition-transform">
                    <span>필터</span>
                    <Filter className="w-5 h-5" />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 px-4 pb-8 bg-slate-50/50">
                <div className="flex flex-col gap-3 mb-8">
                    {/* Item 1 */}
                    <div className="flex flex-col bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.99] transition-transform cursor-pointer hover:border-blue-200">
                        <div className="flex justify-between items-start gap-2 mb-3">
                            <h3 className="text-[15px] font-bold text-slate-900 leading-tight">LG 27인치 모니터 (Ultrafine)</h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-green-50 text-green-600 border border-green-100 shrink-0">정상</span>
                        </div>
                        <div className="flex items-center flex-wrap gap-y-2 text-xs text-slate-500">
                            <span className="font-medium text-slate-500">MNT-27-UF-001</span>
                            <span className="mx-2 text-slate-300">|</span>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-blue-600 fill-current" />
                                <span className="font-bold text-slate-700">A-04-12</span>
                            </div>
                            <span className="mx-2 text-slate-300">|</span>
                            <div className="flex items-center gap-1">
                                <Package className="w-4 h-4 text-blue-600 fill-current" />
                                <span className="font-bold text-slate-700">145 <span className="font-normal text-slate-400">EA</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex flex-col bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.99] transition-transform cursor-pointer hover:border-blue-200">
                        <div className="flex justify-between items-start gap-2 mb-3">
                            <h3 className="text-[15px] font-bold text-slate-900 leading-tight">Galaxy Tab S9 Wi-Fi</h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100 shrink-0">부족</span>
                        </div>
                        <div className="flex items-center flex-wrap gap-y-2 text-xs text-slate-500">
                            <span className="font-medium text-slate-500">TAB-S9-WF-128</span>
                            <span className="mx-2 text-slate-300">|</span>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-blue-600 fill-current" />
                                <span className="font-bold text-slate-700">B-01-05</span>
                            </div>
                            <span className="mx-2 text-slate-300">|</span>
                            <div className="flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4 text-amber-500 fill-current" />
                                <span className="font-bold text-amber-600">5 <span className="font-normal text-slate-400">EA</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex flex-col bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.99] transition-transform cursor-pointer hover:border-blue-200">
                        <div className="flex justify-between items-start gap-2 mb-3">
                            <h3 className="text-[15px] font-bold text-slate-900 leading-tight">USB-C to C Cable (1m)</h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-green-50 text-green-600 border border-green-100 shrink-0">정상</span>
                        </div>
                        <div className="flex items-center flex-wrap gap-y-2 text-xs text-slate-500">
                            <span className="font-medium text-slate-500">ACC-CBL-100</span>
                            <span className="mx-2 text-slate-300">|</span>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-blue-600 fill-current" />
                                <span className="font-bold text-slate-700">C-12-01</span>
                            </div>
                            <span className="mx-2 text-slate-300">|</span>
                            <div className="flex items-center gap-1">
                                <Package className="w-4 h-4 text-blue-600 fill-current" />
                                <span className="font-bold text-slate-700">1,200 <span className="font-normal text-slate-400">EA</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex flex-col bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.99] transition-transform cursor-pointer hover:border-blue-200">
                        <div className="flex justify-between items-start gap-2 mb-3">
                            <h3 className="text-[15px] font-bold text-slate-900 leading-tight">산업용 포장 박스 (Large)</h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-green-50 text-green-600 border border-green-100 shrink-0">정상</span>
                        </div>
                        <div className="flex items-center flex-wrap gap-y-2 text-xs text-slate-500">
                            <span className="font-medium text-slate-500">BOX-L-002</span>
                            <span className="mx-2 text-slate-300">|</span>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-blue-600 fill-current" />
                                <span className="font-bold text-slate-700">Z-99-00</span>
                            </div>
                            <span className="mx-2 text-slate-300">|</span>
                            <div className="flex items-center gap-1">
                                <Package className="w-4 h-4 text-blue-600 fill-current" />
                                <span className="font-bold text-slate-700">500</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm font-semibold text-sm">1</button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">2</button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">3</button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
