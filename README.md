# SR 모바일 프로젝트

**Next.js (프론트엔드)**와 **Spring Boot (백엔드)**로 구축된 풀스택 웹 애플리케이션입니다.

## 🏗 아키텍처

| 구성 요소 | 기술 스택 |
|-----------|-----------|
| **프론트엔드** | Next.js 16 (App Router), TypeScript, TailwindCSS, Shadcn/UI, Radix UI |
| **백엔드** | Spring Boot 3.4.1, MyBatis, PostgreSQL |
| **테스트** | Playwright (E2E 123개 테스트), JUnit 5 |
| **빌드** | Gradle + pnpm, 조건부 정적 빌드 지원 |

## 🚀 주요 기능

### 관리자 대시보드
- **사용자 관리**: CRUD + 권한 할당
- **권한 관리**: RBAC + 메뉴 권한 매핑
- **메뉴 관리**: 트리 구조 동적 메뉴
- **게시판 시스템**: 게시판 마스터 관리 + 게시물(파일 업로드 포함)

### 보안
- JWT 기반 인증
- Jasypt 민감 설정 암호화

## 🛠 시작 가이드

### 필수 요구사항
- Node.js 18+ & pnpm
- JDK 21
- Docker & Docker Compose
- PostgreSQL

### 백엔드 실행
```bash
cd spring-rest
./gradlew bootRun
# http://localhost:8080
```

### 프론트엔드 실행
```bash
cd nextjs-client
pnpm install && pnpm dev
# http://localhost:3000
```

### 프로덕션 빌드
```bash
# Spring Boot + Next.js 통합 빌드 (정적 빌드 자동 적용)
cd spring-rest
./gradlew build
```

> **참고**: `gradlew build` 실행 시 `STATIC_EXPORT=true` 환경변수가 자동 설정되어 Next.js가 정적 빌드됩니다.

## 🧪 테스트

### E2E 테스트 (Playwright)
```bash
cd nextjs-client

# 전체 테스트 (123개)
npx playwright test

# 관리자 CRUD 테스트만
npx playwright test tests/boards-master.spec.ts tests/boards-post.spec.ts tests/roles.spec.ts tests/users.spec.ts

# HTML 리포트
npx playwright show-report
```

### 테스트 커버리지
| 모듈 | 테스트 파일 | 시나리오 |
|------|-------------|----------|
| 메뉴 | `menus.spec.ts` | 트리 구조 CRUD |
| 사용자 | `users.spec.ts` | 생성/검색/삭제 + 권한 |
| 권한 | `roles.spec.ts` | 생성/검색/삭제 + 메뉴 매핑 |
| 게시판 마스터 | `boards-master.spec.ts` | CRUD |
| 게시물 | `boards-post.spec.ts` | CRUD + 파일 업로드 |

## 📂 프로젝트 구조

```
sr-mobile/
├── nextjs-client/           # 프론트엔드
│   ├── app/                 # Next.js App Router
│   │   └── (admin)/         # 관리자 페이지
│   ├── components/          # UI 컴포넌트 (Shadcn)
│   ├── hooks/               # React Query 훅
│   ├── lib/                 # API 클라이언트
│   └── tests/               # Playwright 테스트
├── spring-rest/             # 백엔드
│   ├── src/main/java/       # Java 소스
│   └── build.gradle         # Gradle 빌드 (프론트엔드 통합)
└── .agent/workflows/        # 에이전트 워크플로우
```

## 🤖 에이전트 워크플로우

| 명령어 | 설명 |
|--------|------|
| `/test-agent [기능]` | Planner → Generator → Healer 테스트 자동화 |
| `/doc-agent [파일]` | 문서 자동 업데이트 |
| `/refactor-agent` | 코드 리팩토링 |
