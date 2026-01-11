---
description: 발생한 에러 로그를 분석하여 원인을 파악하고 해결책을 제시합니다.
---

이 워크플로우는 애플리케이션 실행 중 발생한 에러(백엔드 스택트레이스, 프론트엔드 빌드 에러 등)를 분석하고 해결합니다.

## 사용법 (Usage)
`/log-agent` (최근 로그 분석)
`/log-agent [에러메시지]` (특정 에러 분석)

## 실행 단계 (Steps)

### 1. 📋 로그 수집 (Gather Logs)
- **Goal**: 에러 정보 확보.
- **Action**:
  - **백엔드 로그**: `spring-rest/logs/` 디렉토리 확인 또는 터미널의 최근 Spring Boot 출력 확인.
  - **프론트엔드 로그**: 터미널의 Next.js 빌드/런타임 에러 확인.
  - 사용자 제공 에러 메시지 분석.

### 2. 🧠 원인 분석 (Analyze Root Cause)
- **Goal**: 에러의 근본 원인 식별.
- **Action**:
  - **Stack Trace 분석**: 에러 발생 지점(파일, 라인) 및 예외 타입(`NullPointerException`, `MethodArgumentNotValidException` 등) 식별.
  - **DB 에러**: SQL 문법 오류, 제약 조건 위반(`IntegrityConstraintViolationException`) 등 확인.
  - **네트워크 에러**: CORS, 404 Not Found, 500 Internal Server Error 등 확인.

### 3. 🛠 해결책 제시 및 적용 (Propose & Apply Fix)
- **Goal**: 에러 수정.
- **Action**:
  - **코드 수정**: 문제가 식별된 파일 수정 (예: Null 체크 추가, SQL 쿼리 수정, 타입 정의 수정).
  - **설정 변경**: 환경 변수, 포트 설정, CORS 설정 등 조정.
  - **재시작**: 필요한 경우 서버 재시작 제안.

### 4. ✅ 검증 (Verification)
- **Goal**: 해결 여부 확인.
- **Action**:
  - 애플리케이션 정상 구동 확인.
  - 동일 에러 재발 방지 확인.
