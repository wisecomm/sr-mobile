# 🔍 Next.js 구조 분석 및 개선 제안

> 분석일: 2026년 1월 27일

---

## ✅ 현재 잘 되어있는 부분

| 항목 | 평가 |
|------|------|
| **Feature-based 아키텍처** | 각 기능별로 hooks, types, components 분리 ✅ |
| **API Proxy 패턴** | Catch-all route로 토큰 관리 자동화 ✅ |
| **파일명 케밥케이스** | `use-auth.ts`, `use-user-query.ts` 통일됨 ✅ |
| **React Query 팩토리** | `hooks/query/factory.ts`로 표준화 ✅ |
| **공통 컴포넌트** | `SearchPageLayout`, `ActionButtons` 등 존재 ✅ |
| **타입 안전성** | Zod + TypeScript strict mode ✅ |

---

## ⚠️ 개선이 필요한 부분

### 1. 하위 호환 파일 정리 필요 (즉시 가능)

`REFACTORING-ANALYSIS.md`에서 언급된 deprecated 파일들:

```
hooks/useAuth.ts          → use-auth.ts로 re-export만 함
hooks/useAuthQuery.ts     → use-auth-query.ts로 re-export만 함
store/useAppStore.ts      → use-app-store.ts로 re-export만 함
```

**권장**: 이제 삭제해도 됨 (모든 import가 kebab-case 파일 사용 중인지 확인 후)

---

### 2. DataTableToolbar 중복 (Phase 2)

현재 각 페이지마다 `data-table-toolbar.tsx`가 거의 동일한 구조:

```
users/data-table-toolbar.tsx
roles/data-table-toolbar.tsx
menus/data-table-toolbar.tsx
boards/master/data-table-toolbar.tsx
```

**개선안**: 제네릭 `SearchToolbar` 컴포넌트로 통합

```tsx
// components/common/search-toolbar.tsx
interface SearchField {
  name: string;
  label: string;
  type: 'text' | 'date' | 'select';
  options?: { value: string; label: string }[];
}

interface SearchToolbarProps<TSearchParams> {
  fields: SearchField[];
  onSearch: (params: TSearchParams) => void;
  actions: {
    onAdd?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
  };
  isLoading?: boolean;
}

// 사용 예시
<SearchToolbar
  fields={[
    { name: 'userName', label: '사용자명', type: 'text' },
    { name: 'startDate', label: '시작일', type: 'date' },
  ]}
  onSearch={handleSearch}
  actions={{ onAdd, onEdit, onDelete }}
/>
```

---

### 3. Dialog 컴포넌트 중복 (Phase 2)

`input-dialog.tsx` + `input-form.tsx` 패턴이 모든 CRUD 페이지에서 반복됨.

**개선안**: 제네릭 `EntityDialog` 컴포넌트

```tsx
// components/common/entity-dialog.tsx
interface EntityDialogProps<TEntity, TFormData> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  entity: TEntity | null;
  onSubmit: (data: TFormData) => Promise<void>;
  children: React.ReactNode; // Form 내용
}
```

---

### 4. boards 폴더의 actions.ts 잔재

`REFACTORING-ANALYSIS.md`에서 언급:
- `boards/board/actions.ts` - 아직 별도 API 클라이언트 없음
- `boards/master/actions.ts` - 아직 별도 API 클라이언트 없음

**권장**: `use-board-query.ts`, `use-board-master-query.ts` 생성하여 패턴 통일

```
boards/
├── board/
│   └── hooks/
│       ├── use-board-management.ts
│       └── use-board-query.ts      # 새로 생성
└── master/
    └── hooks/
        ├── use-board-master-management.ts
        └── use-board-master-query.ts  # 새로 생성
```

---

### 5. Zustand와 React Query 역할 중복

**현재 상태**:
- `useAppStore` (Zustand): `user` 정보 저장
- `useAuth` Hook: `authService`에서 user 정보 관리

**문제**: 같은 user 정보가 두 곳에서 관리됨

**권장**:
- **Zustand** → 순수 클라이언트 UI 상태만 (theme, sidebar 상태 등)
- **React Query** → 서버 데이터 캐시 (user 정보 포함)

```tsx
// store/use-app-store.ts (개선 후)
interface AppState {
  // UI 상태만
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

// user 정보는 React Query로만 관리
// hooks/use-auth-query.ts
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
  });
}
```

---

### 6. lib vs libs 폴더 정리

**현재**:
```
lib/       # 실제 사용 중 (api-client, auth 등)
libs/      # 로컬 패키지만 (so-grid-*)
```

**권장**: `libs/` 폴더 이름을 `packages/`로 변경하여 명확히 구분

```
lib/           # 라이브러리/유틸리티 코드
packages/      # 로컬 npm 패키지 (so-grid-core, so-grid-react)
```

---

## 📊 우선순위 정리

| 순위 | 작업 | 난이도 | 예상 시간 | 상태 |
|------|------|--------|----------|------|
| 1 | 하위 호환 deprecated 파일 삭제 | 쉬움 | 10분 | ⏳ 대기 |
| 2 | boards API 클라이언트 생성 | 중간 | 20분 | ⏳ 대기 |
| 3 | SearchToolbar 공통화 | 중간 | 30분 | ⏳ 대기 |
| 4 | EntityDialog 공통화 | 중간 | 30분 | ⏳ 대기 |
| 5 | Zustand/React Query 역할 정리 | 어려움 | 1시간 | ⏳ 대기 |
| 6 | libs → packages 폴더명 변경 | 쉬움 | 5분 | ⏳ 대기 |

---

## 🎯 리팩토링 이점

| 영역 | 현재 | 리팩토링 후 |
|------|------|------------|
| 코드 중복 | 페이지당 ~100줄 | 페이지당 ~20줄 |
| 새 CRUD 페이지 추가 | 5개 파일 생성 | 1-2개 파일 + 설정 |
| 유지보수 | 각 페이지 개별 수정 | 공통 컴포넌트만 수정 |
| 타입 안전성 | 부분적 | 완전한 end-to-end |

---

## 📁 목표 폴더 구조

```
nextjs-client/
├── app/
│   ├── (admin)/
│   │   ├── (with-header)/
│   │   │   ├── users/
│   │   │   │   ├── page.tsx           # 간결한 페이지 컴포넌트
│   │   │   │   ├── columns.tsx        # 테이블 컬럼 정의
│   │   │   │   ├── types.ts           # 타입 정의
│   │   │   │   └── hooks/
│   │   │   │       ├── use-user-management.ts
│   │   │   │       └── use-user-query.ts
│   │   │   └── ...
│   │   └── layout.tsx
│   ├── (guest)/
│   └── api/
│       └── [...path]/route.ts         # API Proxy
├── components/
│   ├── common/
│   │   ├── search-toolbar.tsx         # ✨ 공통 검색 툴바
│   │   ├── entity-dialog.tsx          # ✨ 공통 엔티티 다이얼로그
│   │   ├── search-page-layout.tsx
│   │   └── action-buttons.tsx
│   ├── ui/                            # Shadcn 컴포넌트
│   └── layout-admin/
├── hooks/
│   ├── index.ts                       # 중앙 export
│   ├── use-auth.ts
│   ├── use-toast.tsx
│   └── query/
│       └── factory.ts                 # React Query 팩토리
├── lib/
│   ├── api-client.ts
│   ├── auth/
│   └── utils.ts
├── packages/                          # ✨ libs → packages 변경
│   ├── so-grid-core-0.1.0.tgz
│   └── so-grid-react-0.1.0.tgz
├── store/
│   └── use-app-store.ts               # UI 상태만
└── types/
    └── index.ts
```
