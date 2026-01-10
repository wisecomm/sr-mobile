---
description: Refactor code to be simpler, more readable, and aesthetically pleasing ("Clean Code").
---

# Refactor Agent Workflow

This workflow focuses on simplifying complex code, improving readability, and ensuring the code structure is "good-looking" (well-organized).

## Usage
Run this workflow with a file path.
Example: `/refactor components/complex-component.tsx`

## Steps

### 1. 🔍 Diagnosis (Analysis)
- **Goal:** Identify "Bad Smells" and complexity.
- **Action:**
  - Read the target file.
  - Look for:
    - Long components (> 150 lines).
    - Deep indentation (Callback Hell).
    - Mixed concerns (Logic + UI clutter).
    - Unclear naming.
  - **Goal:** "Make it simple."

### 2. 📐 Architecture (Strategy)
- **Goal:** Plan the cleanup.
- **Action:**
  - Propose extracting logic into **Custom Hooks** (e.g., `useBoardForm`).
  - Propose extracting UI into **Sub-components** (e.g., `BoardFormFields`).
  - consistent naming conventions.

### 3. 🧹 Cleanup (Execution)
- **Goal:** Apply the changes.
- **Action:**
  - Create necessary helper files (hooks/components).
  - Rewrite the main file to be a "Index" or "Container" that reads like a story.
  - Ensure typescript types are clean.
  - **Verification:** Ensure no functionality is lost.
