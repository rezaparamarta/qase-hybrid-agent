# Qase Hybrid Agent

This project runs **hybrid test automation**:

1. **Explore phase (AI):** read a test case from Qase, execute it in a real browser through the
   Playwright MCP, judge the outcome, record the result in a Qase test run with evidence.
2. **Codify phase (AI):** turn each executed case into a permanent Playwright spec in
   `tests/generated/`, then run that spec to prove it reproduces the same outcome.
3. **Regression phase (no AI):** `npm run test:qase` runs the specs and the Qase reporter
   publishes results. This is what goes into CI.

The Qase test case is the **source of truth**. Specs are derived from it, never the other way round.

## Tools

- **Qase MCP** (`qase`): projects, suites, cases, runs, results, attachments, defects.
- **Playwright MCP** (`playwright`): browser navigation, clicks, typing, snapshots, screenshots.
  Screenshots land in `./evidence/mcp/`.
- **Shell:** `npx playwright test <file>` to verify generated specs.

Project code comes from `QASE_PROJECT` in `.env` (default `SDEMO`). App URL comes from `BASE_URL`.

## Rules for the explore phase

**Result status** must reflect what was actually observed:

| Status    | When |
|-----------|------|
| `passed`  | Every step ran and **every** expected result was confirmed from a snapshot or page text. |
| `failed`  | A step ran but the actual behaviour differs from the expected result. Record the actual. |
| `blocked` | The case could not be executed: environment down, step ambiguous, data missing. |
| `skipped` | The user asked to skip it. |

- Never mark `passed` from assumption. If you did not see it, it is not verified.
- Never "fix" a failing case by reinterpreting the expected result. A mismatch is a `failed`.
- If a step is ambiguous or outdated, execute the most literal reading. If that is impossible,
  mark `blocked` and explain in the comment. **Do not edit the Qase case** unless the user asks;
  propose the edit in your summary instead.
- After each step with an expected result, take a screenshot and save it under
  `evidence/<RUN_ID>/<CASE_ID>/step-<n>.png`.
- Result comment format:
  ```
  [AI explore] <one-line verdict>
  Step <n>: <actual observation>   (only for failed/blocked steps)
  ```
- **Evidence goes on the step, never on the result.** Upload each step's screenshot with the
  Qase attachment upload tool, take the returned hash, and put it in that step's
  `attachments` inside `steps[]` (with `position`, `status`, `comment`). Leave the
  result-level `attachments` empty and never embed images or image links in any comment.
  A step with an expected result gets exactly one screenshot; a step without one gets none.
- If the result tool does not accept per-step attachments, send the raw Qase API call
  `POST /result/{project}/{run_id}` with the `steps[].attachments` payload instead. Do not
  fall back to result-level attachments.
- Start a fresh browser context per case so cases stay independent.

## Rules for the codify phase

Generate a spec for every `passed` or `failed` case. Do not generate for `blocked`.

- One file per case: `tests/generated/<PROJECT>-<CASE_ID>-<kebab-title>.spec.ts`.
- Follow `docs/spec-template.ts` exactly in structure.
- Link to Qase with `qase(<CASE_ID>, '<case title>')` as the test title.
- One `test.step()` per Qase step, using the **same step text** so results map back cleanly.
- Assert **every** expected result with web-first assertions (`await expect(...)`).
- Locator priority: `getByRole` → `getByLabel` → `getByPlaceholder` → `getByTestId` (this project
  maps it to `data-test`) → `getByText` → CSS as last resort. Use the selectors you actually saw in
  the Playwright MCP snapshots; never invent one.
- No `page.waitForTimeout()`. No hard-coded passwords: read `process.env.SAUCE_PASSWORD` etc.
- Relative URLs only (`page.goto('/')`), `baseURL` comes from config.

### Verify each generated spec

Run it locally with Qase reporting off:

```
npx playwright test tests/generated/<file> --reporter=list
```

The spec outcome must match the explore outcome:

- explore `passed` → spec must pass.
- explore `failed` → spec must fail **on the same expected result** (the bug is real; the spec is
  supposed to stay red until the app is fixed).

If they disagree, fix the spec (selectors, waits), up to 3 attempts. If still mismatched, keep the
file, add `test.fixme()` with a reason, and flag it in the summary.

## Safety

- Never write tokens, passwords or personal data into Qase comments, specs, logs or commits.
- This setup targets the public SauceDemo app. Before pointing it at any internal environment,
  ask the user to confirm the URL and that the test data is safe to submit.
- Do not delete Qase cases, suites, runs or results unless the user explicitly asks.

## Final summary (end of every command)

A short table: Case ID | Title | Explore result | Spec file | Spec verified. Then any proposed case
edits and anything flagged.
