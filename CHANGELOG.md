# LLBS Change Log

## Team era (2026-05-22 onwards)

Changes from 2026-05-22 are made by Tim Dixon's agent team. Each entry records the
work folder reference, the change type, and a summary.

## [1.3.0](https://github.com/timdixon82/LLBS/compare/v1.2.0...v1.3.0) (2026-07-16)


### Features

* **brand:** add keyboard navigation for canvas photo and text positioning ([df05348](https://github.com/timdixon82/LLBS/commit/df053484e07632f2846e5afbdc69c8f2817feb3d))
* **brand:** add T-key shortcut to toggle canvas keyboard move mode ([5127925](https://github.com/timdixon82/LLBS/commit/51279259796d5e640462798f9f238ca120f791ba))


### Bug Fixes

* **a11y:** change --primary to [#145](https://github.com/timdixon82/LLBS/issues/145)f81 to pass WCAG 2.2 AAA 7:1 threshold ([4411e12](https://github.com/timdixon82/LLBS/commit/4411e126fdf8c70cd08fbd468b6da11fee39ecbb))
* add dependabot cooldown block to satisfy semgrep dependabot-missing-cooldown rule ([#36](https://github.com/timdixon82/LLBS/issues/36)) ([3f8717d](https://github.com/timdixon82/LLBS/commit/3f8717d257920007e102d8e043e15f23e3c56bb5))
* **deploy:** restore LLBS unbundled deploy variant ([e739da4](https://github.com/timdixon82/LLBS/commit/e739da4f496d8013547da122e1f15d58febfbf7a))

## [1.2.0](https://github.com/timdixon82/LLBS/compare/v1.1.0...v1.2.0) (2026-05-31)


### Features

* **scripts:** add next-q.sh for session Q-number display ([feae8cb](https://github.com/timdixon82/LLBS/commit/feae8cb3129980f7244f4fcf8fc2f1f5cb2c313c))
* **scripts:** add next-q.sh so session-start displays the next Q-number ([96aa4f6](https://github.com/timdixon82/LLBS/commit/96aa4f6daab98be657cbc6222eb853068c92491a))


### Bug Fixes

* **security:** patch pre-tool-use.sh — six safety-hook vulnerabilities ([a502163](https://github.com/timdixon82/LLBS/commit/a502163819f5b6cef121cedcedd2ab75b68a52d2))
* **security:** patch pre-tool-use.sh — six safety-hook vulnerabilities ([72ae05c](https://github.com/timdixon82/LLBS/commit/72ae05c912c71d0179d0735a38ac18e2abe38349))

## [1.1.0](https://github.com/timdixon82/LLBS/compare/v1.0.0...v1.1.0) (2026-05-27)


### Features

* **analytics:** add self-hosted GoatCounter analytics ([#7](https://github.com/timdixon82/LLBS/issues/7)) ([3fed230](https://github.com/timdixon82/LLBS/commit/3fed230ba67447fa1f0566951faf5e005e09928c))

### 2026-05-22 — chore(setup): repository setup build (work 005)

- Split `index.html` and `brand.html` each into separate HTML, CSS, and JavaScript files (`css/strategy.css`, `js/strategy.js`, `css/brand.css`, `js/brand.js`). Behaviour-neutral: both pages render and behave identically to the pre-split versions.
- Self-hosted the DM Sans web font in `assets/fonts/`. Removed the Google Fonts external requests from `index.html`.
- Self-hosted the LLBS logo in `assets/`. Removed the external WordPress origin requests from both pages.
- Removed the CORS proxy code (`CORS_PROXIES`, `loadLogoWithFallback`) from `brand.html`. The logo is now loaded same-origin, which makes the proxy unnecessary.
- Added Content-Security-Policy and Referrer-Policy meta tags to both pages, per ADR 004.
- Added repository configuration: `.github/CODEOWNERS`, pull request template, issue templates, and Dependabot configuration.
- Added project `CLAUDE.md`, `.editorconfig`, and `.gitignore`.
- Added pinned linter manifest: `package.json`, `eslint.config.js`, `.htmlvalidate.json`, `.stylelintrc.json`, `pa11y.json`.
- Expanded `README.md` to the team standard.
- Added `VERSION` file at `1.0.0`.
- Fixed value-card headings to use `h4` instead of `h3`, per requirements.
- Added `role="list"` and `role="listitem"` to the income grid, per requirements.
- Added descriptive `aria-label` attributes to footer links.
- Added `aria-hidden="true"` and `focusable="false"` to decorative SVG icons in `brand.html`.
- Improved focus styles in `brand.css` to use an explicit outline (removed the `outline: none` rule).
- Added `aria-live="polite"` and `aria-atomic="true"` to the status element in `brand.html`.
- Added skip link and `<main>` landmark to `brand.html`.
- Corrected header logo `alt` text in `brand.html` to "Lincoln and Lindsey Blind Society logo".
- Removed emoji from status messages in `brand.js`; status text is now plain.

## Pre-team era

The entries below record changes made before the team adopted the repository.

---

# LLBS Strategy Page — Change Log

## 2026-05-10

### WCAG Colour Contrast Fixes
Five text elements in the dark-navy sections were failing WCAG AA (contrast ratio < 4.5:1). Changed all to `var(--white)` (~15:1, AAA compliant):
- `#join-us` intro paragraph — was `var(--mid-grey)` (#CCD2D8, ~2.8:1)
- `#join-us` closing paragraph — was `var(--mid-grey)` (#CCD2D8, ~2.8:1)
- `#join-us` "How You Can Help" h3 — was `var(--p46)` (#93B6C6, ~3.2:1)
- `#join-us` "Together, We Will" h3 — was `var(--p46)` (#93B6C6, ~3.2:1)
- Health priorities "Investment in LLBS" h3 — was `var(--p46)` (#93B6C6, ~3.2:1)

### Bullet Point Consistency
Route-box lists (Reason / Routes to Outcome in each theme tab) were using an em-dash (—) as the CSS bullet character. Changed `.route-box li::before` from `content: '\2014'` to `content: '\2022'` (standard bullet •) to match the rest of the page.

### Navigation — matched llbs.co.uk style
Redesigned the site header to match the style of the main LLBS website:
- Header background: dark navy → white
- Nav link colour: white → near-black (`var(--text)`)
- Font: Arial → DM Sans (Google Font, added via `<link>` preconnect)
- Logo container: removed white background box (not needed on white header)
- Mobile toggle: updated border/colour for dark-on-white
- Nav link font size: 0.8125rem → 0.9375rem
- Nav gap: 0.1rem → 0.25rem
- Hover state: teal-blue tint (`rgba(21,96,130,0.08)`) with `var(--primary)` text
- Header border-bottom (4px accent) replaced with subtle `box-shadow`

### CSS Specificity Fix — Join Section Background
`section:nth-of-type(even)` (specificity 0-1-1) was overriding `.cta-section` background (0-1-0), making the dark navy section render as light grey and hiding white text. Fixed by changing the alternating rule to `section:nth-of-type(even):not(.cta-section)`.

### Timeline — Continuous Bars
Removed horizontal padding and column borders from year cells so adjacent bars read as solid continuous blocks rather than segmented pieces. Key changes to `.timeline-table td:not(:first-child)`: `padding: 0`, `border-left: none`, `border-right: none`.

### Timeline — Date Corrections (verified against PDF)
Corrected theme bar positions to match the source PDF (page 7):
- **Community**: was mid-2027 → end-2028; corrected to full-2027 → mid-2028
- **Transport**: was 2027 → mid-2028; corrected to 2028 → mid-2029
- Wellbeing (2029–2030) and Future Ready (2026–mid-2027) were already correct
