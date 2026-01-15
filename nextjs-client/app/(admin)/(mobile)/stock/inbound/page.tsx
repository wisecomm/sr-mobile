"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ScanBarcode,
    Delete,
    Info,
    CheckCircle2,
    Minus,
    Plus,
    RotateCcw,
    ArrowRight
} from "lucide-react";

export default function StockInboundPage() {
    const router = useRouter();
    const [mode, setMode] = useState("inbound");
    const [quantity, setQuantity] = useState(50);
    const [barcode, setBarcode] = useState("8809623451023");

    return (
        <div className="flex flex-col h-screen bg-[#f6f7f8] text-slate-900 font-sans overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-300 shrink-0 z-20">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-900" />
                </button>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">바코드 스캔</h1>
                <div className="w-10 h-10" />
            </header>

            {/* Mode Switcher */}
            <div className="px-4 py-4 bg-white shrink-0 z-20 border-b border-slate-300">
                <div className="flex h-10 w-full items-center justify-center rounded-lg bg-slate-100 p-1 border border-slate-200">
                    <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-[4px] transition-all font-medium text-sm ${mode === 'info' ? 'bg-white shadow-sm text-[#137fec]' : 'text-slate-600'}`}>
                        <span className="truncate">조회</span>
                        <input
                            className="invisible w-0 fixed"
                            name="mode"
                            type="radio"
                            value="info"
                            checked={mode === 'info'}
                            onChange={(e) => setMode(e.target.value)}
                        />
                    </label>
                    <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-[4px] transition-all font-medium text-sm ${mode === 'inbound' ? 'bg-white shadow-sm text-[#137fec]' : 'text-slate-600'}`}>
                        <span className="truncate">입고</span>
                        <input
                            className="invisible w-0 fixed"
                            name="mode"
                            type="radio"
                            value="inbound"
                            checked={mode === 'inbound'}
                            onChange={(e) => setMode(e.target.value)}
                        />
                    </label>
                    <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-[4px] transition-all font-medium text-sm ${mode === 'outbound' ? 'bg-white shadow-sm text-[#137fec]' : 'text-slate-600'}`}>
                        <span className="truncate">출고</span>
                        <input
                            className="invisible w-0 fixed"
                            name="mode"
                            type="radio"
                            value="outbound"
                            checked={mode === 'outbound'}
                            onChange={(e) => setMode(e.target.value)}
                        />
                    </label>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full overflow-y-auto bg-slate-100 p-4 pb-safe no-scrollbar">
                {/* Barcode Input */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-4 mb-4">
                    <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                        <ScanBarcode className="w-[18px] h-[18px]" />
                        바코드 번호
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                className="w-full rounded-xl border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#137fec] focus:border-[#137fec] block p-3.5 pl-4 font-mono text-lg shadow-sm transition-all outline-none border"
                                placeholder="바코드 스캔 또는 입력"
                                type="text"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-xs text-[#137fec] font-bold bg-blue-50 px-2 py-1 rounded">SCAN</span>
                            </div>
                        </div>
                        <button
                            className="w-14 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200 transition-colors"
                            onClick={() => setBarcode('')}
                        >
                            <Delete className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 px-1">
                        <Info className="w-[14px] h-[14px]" />
                        PDA의 측면 스캔 버튼을 누르거나 직접 입력하세요.
                    </p>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden mb-4">
                    <div className="bg-blue-50 border-b border-blue-100 px-5 py-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-[20px] h-[20px] text-[#137fec]" />
                            <span className="text-sm font-bold text-slate-800">상품 정보 확인</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">LOC-A-102</span>
                    </div>
                    <div className="p-5">
                        <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">프리미엄 황사 방역 마스크 (KF94)</h2>
                        <p className="text-sm text-slate-600 mb-5">대형 / 화이트 / 50매입</p>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-0.5">상품코드</p>
                                <p className="text-sm font-medium text-slate-800 font-mono">P-2023-0881</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-0.5">현재고</p>
                                <p className="text-sm font-bold text-slate-900">1,250 ea</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-0.5">단가</p>
                                <p className="text-sm font-medium text-slate-800">15,000 원</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500 mb-0.5">제조사</p>
                                <p className="text-sm font-medium text-slate-800">퓨어코리아</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quantity & Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-5">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-bold text-slate-800">입고 수량</label>
                            <span className="text-xs text-slate-500">Box 단위: 50ea</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(0, quantity - 1))}
                                className="w-14 h-14 flex-none flex items-center justify-center rounded-xl bg-slate-100 border border-slate-300 text-slate-600 hover:text-[#137fec] active:bg-slate-200 active:scale-95 transition-all"
                            >
                                <Minus className="w-6 h-6" />
                            </button>
                            <div className="flex-1 relative">
                                <input
                                    className="w-full h-14 bg-white border-2 border-slate-300 rounded-xl text-center text-2xl font-bold text-slate-900 focus:ring-0 focus:border-[#137fec] transition-colors outline-none"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">ea</span>
                            </div>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-14 h-14 flex-none flex items-center justify-center rounded-xl bg-slate-100 border border-slate-300 text-slate-600 hover:text-[#137fec] active:bg-slate-200 active:scale-95 transition-all"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        <button
                            onClick={() => {
                                setQuantity(0);
                                setBarcode('');
                            }}
                            className="col-span-1 py-4 rounded-xl border border-slate-300 text-slate-600 font-bold bg-white hover:bg-slate-50 active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1"
                        >
                            <RotateCcw className="w-5 h-5" />
                            <span className="text-[10px]">초기화</span>
                        </button>
                        <button className="col-span-3 bg-[#137fec] hover:bg-blue-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            <span>입고 처리</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="h-6"></div>
            </main>
        </div>
    );
}
