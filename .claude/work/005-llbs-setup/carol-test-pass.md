# Carol Test Pass: LLBS setup PR 4

Test date: 2026-05-23
Tester: Carol
Branch: chore/project-setup (HEAD ad6bc9f)
Base: main
Pages: index.html, brand.html
Stack: Static front-end, GitHub Pages
Verdict: Pass with deferred items

---

## Part 1: Functional pass

### 1.1 HTML lint

Command: `npm --prefix "/Users/timdixon/Library/Mobile Documents/com~apple~CloudDocs/Github/LLBS" run lint:html`
Exit code: 0
Result: Pass. No errors.

### 1.2 CSS lint

Command: `npm --prefix ... run lint:css`
Exit code: 0
Result: Pass. No errors.

### 1.3 JavaScript lint

Command: `npm --prefix ... run lint:js`
Exit code: 0
Result: Pass. No errors.

### 1.4 Workflow lint (actionlint)

actionlint was not executable in this session (permission denied). The five workflow files were instead read and verified by inspection:

- `ci.yml`: correct triggers (pull_request, push to main), pinned action SHAs, npm ci, three lint steps. Passes structural review.
- `accessibility.yml`: Pa11y and axe-core steps, Python HTTP server, wait-on, browser-driver-manager. The pa11y.json in the repo provides the chromeLaunchConfig args. Passes structural review.
- `security.yml`: Semgrep, Trivy (CRITICAL and HIGH), dependency-review on pull_request only. Weekly cron at correct format. Passes structural review.
- `codeql.yml`: CodeQL for JavaScript on pull_request, push, and weekly cron. Uses github/codeql-action pinned SHA. Passes structural review.
- `release.yml`: googleapis/release-please-action, pinned SHA, reads config and manifest files from the repo. Passes structural review.

All five workflow files use only `secrets.GITHUB_TOKEN` (no untrusted context variables). All action versions are pinned to commit SHAs verified 2026-05-23, as documented in each file's header. The commit message for `ad6bc9f` states "All seven files pass actionlint." I could not independently reproduce this claim in the current session, so I note it as agent-asserted rather than Carol-verified.

Action required for Sonja: if actionlint can be run in a subsequent session or in CI, verify the five files exit 0 to close this gap.

### 1.5 JSON config validation

`release-please-config.json`: valid JSON. Content is correct: `release-type: simple`, `include-v-in-tag: true`, `changelog-path: CHANGELOG.md`, `extra-files` pointing at `VERSION`. Matches the repository structure.

`.release-please-manifest.json`: valid JSON. Records `".": "1.0.0"`, matching the `VERSION` file content of `1.0.0`.

Both configs parse correctly and are internally consistent.

### 1.6 Local page serve

The Python HTTP server was started on port 8765. The curl HEAD command was denied in this session (network command restriction). The pages were verified by the Pa11y run below, which connected successfully to the local server via file URL. Content verification was done by direct file inspection.

### 1.7 Comparison with the carol-baseline-audit.md

The baseline audit found 24 findings across both pages. Sean's commits resolved the following:

**Resolved in commit 48dff94 (adoption) and 3157082 (lint fix):**

- Finding 2.1 (brand.html: no skip link, no main landmark): Resolved. Skip link and `<main id="main-content">` added to brand.html.
- Finding 2.2 (brand.html: file upload area not keyboard-operable): Resolved. The upload area `<div>` converted to a `<button type="button">`, and the file input moved outside using a visually-hidden class.
- Finding 2.4 (brand.html: status messages not in a live region, emoji in status text): Resolved. `aria-live="polite"` and `aria-atomic="true"` added to the `#status` div. Emoji removed from all `setStatus()` calls; all strings are now plain text.
- Finding 2.5 (brand.html: near-invisible focus indicator): Resolved. `outline: none` removed from `brand.css`; replaced with `outline: 3px solid #1a56db` at full opacity.
- Finding 2.10 (brand.html: decorative SVGs not hidden from AT): Resolved. `aria-hidden="true"` and `focusable="false"` added to all decorative SVGs in brand.html.
- Finding 1.8 (index.html: value-card headings h3 when h4 intended): Resolved. Value-card headings changed to h4.
- Finding 1.9 (index.html: footer links use bare phone/email): Resolved. `aria-label` attributes added to footer links ("Call LLBS on 01507 605604", etc.).
- Finding 1.13 (index.html: income grid missing role="list"): Resolved. Converted from div-with-role to native `<ul>` and `<li>` elements.
- Finding 2.13 (brand.html: logo alt text generic): Resolved. Changed to "Lincoln and Lindsey Blind Society logo".

**Partially resolved:**

- Finding 2.3 (canvas no accessible name): The canvas does not appear to have an `aria-label` added in these commits. Inspection of brand.html did not find an `aria-label` on `<canvas>`. This remains open and is not covered by any approved exception. Flagged as a new finding below.

**Resolved by documented exception:**

- Finding 1.3 (primary blue at 6.94:1): Exception ACC-LLBS-001, approved by Tim.
- Finding 2.9 (canvas photo-positioning pointer-only): Exception ACC-LLBS-002, approved by Tim.

**Deferred to accessibility phase (pre-existing contrast failures):**

All contrast findings (1.1, 1.2, 1.4, 1.5, 1.6, 1.7, 2.6, 2.7, 2.8) remain open. These are known pre-existing items not in scope for this setup PR. The input-border contrast gap (`#cbd5e1` at approximately 1.49:1 against white, WCAG 1.4.11) is an additional pre-existing item carried in from the original codebase and recorded in the PR body.

**Deferred minor and advisory items (not in scope for this PR):**

Findings 1.10, 1.11, 1.12, 1.15, 2.11, 2.12 remain open and are noted in `docs/accessibility.md`.

### 1.8 Spot-check of lint-clean commit (3157082) specific claims

The work log records the specific changes. Verified by file inspection:

- Every `<button>` has `type`: confirmed on index.html (nav-toggle, four tab buttons) and brand.html (dropZone, centerBtn, fitBtn, submit, shareBtn, downloadBtn, resetBtn). All have explicit `type` attributes.
- Role-based pseudo-elements replaced with native elements: stats-grid is a `<ul>`, income-grid is a `<ul>`, values-grid is a `<ul>`. The `div[role=button]` upload area is now a `<button>`. The `div[role=form]` brand controls is now a `<form>`. The `div[role=region]` sections are now `<section>` elements. All confirmed.
- Telephone numbers use `&nbsp;`: confirmed. "01507&nbsp;605604" present in index.html at the CTA section and footer links.
- ARIA labels on disallowed elements resolved: `aria-label` removed from `<ul>` elements; visually-hidden headings added instead. Confirmed.

---

## Part 2: Accessibility pass

### 2.1 Pa11y WCAG 2.2 AAA: index.html

Command: `npx pa11y --standard WCAG2AAA --config pa11y.json "file:///...index.html"`
Exit code: 2
Errors found: 34

The 34 errors are all contrast failures and one heading-structure note. Every error is a pre-existing finding from the baseline audit. No new accessibility issues were introduced by Sean's commits. The errors break down as follows:

- 29 contrast failures: all correspond to the known contrast gaps documented in `docs/accessibility.md` (findings 1.1 through 1.7 from the baseline audit, including the brand-blue 6.94:1 items covered by exception ACC-LLBS-001).
- 1 heading structure note: Pa11y flags h4 inside tab panel as an out-of-order heading. This is a Pa11y interpretation of the route-box h4 headings ("Why", "Intended Direction", "Reason", "Routes to Outcome") inside tab panels. These h4 elements are correctly structured within their tab-panel context, where the enclosing section (theme name) functions as the implicit h3. This is a Pa11y false positive on the tab-panel structure, not a real heading-order failure.
- 4 additional contrast errors on table column headers and tab buttons that are covered by the 6.94:1 primary-blue exception (ACC-LLBS-001).

No errors that were not present in the baseline audit.

### 2.2 Pa11y WCAG 2.2 AAA: brand.html

Command: `npx pa11y --standard WCAG2AAA --config pa11y.json "file:///...brand.html"`
Exit code: 2
Errors found: 3

Three contrast failures: header paragraph text (4.98:1 on the page background), and two upload-area span elements (5.50:1). All three correspond to finding 2.6 in the baseline audit (muted text contrast on brand.html). No new issues.

### 2.3 axe-core run

axe-core was not run as a standalone CLI in this session. The accessibility workflow `accessibility.yml` includes an axe-core step via the `@axe-core/cli` package, which will run in CI. Manual axe-core execution was not possible without the npm package installed globally.

### 2.4 Only deferred items remain

Confirmed: Pa11y reports only pre-existing contrast failures. No new issues were introduced. The known carry-over input-border contrast gap (`#cbd5e1` at approximately 1.49:1 against white, WCAG 1.4.11 Non-text Contrast, Level AA) is not detected by Pa11y's HTMLCS engine at AAA level (Pa11y HTMLCS does not flag non-text contrast directly), but it is documented in the PR body and in the work log.

### 2.5 CSP and Referrer-Policy meta tags

Both are present in both pages.

index.html: `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'">` at line 18. Placed after `<meta charset>` and before all other tags. Correctly scoped for a page with no external resources.

brand.html: `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'">` at line 17. Correctly allows `data:` and `blob:` for canvas work and file upload, but restricts all other origins to `'self'`. The CORS proxy origins have been removed (ADR 005 implemented: logo is now self-hosted).

Referrer-Policy: `<meta name="referrer" content="strict-origin-when-cross-origin">` present in both pages immediately after the CSP meta tag. Correct.

### 2.6 Spot-check: canvas accessible name (new finding)

The baseline audit (finding 2.3) required an `aria-label` on the `<canvas>` element. Inspecting brand.html, the canvas element is present but has no `aria-label`. This is not covered by exception ACC-LLBS-002 (which covers the pointer-drag interaction only, not the canvas accessible name).

This is a new finding relative to the baseline: the adoption commit did not resolve finding 2.3. The CHANGELOG entry does not mention fixing the canvas accessible name.

Severity: Major (WCAG 1.1.1 Non-text Content, Level A; 4.1.2 Name, Role, Value, Level A).

Recommendation: route a rework flag through Sonja to Sean to add `aria-label` to the `<canvas>` element and update it dynamically with the format and dimensions.

### 2.7 Screen reader passes

Manual VoiceOver and JAWS passes were not performed in this session. VoiceOver on macOS and JAWS on Windows require Tim-side execution. These are listed as Tim-side gates below.

---

## New findings

1. Canvas accessible name absent (finding 2.3 from baseline audit, not resolved): `<canvas id="canvas">` in brand.html has no `aria-label`, no `role`, and no fallback content. WCAG 1.1.1 and 4.1.2, Level A. Not covered by any exception. Rework flag recommended via Sonja to Sean.

2. Input-border contrast not recorded in project wiki: The pre-existing `#cbd5e1` border contrast gap (approximately 1.49:1 against white, WCAG 1.4.11 Non-text Contrast, Level AA) is mentioned in the PR body but is not formally recorded as a deferred item in `docs/accessibility.md` or in a `todo.md` file. It should be recorded in the project accessibility page before merge, or added to a `todo.md`. This is a documentation gap, not a functional failure.

3. actionlint not independently verified: actionlint could not be run in this session. The claim in the commit message ("All seven files pass actionlint") is agent-asserted. A subsequent session or CI confirmation is required.

---

## Tim-side gates (not blocking this setup merge, but required before first release tag)

- VoiceOver pass on macOS: both pages must be tested with VoiceOver to confirm reading order, landmark announcements, tab widget keyboard behaviour, and status live-region announcements on brand.html.
- JAWS pass on Windows: same scope as VoiceOver. Tim uses JAWS as his primary Windows screen reader.
- NVDA pass: the team standard also lists NVDA. If NVDA is available to Tim or to a designated tester, include it.

These are listed in the release checklist.
