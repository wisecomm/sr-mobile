---
description: Audit changelog entries before release
---

1. **Find the last release tag**
   ```bash
   git tag --sort=-version:refname | head -1
   ```

2. **List all commits since that tag**
   ```bash
   # Replace <tag> with the result from step 1
   git log <tag>..HEAD --oneline
   ```

3. **Read each package's [Unreleased] section**
   - packages/ai/CHANGELOG.md
   - packages/tui/CHANGELOG.md
   - packages/coding-agent/CHANGELOG.md

4. **Audit Commits**
   - Unreleased changes should have corresponding entries.
   - External PRs should have attribution.

5. **Cross-package duplication**
   - Changes in `ai`, `agent` or `tui` affecting users should be duplicated to `coding-agent`.

6. **Report**
   - List missing entries or duplications needed.
