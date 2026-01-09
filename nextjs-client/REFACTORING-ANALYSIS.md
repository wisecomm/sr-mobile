# SR-Mobile 프로젝트 리팩토링 분석 보고서

## 📋 프로젝트 개요

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Backend**: Spring Boot + MyBatis
- **상태 관리**: Zustand + TanStack Query
- **UI**: Tailwind CSS + Radix UI (shadcn/ui)

---

## ✅ Phase 1 완료 (2024-01-09)

### 1. 파일명 kebab-case 통일 ✅

**변경된 파일들:**

| 기존 파일명 | 새 파일명 | 상태 |
|------------|----------|------|
| `hooks/useAuth.ts` | `hooks/use-auth.ts` | ✅ |
| `hooks/useAuthQuery.ts` | `hooks/use-auth-query.ts` | ✅ |
| `hooks/useBoardQuery.ts` | `hooks/use-board-query.ts` | ✅ |
| `hooks/useMenuQuery.ts` | `hooks/use-menu-query.ts` | ✅ |
| `hooks/useRoleQuery.ts` | `hooks/use-role-query.ts` | ✅ |
| `hooks/useUserQuery.ts` | `hooks/use-user-query.ts` | ✅ |
| `store/useAppStore.ts` | `store/use-app-store.ts` | ✅ |

**하위 호환성**: 기존 camelCase 파일들은 새 파일을 re-export하여 유지

### 2. 미사용 코드 정리 ✅

**Deprecated된 actions.ts 파일들:**

- `app/(admin)/(with-header)/users/actions.ts` → deprecated (use-user-query 사용)
- `app/(admin)/(with-header)/roles/actions.ts` → deprecated (use-role-query 사용)
- `app/(admin)/(with-header)/menus/actions.ts` → deprecated (use-menu-query 사용)

> ⚠️ `boards/board/actions.ts`와 `boards/master/actions.ts`는 아직 별도 API 클라이언트가 없어서 유지

### 3. hooks/index.ts 생성 ✅

중앙 export 파일 생성으로 import 간소화:

```typescript
// 이전
import { useAuth } from '@/hooks/use-auth';
import { useUsers } from '@/hooks/use-user-query';
import { useToast } from '@/hooks/use-toast';

// 이후 (권장)
import { useAuth, useUsers, useToast } from '@/hooks';
```

---

## 🔧 Phase 2: 컴포넌트 추상화 (다음 단계)

### 4. SearchToolbar 통합

**현재 문제**: 각 페이지의 data-table-toolbar.tsx가 거의 동일

**개선안**: 제네릭 SearchToolbar 컴포넌트

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
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}
```

### 5. EntityDialog 통합

**현재 문제**: UserDialog, RoleDialog가 비슷한 구조

**개선안**: 제네릭 EntityDialog 컴포넌트

---

## 📝 Phase 3: 아키텍처 개선 (향후)

### 6. useEntityManagement 활성화

- 실제 페이지에서 활용하도록 수정
- use-user-management, use-role-management 단순화

### 7. CrudPage 컴포넌트

- 제네릭 CRUD 페이지 패턴 도입

### 8. Board API 클라이언트 생성

- `boards/board/actions.ts` → `lib/api/board-api.ts`
- `boards/master/actions.ts` → `lib/api/board-master-api.ts`

---

## 🎯 리팩토링 이점

| 영역 | 현재 | 리팩토링 후 |
|------|------|------------|
| 코드 중복 | 페이지당 ~100줄 | 페이지당 ~20줄 |
| 새 CRUD 페이지 추가 | 5개 파일 생성 | 1-2개 파일 + 설정 |
| 유지보수 | 각 페이지 개별 수정 | 공통 컴포넌트만 수정 |
| 타입 안전성 | 부분적 | 완전한 end-to-end |

---

## 🗑️ 삭제 예정 파일

Phase 1 완료 후 안전하게 삭제 가능한 파일들:

```
hooks/useAuth.deprecated.ts     # 실수로 생성된 파일 - 삭제
hooks/useAuth.ts               # 하위 호환 - 나중에 삭제
hooks/useAuthQuery.ts          # 하위 호환 - 나중에 삭제
hooks/useBoardQuery.ts         # 하위 호환 - 나중에 삭제
hooks/useMenuQuery.ts          # 하위 호환 - 나중에 삭제
hooks/useRoleQuery.ts          # 하위 호환 - 나중에 삭제
hooks/useUserQuery.ts          # 하위 호환 - 나중에 삭제
store/useAppStore.ts           # 하위 호환 - 나중에 삭제
```

---

## 📌 다음 작업 선택

1. **Phase 2 시작**: SearchToolbar 공통화 (30분)
2. **Phase 2 시작**: EntityDialog 공통화 (30분)
3. **Board API 클라이언트 생성** (20분)
4. **하위 호환 파일 삭제 + import 정리** (10분)

어떤 작업을 진행하시겠습니까?
