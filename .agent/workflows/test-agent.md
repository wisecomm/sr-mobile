---
description: Run the 3-Agent Test Flow (Planner -> Generator -> Healer) for a specific feature.
---

# Test Agent Workflow

This workflow executes the 3-Agent loop to plan, generate, and verify Playwright tests for a given feature.

## Usage
Run this workflow with a feature name or description.
Example: `/test Board File Upload`

## Steps

### 1. 🎭 Planner (Design)
- **Goal:** Analyze the feature requirements and create a test plan.
- **Action:**
  - Plan the test scenarios (happy path, error cases).
  - Identify necessary DOM elements (selectors).
  - Define prerequisites (login, data setup).
  - **Output:** A concise test plan in `implementation_plan.md`.

### 2. 🎭 Generator (Code)
- **Goal:** Write the actual Playwright test code.
- **Action:**
  - Create a new spec file in `tests/` (e.g., `tests/[feature-name].spec.ts`).
  - Use `tests/fixtures/auth.ts` for login.
  - Implement the steps defined in the Plan.
  - **Output:** executable `.spec.ts` file.

### 3. 🎭 Healer (Verify & Fix)
- **Goal:** Run the test and fix any errors.
- **Action:**
  - Run `npx playwright test tests/[feature-name].spec.ts`.
  - If it fails, analyze the error log.
  - Fix the code (selectors, timeouts, logic).
  - Retry until pass (max 3 attempts).
  - **Output:** A passing test report.
