# 인증 시스템 (Auth System)

## 📚 개요

중앙화되고 타입 안전한 인증 시스템입니다. 세션 관리, 토큰 갱신, 로그인/로그아웃 등 모든 인증 관련 기능을 제공합니다.

## 🎯 주요 특징

- ✅ **중앙화된 세션 관리** - localStorage 직접 접근 제거
- ✅ **자동 토큰 갱신** - 동시 요청 병합 지원
- ✅ **타입 안전성** - 완전한 TypeScript 지원
- ✅ **React 통합** - useAuth Hook 제공
- ✅ **에러 처리** - 내장된 에러 처리
- ✅ **테스트 가능** - 모듈화된 구조

## 📁 파일 구조

```
lib/auth/
├── index.ts              # 통합 export
├── session-manager.ts    # 세션 관리
├── token-service.ts      # 토큰 갱신
└── auth-service.ts       # 인증 비즈니스 로직

hooks/
└── useAuth.ts            # React Hook

components/
└── session-manager.tsx   # 세션 모니터링 컴포넌트
```

## 🚀 빠른 시작

### 1. 로그인

```typescript
import { authService } from '@/lib/auth';

// 방법 1: authService 사용
const response = await authService.login({
    userId: 'user@example.com',
    userPwd: 'password',
});

if (response.code === '200') {
    console.log('Login successful!');
}

// 방법 2: useAuth Hook 사용 (권장)
import { useAuth } from '@/hooks/use-auth';

function LoginPage() {
    const { login, isLoading } = useAuth();

    const handleLogin = async () => {
        await login('userId', 'password', {
            redirectTo: '/dashboard',
            onSuccess: () => console.log('Success!'),
            onError: (error) => console.error(error),
        });
    };
}
```

### 2. 로그아웃

```typescript
import { authService } from '@/lib/auth';

// 방법 1: authService 사용
await authService.logout({
    redirect: true,
    redirectUrl: '/login',
});

// 방법 2: useAuth Hook 사용 (권장)
const { logout } = useAuth();
await logout('/login');
```

### 3. 세션 관리

```typescript
import { sessionManager } from '@/lib/auth';

// 세션 유효성 확인
if (sessionManager.isSessionValid()) {
    // 세션이 유효함
}

// 사용자 정보 조회
const user = sessionManager.getUserInfo();

// 토큰 조회
const token = sessionManager.getAccessToken();

// 남은 시간 확인
const minutes = Math.floor(sessionManager.getRemainingTime() / 60000);
console.log(`Session expires in ${minutes} minutes`);
```

### 4. 보호된 라우트

```typescript
import { useRequireAuth } from '@/hooks/useAuth';

export default function ProtectedPage() {
    const { isLoading } = useRequireAuth('/login');

    if (isLoading) {
        return <div>Checking authentication...</div>;
    }

    return <div>Protected Content</div>;
}
```

## 📖 API 참조

### SessionManager

세션 데이터를 관리합니다.

```typescript
class SessionManager {
    // 세션 설정
    setSession(data: LoginData): void
    
    // 세션 삭제
    clearSession(): void
    
    // 토큰 조회 (타임아웃 자동 체크)
    getAccessToken(): string | null
    getRefreshToken(): string | null
    
    // 사용자 정보
    getUserInfo(): UserInfo | null
    
    // 토큰 업데이트
    updateTokens(accessToken: string, refreshToken?: string): void
    
    // 활동 시간 관리
    updateLastActivity(): void
    getLastActivity(): number | null
    
    // 세션 상태
    isSessionExpired(): boolean
    isSessionValid(): boolean
    getRemainingTime(): number
    
    // 전체 세션 데이터
    getSessionData(): SessionData | null
}
```

### TokenService

토큰 갱신을 처리합니다.

```typescript
class TokenService {
    // 토큰 갱신 (동시 요청 자동 병합)
    refreshToken(): Promise<TokenRefreshResult>
    
    // 토큰 검증
    validateToken(token: string): Promise<boolean>
    
    // 갱신 상태 확인
    isCurrentlyRefreshing(): boolean
}
```

### AuthService

인증 비즈니스 로직을 처리합니다.

```typescript
class AuthService {
    // 로그인
    login(credentials: LoginRequest): Promise<ApiResponse<LoginData>>
    loginWithFormData(formData: FormData): Promise<ApiResponse<LoginData>>
    
    // 로그아웃
    logout(options?: LogoutOptions): Promise<void>
    
    // 상태 확인
    isAuthenticated(): boolean
    getCurrentUser(): UserInfo | null
    
    // 토큰 갱신
    refreshToken(): Promise<boolean>
    
    // 인증 실패 처리
    handleUnauthorized(): void
}
```

### useAuth Hook

React 컴포넌트에서 인증 기능을 사용합니다.

```typescript
function useAuth(): {
    isAuthenticated: boolean
    user: UserInfo | null
    isLoading: boolean
    remainingMinutes: number
    login: (userId: string, userPwd: string, options?: LoginOptions) => Promise<ApiResponse<LoginData>>
    logout: (redirectTo?: string) => Promise<void>
    refreshToken: () => Promise<boolean>
    updateAuthState: () => void
}

function useRequireAuth(redirectTo?: string): {
    isAuthenticated: boolean
    isLoading: boolean
}

function useRequireGuest(redirectTo?: string): {
    isAuthenticated: boolean
    isLoading: boolean
}
```

## 🎓 사용 예제

### 로그인 폼

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        await login(userId, password, {
            redirectTo: '/dashboard',
            onError: (error) => alert(error),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="User ID"
                required
            />
            <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    );
}
```

### 사용자 프로필

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';

export function UserProfile() {
    const { user, remainingMinutes, logout } = useAuth();

    if (!user) return null;

    return (
        <div>
            <h2>{user.userName}</h2>
            <p>{user.userEmail}</p>
            <p>Session expires in: {remainingMinutes} minutes</p>
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
}
```

### 세션 경고

```typescript
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export function SessionWarning() {
    const { remainingMinutes, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && remainingMinutes === 5) {
            toast({
                title: '세션 만료 경고',
                description: '5분 후 자동으로 로그아웃됩니다.',
                variant: 'warning',
            });
        }
    }, [remainingMinutes, isAuthenticated]);

    return null;
}
```

## 🔧 설정

### 세션 타임아웃 변경

```typescript
// lib/auth/session-manager.ts
export const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 60분으로 변경
```

### 토큰 갱신 엔드포인트 변경

```typescript
// lib/auth/token-service.ts
const response = await fetch('/api/v1/auth/refresh', {
    // 엔드포인트 변경
});
```

## 🧪 테스트

### Unit Test

```typescript
import { sessionManager } from '@/lib/auth';

describe('SessionManager', () => {
    beforeEach(() => {
        sessionManager.clearSession();
    });

    test('should manage session lifecycle', () => {
        const loginData = {
            token: 'test-token',
            refreshToken: 'test-refresh',
            tokenType: 'Bearer',
            expiresIn: 3600,
            user: {
                userId: 'test',
                userName: 'Test User',
                userEmail: 'test@example.com',
                roles: ['USER'],
            },
        };

        sessionManager.setSession(loginData);
        expect(sessionManager.isSessionValid()).toBe(true);

        sessionManager.clearSession();
        expect(sessionManager.isSessionValid()).toBe(false);
    });
});
```

## 💡 Best Practices

### 1. 항상 Hook 사용

```typescript
// ❌ 나쁜 예
const token = localStorage.getItem('accessToken');

// ✅ 좋은 예
const { isAuthenticated } = useAuth();
```

### 2. 세션 유효성 확인

```typescript
// ❌ 나쁜 예
if (token) {
    // ...
}

// ✅ 좋은 예
if (sessionManager.isSessionValid()) {
    // ...
}
```

### 3. 에러 처리

```typescript
// ✅ 좋은 예
await login(userId, password, {
    onSuccess: () => {
        toast({ title: '로그인 성공!' });
    },
    onError: (error) => {
        toast({ title: '로그인 실패', description: error });
    },
});
```

## 🔄 마이그레이션

기존 코드에서 마이그레이션하려면:

```typescript
// Before
import { getAccessToken, login, logout } from '@/app/actions/auth-actions';

// After
import { sessionManager, authService } from '@/lib/auth';
// or
import { useAuth } from '@/hooks/use-auth';
```


## 📝 변경 이력

### v2.0.0 (2024-01-09)
- ✨ SessionManager 클래스 추가
- ✨ TokenService 클래스 추가
- ✨ AuthService 클래스 추가
- ✨ useAuth Hook 추가
- ♻️ 전체 인증 시스템 리팩토링

### v1.0.0
- 초기 버전

---

Made with ❤️ by the Development Team
