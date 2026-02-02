---
description: Review a PR thoroughly without merging
---

1. **Identify PR meta + context**
   ```bash
   # Replace <PR> with the PR number or URL
   gh pr view <PR> --json number,title,state,isDraft,author,baseRefName,headRefName,headRepository,url,body,labels,assignees,reviewRequests,files,additions,deletions --jq '{number,title,url,state,isDraft,author:.author.login,base:.baseRefName,head:.headRefName,headRepo:.headRepository.nameWithOwner,additions,deletions,files:.files|length}'
   ```

2. **Read the PR description carefully**
   - Summarize the stated goal, scope, and any "why now?" rationale.
   - Call out any missing context: motivation, alternatives considered, rollout/compat notes, risk.

3. **Read the diff thoroughly**
   ```bash
   gh pr diff <PR>
   # Optional: Checkout if needed for context
   # gh pr checkout <PR>
   ```

4. **Validate the change is needed / valuable**
   - What user/customer/dev pain does this solve?
   - Is this change the smallest reasonable fix?
   - Are we introducing complexity for marginal benefit?

5. **Evaluate implementation quality + optimality**
   - Correctness, Design, Performance, Security/privacy, Backwards compatibility, Style consistency.

6. **Tests & verification**
   - Identify what's covered by tests.
   - Missing tests? Call out exact cases.

7. **Output Review**
   - Produce a structured review with: 
     - TL;DR recommendation (READY FOR LAND / NEEDS WORK)
     - What changed
     - What's good
     - Concerns / questions (BLOCKER, IMPORTANT, NIT)
     - Tests coverage
