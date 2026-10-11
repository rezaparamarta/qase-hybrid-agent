---
description: Create the SauceDemo pilot suite and test cases in Qase from docs/seed-cases.md
argument-hint: "[PROJECT_CODE] (default: QASE_PROJECT from .env)"
---

Seed the Qase project with the pilot test cases.

Project code: `$ARGUMENTS` if given, otherwise `QASE_PROJECT` from `.env`.

1. Read `docs/seed-cases.md`.
2. Use the Qase MCP to check the project exists. If it does not, stop and tell me; do not create a
   project unless I confirm.
3. Find or create the suite "SauceDemo – Hybrid Pilot".
4. For each case in the file: if a case with the same title already exists in that suite, skip it.
   Otherwise create it with title, precondition, severity, priority, type, and every step as a
   structured step (action + expected result). Never put the password value into Qase.
5. Finish with a table: seed # | Qase case ID | title | created/skipped.
