# 프로젝트 컨텍스트

이 파일은 Antigravity가 작업 전 자동으로 참조하는 프로젝트 기본 정보입니다.

## 🏗 프로젝트 개요
- **프로젝트명**: SR 모바일
- **프론트엔드**: Next.js 16 (App Router) + TypeScript + TailwindCSS + Shadcn/Radix UI
- **백엔드**: Spring Boot 3.4.1 + MyBatis + PostgreSQL
- **패키지 매니저**: pnpm (npm 대신 pnpm 사용)
- **🌐 언어**: 문서 및 답변은 **한글**로 작성

### 3. 코딩 패턴 (Coding Patterns)
- **업무화면 생성/수정**: `boards/master` 구조 참조 (표준 패턴)
- **DB 명명 규칙**:
  - PostgreSQL 표준인 **소문자 스네이크 표기법 (Lowercase Snake Case)** 사용 권장.
  - 예: `tb_user_info`, `user_id`, `reg_dt`
  - (참고: PostgreSQL은 대문자로 작성해도 따옴표가 없으면 소문자로 저장됩니다.)

## 🔧 실행 방법

### 개발 환경
```bash
# 프론트엔드 (포트 3000)
cd nextjs-client && pnpm dev

# 백엔드 (포트 8080)
cd spring-rest && ./gradlew bootRun
```

### 프로덕션 빌드
```bash
# 통합 빌드 (STATIC_EXPORT=true 자동 적용)
cd spring-rest && ./gradlew build
```

## 🧪 테스트

```bash
cd nextjs-client
npx playwright test          # 전체 테스트 (123개)
npx playwright show-report   # HTML 리포트
```

## ⚠️ 주의사항 (Learnings)

### 1. Radix UI 체크박스
- `input[type="checkbox"]` 셀렉터 사용 금지
- 올바른 방법: `getByRole('checkbox').click()`

### 2. 인증 Fixture
- 테스트에서 `authenticatedPage` 파라미터 반드시 포함
- 예: `async ({ page, authenticatedPage }) => { ... }`

### 3. FormData API 전송
- `api-client.ts`가 FormData 자동 감지하여 Content-Type 처리함

### 4. 정적 빌드 설정
- `next.config.ts`에서 `STATIC_EXPORT` 환경변수로 제어
- Gradle 빌드 시 자동 활성화됨

### 5. 페이지네이션
- 새 항목 생성 후 검색 필터 적용하여 확인 필요 (목록 첫 페이지에 안 나올 수 있음)

## 📁 주요 디렉토리

| 경로 | 설명 |
|------|------|
| `nextjs-client/app/(admin)/` | 관리자 페이지 |
| `nextjs-client/hooks/` | React Query 훅 |
| `nextjs-client/tests/` | Playwright 테스트 |
| `spring-rest/src/main/java/` | 백엔드 소스 |
| `.agent/workflows/` | 에이전트 워크플로우 |
