"use client";

import React from "react";
import Link from "next/link";
import { Download, Smartphone } from "lucide-react";

export default function DownloadPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
                {/* Header Icon */}
                <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-10 h-10 text-blue-600" />
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">앱 다운로드</h1>
                    <p className="text-gray-500">
                        안드로이드 기기에서 사용할 수 있는<br />
                        최신 버전의 앱을 다운로드하세요.
                    </p>
                </div>

                {/* Download Button */}
                <Link
                    href="/app-release.apk"
                    className="group relative w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
                >
                    <Download className="w-6 h-6" />
                    <span className="text-lg">APK 다운로드</span>
                </Link>

                {/* Instructions */}
                <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">설치 방법</h3>
                    <ol className="text-left text-sm text-gray-600 space-y-2 list-decimal pl-5">
                        <li>위 버튼을 눌러 APK 파일을 다운로드합니다.</li>
                        <li>다운로드 완료 알림을 터치합니다.</li>
                        <li>
                            <span className="font-medium text-gray-900">&quot;알 수 없는 앱 설치&quot;</span> 권한을 허용합니다.
                        </li>
                        <li>설치가 완료되면 앱을 실행하세요.</li>
                    </ol>
                </div>

                {/* Footer */}
                <p className="text-xs text-gray-400">
                    버전: 1.0.0 | 크기: 15MB | 업데이트: 2026.01.28
                </p>
            </div>
        </div>
    );
}
