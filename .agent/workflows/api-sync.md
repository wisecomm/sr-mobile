---
description: 백엔드(Spring Boot)의 변경 변경사항(Controller, VO)을 프론트엔드(Next.js) API Hook 및 타입 정의와 동기화합니다.
---

이 워크플로우는 백엔드 API가 변경되었을 때, 프론트엔드의 관련 코드를 자동으로 업데이트하여 불일치를 해결합니다.

## 사용법 (Usage)
`/api-sync [모듈명]`
예시: `/api-sync orders`

## 실행 단계 (Steps)

### 1. 🔍 백엔드 분석 (Analyze Backend)
- **Goal**: 최신 API 명세 파악.
- **Action**:
  - `src/main/java/.../[Module]/controller/[Module]Controller.java` 읽기.
  - `src/main/java/.../[Module]/vo/[Module]VO.java` 읽기.
  - REST 엔드포인트 URL, 요청/응답 타입, 필드명 확인.

### 2. 🔍 프론트엔드 분석 (Analyze Frontend)
- **Goal**: 현재 구현 상태 파악.
- **Action**:
  - `app/(admin)/(with-header)/[module]/hooks/use-[module]-query.ts` 읽기.
  - 타입 정의(`interface`), API 함수(`search`, `create` 등), Query Key 확인.

### 3. 🔄 동기화 (Synchronization)
- **Goal**: 프론트엔드 코드 업데이트.
- **Action**:
  - **Type Sync**: 백엔드 VO 필드 변경 사항(추가/삭제/타입변경)을 프론트엔드 인터페이스에 반영.
  - **API Sync**: 컨트롤러의 엔드포인트 URL이나 파라미터 변경 사항을 API 함수에 반영.

### 4. ✅ 검증 (Verification)
- **Goal**: 타입 에러 확인.
- **Action**:
  - `pnpm type-check` (또는 빌드) 실행하여 타입 오류가 없는지 확인.
