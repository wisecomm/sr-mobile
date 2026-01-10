# SR 모바일 프로젝트

**Next.js (프론트엔드)**와 **Spring Boot (백엔드)**로 구축된 풀스택 웹 애플리케이션입니다. 강력한 관리자 대시보드와 안정적인 백엔드 서비스가 특징입니다.

## 🏗 아키텍처

- **프론트엔드**: Next.js 16 (App Router), TypeScript, TailwindCSS, Shadcn/UI
- **백엔드**: Spring Boot 3.4.1, MyBatis, PostgreSQL
- **데이터베이스**: PostgreSQL
- **테스트**: Playwright (E2E), JUnit 5 (Backend)
- **배포**: Docker Compose

## 🚀 주요 기능

### 1. **관리자 대시보드**
- **사용자 관리**: 사용자 등록, 조회, 수정, 삭제 (CRUD)
- **권한 관리**: 역할 계층 구조를 포함한 RBAC 시스템
- **메뉴 관리**: 동적 사이드바 메뉴 설정 기능
- **게시판 시스템**:
    - 리치 텍스트(Rich Text) 게시글 작성 및 수정
    - **대용량 파일 업로드** (최대 **500MB** 지원)
    - 비밀글 설정 및 조회수 집계

### 2. **보안**
- **인증**: JWT 기반 로그인/로그아웃
- **암호화**: Jasypt를 사용한 민감 설정(DB 비밀번호 등) 암호화

### 3. **테스트 자동화 (Agentic Workflow)**
- **Playwright**를 활용한 E2E(End-to-End) 테스트 통합
- **에이전트 명령어**:
    - `/test [기능명]`: Planner -> Generator -> Healer 루틴 자동 실행
    - `/doc [파일]`: 문서 자동 업데이트

## 🛠 시작 가이드

### 필수 요구사항
- Node.js & pnpm
- JDK 21
- Docker & Docker Compose

### 1. 백엔드 (Spring Boot) 실행
```bash
cd spring-rest
./gradlew bootRun
# 서버 주소: http://localhost:8080
```

### 2. 프론트엔드 (Next.js) 실행
```bash
cd nextjs-client
pnpm install
pnpm dev
# 클라이언트 주소: http://localhost:3000
```

## 🧪 테스트 방법

### E2E 테스트 (Playwright)
3단계 에이전트 워크플로우를 사용하여 테스트합니다.

```bash
# 전체 테스트 실행
cd nextjs-client
npx playwright test

# 특정 기능만 테스트
npx playwright test tests/board-file-upload.spec.ts
```

## 📂 프로젝트 구조

```
sr-mobile/
├── nextjs-client/       # 프론트엔드 애플리케이션
│   ├── app/            # Next.js App Router
│   ├── components/     # UI 컴포넌트 (Shadcn)
│   ├── tests/          # Playwright 테스트 코드
│   └── ...
├── spring-rest/         # 백엔드 애플리케이션
│   ├── src/main/java/  # Java 소스 코드
│   ├── src/main/resources/ # 설정 파일 (application.yml)
│   └── ...
└── ...
```
