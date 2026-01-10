---
description: Automatically update project documentation based on the latest code changes.
---

# Documentation Agent Workflow

This workflow analyzes code files and updates documentation (README, API Guides, etc.) to ensure it stays in sync with implementation.

## Usage
Run this workflow with a file path or "all".
Example: `/doc src/main/java/com/example/api` or `/doc README.md`

## Steps

### 1. 🔍 Analysis
- **Goal:** Understand the code functionality.
- **Action:**
  - Read the specified source code files.
  - Identify key components: API Endpoints, Public Functions, Config Parameters, Database Schema.
  - Compare with existing documentation to find gaps.

### 2. 📝 Draft
- **Goal:** Generate documentation content.
- **Action:**
  - Create or update sections in markdown format.
  - **Style:** Clear, concise, and developer-friendly.
  - **Include:** Usage examples, parameter descriptions, and return types.

### 3. 💾 Update
- **Goal:** Apply changes to the documentation file.
- **Action:**
  - Edit `README.md` or other specified `.md` files.
  - Verify formatting (headings, code blocks, links).
  - **Output:** Updated markdown file.
