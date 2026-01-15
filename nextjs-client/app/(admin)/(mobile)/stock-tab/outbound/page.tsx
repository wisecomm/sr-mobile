"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    History,
    QrCode,
    Keyboard,
    X,
    MapPin,
    Package,
    Minus,
    Plus,
    Check,
    CheckCircle2,
    MousePointer2,
    Monitor,
    Cable
} from "lucide-react";

export default function StockOutboundPage() {
    const router = useRouter();
    const [barcode, setBarcode] = useState("");
    const [quantity, setQuantity] = useState(10);

    return (
        <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden max-w-md mx-auto shadow-2xl border-x border-slate-200 relative">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0 z-20">
                <button
                    onClick={() => router.replace('/mainmobile')}
                    className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors -ml-2"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight flex-1 text-center">출고 처리</h1>
                <div className="w-12 flex items-center justify-end -mr-2">
                    <button className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors">
                        <History className="w-6 h-6 text-slate-900" />
                    </button>
                </div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto no-scrollbar pb-32 bg-slate-50 relative">

                {/* Empty State / Scan Prompt */}
                <div className="bg-white border-b border-slate-200 p-8 flex flex-col items-center justify-center gap-5 shrink-0">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                        <div className="relative bg-white border border-slate-200 w-20 h-20 flex items-center justify-center rounded-full shadow-lg ring-4 ring-slate-50">
                            <QrCode className="w-9 h-9 text-[#137fec]" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="text-center space-y-1">
                        <h2 className="text-slate-900 text-xl font-bold tracking-tight">스캔 대기 중</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">PDA 스캔 버튼을 누르거나<br />아래에 바코드를 입력하세요</p>
                    </div>
                </div>

                {/* Sticky Input */}
                <div className="px-4 py-4 bg-slate-50 sticky top-0 z-10 shadow-sm border-b border-slate-200">
                    <div className="flex w-full items-stretch rounded-xl shadow-sm relative">
                        <div className="flex items-center justify-center pl-4 bg-white border border-r-0 border-slate-200 rounded-l-xl text-slate-400">
                            <Keyboard className="w-5 h-5" />
                        </div>
                        <input
                            className="flex w-full min-w-0 flex-1 resize-none bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] border border-l-0 border-slate-200 h-12 placeholder:text-slate-400 pr-16 pl-3 text-base font-normal leading-normal rounded-r-xl transition-all"
                            placeholder="바코드 직접 입력..."
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#137fec] font-semibold text-sm hover:text-blue-600 transition-colors">
                            입력
                        </button>
                    </div>
                </div>

                {/* Active Item Card */}
                <div className="p-4">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#137fec]"></span>
                        현재 스캔 상품 (Active)
                    </h3>
                    <div className="flex flex-col gap-0 rounded-xl bg-white overflow-hidden border border-slate-200 shadow-lg ring-1 ring-blue-500/20 transition-all duration-300">
                        <div className="flex p-4 gap-4 bg-slate-50 relative">
                            <div className="absolute right-0 top-0 p-2">
                                <button className="text-slate-400 hover:text-slate-900 p-1 rounded-full hover:bg-slate-200 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex flex-col justify-center flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-blue-500/10 text-[#137fec] text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-500/20">NEW</span>
                                    <span className="text-slate-500 text-xs truncate">BC: 880912345678</span>
                                </div>
                                <h3 className="text-slate-900 text-lg font-bold leading-tight truncate">LG-Monitor-24 Ultra</h3>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="flex items-center text-slate-500 text-xs gap-1">
                                        <MapPin className="w-[14px] h-[14px]" />
                                        Zone A-12
                                    </span>
                                    <span className="w-[1px] h-3 bg-slate-300"></span>
                                    <span className="flex items-center text-slate-500 text-xs gap-1">
                                        <Package className="w-[14px] h-[14px]" />
                                        재고: 150
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center justify-between p-4 bg-white border-t border-slate-200">
                            <div className="flex flex-col">
                                <span className="text-slate-500 text-xs font-medium mb-0.5">출고 수량 입력</span>
                                <span className="text-slate-900 text-sm font-semibold">총 {quantity}개 선택됨</span>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200 shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <div className="relative">
                                    <input
                                        className="w-16 text-center bg-transparent text-2xl font-bold text-slate-900 focus:outline-none border-b border-transparent focus:border-[#137fec] transition-colors pb-0.5"
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                    />
                                </div>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#137fec] text-white hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <button className="w-full bg-slate-50 hover:bg-slate-100 border-t border-slate-200 py-3 text-sm font-medium text-[#137fec] flex items-center justify-center gap-1 transition-colors">
                            <Check className="w-[18px] h-[18px]" />
                            <span>목록에 추가</span>
                        </button>
                    </div>
                </div>

                <div className="h-px bg-slate-200 mx-4 my-2"></div>

                {/* Processing List */}
                <div className="px-4 pt-2">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">처리 목록 (3)</h3>
                        <button className="text-slate-400 hover:text-red-500 text-xs font-medium transition-colors">전체 삭제</button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {/* Item 1 */}
                        <div className="flex items-center justify-between gap-4 rounded-lg bg-white p-3 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                    <Keyboard className="w-5 h-5 text-slate-500" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <p className="text-slate-900 text-sm font-medium truncate">Logitech MX Master 3</p>
                                    <p className="text-slate-500 text-xs truncate">Zone B-04</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold min-w-[3.5rem] text-center">
                                    5
                                </div>
                                <button className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-slate-100 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex items-center justify-between gap-4 rounded-lg bg-white p-3 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                    <MousePointer2 className="w-5 h-5 text-slate-500" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <p className="text-slate-900 text-sm font-medium truncate">Samsung Portable SSD</p>
                                    <p className="text-slate-500 text-xs truncate">Zone C-01</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold min-w-[3.5rem] text-center">
                                    20
                                </div>
                                <button className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-slate-100 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="flex items-center justify-between gap-4 rounded-lg bg-white p-3 border border-slate-200 shadow-sm opacity-80">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                    <Cable className="w-5 h-5 text-slate-500" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <p className="text-slate-900 text-sm font-medium truncate">HDMI Cable 2m</p>
                                    <p className="text-slate-500 text-xs truncate">Zone D-15</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold min-w-[3.5rem] text-center">
                                    100
                                </div>
                                <button className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-slate-100 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Floating Bar */}
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 z-30 pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-slate-500 text-sm font-medium">총 출고 예정 수량</span>
                    <span className="text-[#137fec] text-xl font-bold">135 ea</span>
                </div>
                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-[#137fec] hover:bg-blue-600 active:bg-blue-700 text-white gap-2 text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.99]">
                    <CheckCircle2 className="w-6 h-6" />
                    <span>출고 완료</span>
                </button>
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
