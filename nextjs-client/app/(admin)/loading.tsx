import { Loader2 } from "lucide-react";

/**
 * Admin 영역 로딩 컴포넌트
 * 
 * 관리자 페이지 전환 시 표시됩니다.
 */
export default function AdminLoading() {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">페이지 로딩 중...</p>
      </div>
    </div>
  );
}
