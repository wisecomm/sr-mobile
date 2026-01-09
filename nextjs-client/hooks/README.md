# Custom Hooks

## 📚 개요

프로젝트에서 사용하는 커스텀 훅들입니다.

## 📁 파일 구조

```
hooks/
├── query/                      # React Query 관련
│   ├── factory.ts             # 쿼리/뮤테이션 팩토리
│   └── README.md
├── use-user-management.ts     # 사용자 관리 비즈니스 로직
├── useAuth.ts                 # 인증 관련 훅
├── use-toast.tsx              # Toast 알림
└── useXxxQuery.ts             # React Query 훅들
```

## 🎯 주요 훅

### useUserManagement

사용자 관리 페이지의 모든 비즈니스 로직을 캡슐화합니다.

**사용 예시:**
```typescript
import { useUserManagement } from '@/hooks/use-user-management';

function UsersPage() {
    const {
        users,
        isLoading,
        handleCreate,
        handleUpdate,
        handleDelete,
    } = useUserManagement();
    
    // 간결한 UI 로직만
}
```

**특징:**
- ✅ 비즈니스 로직 완전 분리
- ✅ 페이지 코드 50% 감소
- ✅ 재사용 가능
- ✅ 테스트 용이

### useAuth

인증 상태 및 기능을 제공합니다.

```typescript
import { useAuth } from '@/hooks/useAuth';

function Component() {
    const { 
        isAuthenticated, 
        user, 
        login, 
        logout 
    } = useAuth();
}
```

### React Query 훅

각 도메인별 데이터 페칭 훅입니다.

```typescript
import { useUsers, useCreateUser } from '@/hooks/useUserQuery';
import { useRoles } from '@/hooks/useRoleQuery';
import { useMenus } from '@/hooks/useMenuQuery';
```

## 💡 Best Practices

### 1. 비즈니스 로직 분리

```typescript
// ✅ 좋은 예: 비즈니스 로직을 훅으로 분리
function UsersPage() {
    const { users, handleCreate } = useUserManagement();
    return <UserList users={users} onCreate={handleCreate} />;
}

// ❌ 나쁜 예: 페이지에 모든 로직
function UsersPage() {
    const [users, setUsers] = useState([]);
    const handleCreate = async () => { /* 50줄 */ };
    // ...
}
```

### 2. 단일 책임 원칙

각 훅은 하나의 책임만 가져야 합니다.

```typescript
// ✅ 좋은 예
const userManagement = useUserManagement();  // 사용자 CRUD
const auth = useAuth();                      // 인증

// ❌ 나쁜 예
const everything = useEverything();  // 너무 많은 책임
```

## 🔗 관련 문서

- [React Query Factory](./query/README.md)
- [API Client](../lib/api/README.md)
- [Auth System](../lib/auth/README.md)

---

Made with ❤️ by the Development Team
