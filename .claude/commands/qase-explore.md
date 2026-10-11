---
description: Execute Qase test cases via Playwright MCP, record results in a Qase run, then generate and verify Playwright specs
argument-hint: "<case IDs e.g. 1,2,3 | suite:<id> | all>"
---

Run the hybrid explore + codify flow described in `CLAUDE.md` for: `$ARGUMENTS`

1. **Resolve cases** with the Qase MCP (project = `QASE_PROJECT` from `.env`):
   - `1,2,3` → those case IDs
   - `suite:<id>` → all cases in that suite
   - `all` → all cases in the project (if more than 15, list them and ask me before running)
   - Search results can lag behind newly created cases. Compare the number of cases found with
     the suite/project case count (from `qase_project_context` or the suite), and fetch any
     missing case by ID with `qase_get` before creating the run.
2. **Create a Qase test run** titled `[AI Explore] <YYYY-MM-DD HH:mm>` containing exactly those cases.
   Note the run ID.
3. **For each case, one at a time:**
   a. Read the case (preconditions + steps + expected results) from Qase.
   b. Execute it with the Playwright MCP, starting from a fresh browser state. Satisfy
      preconditions first (e.g. log in) using the same app, not by editing data.
   c. After each step with an expected result: snapshot, compare, screenshot to
      `evidence/<RUN_ID>/<CASE_ID>/step-<n>.png`.
   d. Decide the status using the table in `CLAUDE.md`. Record the result in the run with the
      comment format from `CLAUDE.md` and per-step statuses, each step carrying its own screenshot
      (never result-level attachments).
   e. If `passed` or `failed`: write the spec per the codify rules, then verify it with
      `npx playwright test <file> --reporter=list` and reconcile as `CLAUDE.md` says.
4. **Complete the Qase run.**
5. Print the final summary table from `CLAUDE.md`.

Do not stop between cases to ask me anything unless a case would touch something outside the
configured `BASE_URL`.
