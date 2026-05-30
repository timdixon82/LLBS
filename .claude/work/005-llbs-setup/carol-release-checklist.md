# Release Checklist: LLBS Setup PR 4

Date: 2026-05-23
Checklist author: Carol (tester and release manager)
Pull request: timdixon82/LLBS PR 4
Branch: chore/project-setup (HEAD 47600ed, rework verified)
Base: main
Proposed release version: 1.0.0 (team-adoption release)
Release tag: v1.0.0 (release-please will create this on merge to main)

---

## Rework verification (2026-05-23, HEAD 47600ed)

Sean pushed three commits on top of ad6bc9f to close Carol's two blockers. This section records the re-test of those commits and the final CI status.

### Blocker 1: Canvas accessible name (resolved - commit f502226)

Verified in brand.html and brand.js:

- brand.html line 62-64: `<canvas id="canvas" aria-label="Branded Instagram and Facebook square image preview" tabindex="0">` - static initial label matches the default square format.
- brand.js lines 16-19: FORMATS config contains four per-format ariaLabel strings:
  - square: "Branded Instagram and Facebook square image preview"
  - portrait: "Branded Story, Reel, and TikTok portrait image preview"
  - landscape: "Branded Twitter and X landscape image preview"
  - facebook: "Branded Facebook post image preview"
- brand.js line 143: `canvas.setAttribute('aria-label', currentFormat.ariaLabel)` is called inside `applyFormat()`.
- brand.js line 495: `formatSelect.addEventListener('change', function (e) { applyFormat(e.target.value); })` fires on every format change.

All four formats set a distinct, descriptive label. The label updates dynamically on format change. WCAG 1.1.1 and 4.1.2 now satisfied. Blocker 1 is closed.

### Blocker 2: Input-border contrast gap not formally recorded (resolved - commit 33354c5)

Verified in docs/accessibility.md and todo.md:

- docs/accessibility.md: a "Pre-existing AAA failures, deferred to the accessibility phase" section is present (from line 208 onward). It includes a "Non-text contrast gap (WCAG 1.4.11, Level AA)" subsection that states: input border colour #cbd5e1 achieves approximately 1.49:1 against the white form background, below the 3:1 non-text contrast threshold (WCAG 1.4.11). The WCAG criterion is named. The colour values are named. The item is placed in the deferred backlog section.
- todo.md: a "Pre-existing AAA failures, deferred to the accessibility phase" section lists the same item under "brand.html: non-text contrast gap (WCAG 1.4.11, Level AA)" with the colour values and recommended fix.

Both files record the entry, name the colour values and WCAG criterion, and place it in the deferred backlog. Blocker 2 is closed.

### Pa11y ignore scoping (commit 47600ed)

Verified in pa11y.json:

- ignore array contains exactly three codes:
  - WCAG2AAA.Principle1.Guideline1_4.1_4_6.G17.Fail
  - WCAG2AAA.Principle1.Guideline1_4.1_4_6.G18.Fail
  - WCAG2AAA.Principle1.Guideline1_3.1_3_1_AAA.G141
- No Level A codes are suppressed.
- No blanket suppressions. The ignore list is code-specific.
- A _comment block in pa11y.json cites docs/accessibility.md and todo.md, and explicitly names the accessibility-phase pull request as the place to remove the ignores.
- The comment also states: "The Level A canvas accessible-name code is intentionally NOT listed here, because that finding was resolved in the setup pull request."

Pa11y ignore scoping passes.

### CI status (pulled 2026-05-23)

All seven checks pass on HEAD 47600ed:

- Analyse JavaScript (CodeQL): pass
- CodeQL wrapper: pass
- Dependency review: pass
- Lint HTML, CSS, and JavaScript: pass
- Pa11y and axe at WCAG 2.2 AAA: pass
- Semgrep: pass
- Trivy: pass

No regressions. The CodeQL pending state noted by Sonja has resolved to pass.

---

## 1. Continuous integration

- [x] HTML lint (`npm run lint:html`) exits 0.
- [x] CSS lint (`npm run lint:css`) exits 0.
- [x] JavaScript lint (`npm run lint:js`) exits 0.
- [x] Accessibility workflow (Pa11y + axe-core via CI): passes on HEAD 47600ed. Pa11y exits 0 with the scoped ignore list. axe-core CI step completed.
- [x] Security workflow (Semgrep + Trivy + dependency-review): all three pass on HEAD 47600ed.
- [x] CodeQL workflow: passes on HEAD 47600ed.

---

## 2. Workflow file validation

- [x] `ci.yml`: structurally valid, correct triggers and permissions.
- [x] `accessibility.yml`: structurally valid, Pa11y and axe-core steps correct.
- [x] `security.yml`: structurally valid, Semgrep, Trivy, and dependency-review.
- [x] `codeql.yml`: structurally valid, correct for a public repository.
- [x] `release.yml`: structurally valid, release-please config and manifest paths correct.
- [x] actionlint verification: CI passes all five workflow files end-to-end, which confirms no structural errors. The agent-asserted claim in ad6bc9f is supported by green CI.

---

## 3. JSON config files

- [x] `release-please-config.json` parses as valid JSON and is correctly configured: `release-type: simple`, `include-v-in-tag: true`, `changelog-path: CHANGELOG.md`, VERSION as an extra-file.
- [x] `.release-please-manifest.json` parses as valid JSON and records `".": "1.0.0"`, matching the VERSION file.

---

## 4. Functional testing

- [x] All three linters exit 0 (verified locally and by CI).
- [x] Every `<button>` has an explicit `type` attribute (verified by file inspection).
- [x] Role-based pseudo-elements replaced with native elements (`<ul>`, `<li>`, `<button>`, `<form>`, `<section>`).
- [x] Telephone numbers use `&nbsp;` throughout.
- [x] ARIA labels removed from disallowed elements; visually-hidden headings added instead.
- [x] Self-hosted assets: DM Sans fonts (three weights), LLBS logo for index.html, LLBS logo for brand.html, all present in `assets/` and `assets/fonts/`.
- [x] Google Fonts external load removed from index.html.
- [x] CORS proxy code removed from brand.html (`CORS_PROXIES`, `loadLogoWithFallback`).
- [x] Skip link and `<main>` landmark present in both pages.
- [x] Decorative SVGs in brand.html have `aria-hidden="true"` and `focusable="false"`.
- [x] Status live region in brand.html: `aria-live="polite"` and `aria-atomic="true"`.
- [x] Status messages in brand.js: emoji removed, all plain text.
- [x] Focus styles in brand.css: `outline: 3px solid #1a56db`, fully opaque.
- [x] Value-card headings changed from h3 to h4 in index.html.
- [x] Footer links have descriptive `aria-label` attributes in index.html.
- [x] Income grid uses native `<ul>` and `<li>` in index.html.
- [x] Logo alt text in brand.html: "Lincoln and Lindsey Blind Society logo".
- [x] Canvas aria-label: four distinct, descriptive per-format labels set by applyFormat() in brand.js.

---

## 5. Accessibility testing

- [x] Pa11y WCAG 2.2 AAA on index.html: passes in CI (scoped ignores applied, all ignored codes documented in deferred backlog).
- [x] Pa11y WCAG 2.2 AAA on brand.html: passes in CI (same scoped ignores).
- [x] axe-core on index.html: passes in CI (Pa11y and axe at WCAG 2.2 AAA job: pass).
- [x] axe-core on brand.html: passes in CI.
- [ ] VoiceOver pass (Tim-side gate): required before first release tag.
- [ ] JAWS pass (Tim-side gate): required before first release tag.
- [ ] NVDA pass (Tim-side gate): if available to Tim or a designated tester.

---

## 6. Accessibility exceptions and deferred items

- [x] Exception ACC-LLBS-001 (brand-blue contrast shortfall, 6.94:1): documented in `docs/exceptions/ACC-LLBS-001-brand-blue-contrast.md`. Approved by Tim (answer 10, 2026-05-21).
- [x] Exception ACC-LLBS-002 (canvas photo-positioning pointer-only): documented in `docs/exceptions/ACC-LLBS-002-canvas-keyboard-gap.md`. Approved by Tim (answer 12, 2026-05-21).
- [x] Canvas accessible name (WCAG 1.1.1 and 4.1.2, Level A): resolved in commit f502226. Four per-format aria-label strings set dynamically by applyFormat(). No longer blocking.
- [x] Input-border contrast gap recorded in project wiki: #cbd5e1 at approximately 1.49:1 against white (WCAG 1.4.11, Level AA) is documented in docs/accessibility.md and todo.md, in the deferred backlog section, with colour values and WCAG criterion named. No longer blocking.

---

## 7. Security and compliance

- [x] CSP meta tag present in index.html: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`. Correctly placed first in `<head>` after `<meta charset>`. No external origins (all assets self-hosted).
- [x] CSP meta tag present in brand.html: same policy with `img-src 'self' data: blob:` for canvas work. CORS proxy origins removed.
- [x] Referrer-Policy meta tag (`strict-origin-when-cross-origin`) present in both pages.
- [x] Standing GitHub Pages security-header exception (global wiki decision 011) covers this project. Project pointer at `docs/exceptions/SEC-LLBS-001-security-headers.md` is in place.
- [x] The SEC-LLBS-001 exception file correctly references the standing exception and documents the separate brand.html risk assessment (photo upload context). The global standing exception (decision 011) conditions are met: no external scripts or styles from third-party origins; external fonts and images are self-hosted.
- [x] No hardcoded credentials or API keys in any file.
- [x] No `innerHTML` or unsafe DOM injection methods.
- [x] All external resources use HTTPS.
- [x] Dependabot configured (`.github/dependabot.yml` present).
- [x] Semgrep: pass. Trivy: pass. Dependency review: pass.

---

## 8. Version and changelog

- [x] VERSION file: `1.0.0`.
- [x] `.release-please-manifest.json`: records `"1.0.0"` for the root package.
- [x] CHANGELOG.md: has a clearly marked "Team era (2026-05-22 onwards)" section that records the adoption changes.
- [x] The team-era CHANGELOG entry lists all major changes: file split, self-hosted assets, CORS proxy removal, CSP/Referrer-Policy meta tags, linter manifest, README expansion, accessibility fixes (value-card h4, income grid, footer aria-labels, SVG aria-hidden, aria-live, skip link/main, focus styles, emoji removal).

Release version on merge: release-please will read the conventional-commit history. The adoption commits use `chore`, `fix(a11y)`, and `ci` prefixes. Under the simple release type, no version bump is triggered automatically by these commit types (release-please would keep at 1.0.0 until a `feat` or `fix` commit lands on main). The team-adoption release is therefore v1.0.0, the existing version on disk.

---

## 9. Pull request body accuracy

The PR body at https://github.com/timdixon82/LLBS/pull/4 was verified at the time of initial test. The three rework commits are visible on the PR automatically; the PR body does not need editing for the rework commits to appear.

---

## 10. Architecture-and-security conformance check

To be completed by Sonja before the merge gate. Sonja reviews that:

- The project meets the standing standards in global wiki decision 006 (adopted static front-end projects).
- The GitHub Pages security-header standing exception (decision 011) applies correctly and all its conditions are met.
- The CSP policies on both pages are appropriate for the pages' actual resource loads.
- The CORS proxy removal is complete (confirmed by file inspection: `CORS_PROXIES` constant and `loadLogoWithFallback` function are absent from `js/brand.js`).

---

## 11. Merge gate summary

### Blocking items

None. All blocking items are resolved.

### Non-blocking deferred items (required before first release tag, not blocking this setup merge)

- VoiceOver manual pass (Tim-side).
- JAWS manual pass (Tim-side).
- NVDA manual pass (if available).
- All pre-existing contrast failures (findings 1.1 through 1.7 on index.html, findings 2.6 through 2.8 on brand.html): deferred to the accessibility phase.

### Confirmed clean

- All three linters exit 0.
- Pa11y and axe-core pass in CI on HEAD 47600ed.
- CodeQL, Semgrep, Trivy, and dependency-review all pass.
- Canvas aria-label: four per-format descriptive labels, updated dynamically.
- Input-border contrast gap documented in docs/accessibility.md and todo.md with colour values and WCAG criterion.
- Pa11y ignore list scoped to three specific WCAG codes; no Level A suppression; deferred-backlog comment present.
- CSP and Referrer-Policy meta tags present and correctly configured on both pages.
- Self-hosted assets complete; no external font or image loads.
- Standing GitHub Pages security-header exception covers the project.
- Release-please configuration valid; version 1.0.0 recorded.

---

## 12. Verdict

Ready for the merge gate.

All blocking items are resolved. CI is fully green on HEAD 47600ed. Sonja should run the architecture-and-security conformance check and then present PR 4 to Tim for express merge approval. The VoiceOver and JAWS screen-reader passes remain Tim-side gates before the first release tag but do not block this setup merge.
