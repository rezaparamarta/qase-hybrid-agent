---
description: Run all generated Playwright specs and publish results to a new Qase run (no AI execution)
argument-hint: "[grep pattern] (optional)"
---

Run the regression suite.

1. Run `npm run test:qase` (append `-- --grep "$ARGUMENTS"` if an argument was given).
   The Qase reporter creates the run and uploads screenshots on its own.
2. Summarise: total / passed / failed / skipped, and the Qase run link if the reporter printed one.
3. For each failure, read the error and the trace, and classify it:
   - **known bug** — matches a case whose last AI explore result was `failed` for the same reason
   - **regression** — the case used to pass
   - **flaky/locator** — the element was not found or timing-related; propose a spec fix but do not
     apply it unless I say so
