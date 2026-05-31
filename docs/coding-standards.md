# Project Coding Standards: LLBS

This project follows the team's stack-independent standards in the global wiki's `coding-standards.md`, and the per-stack standards in the global wiki's `stacks/static-front-end.md`.

This page records only what is specific to LLBS: its stack, and any project-specific coding decisions.

## Stack

Static front-end: HTML, CSS, and JavaScript, running entirely in the browser. No server, no database, no build step. See `docs/decisions/003-no-build-step.md`.

Source files:

- `index.html` — strategy page structure
- `css/strategy.css` — strategy page styles, including self-hosted DM Sans font-face rules
- `js/strategy.js` — strategy page behaviour (navigation toggle, ARIA tab handler)
- `brand.html` — Photo Brander page structure
- `css/brand.css` — Photo Brander styles
- `js/brand.js` — Photo Brander application code
- `assets/` — LLBS logo images
- `assets/fonts/` — self-hosted DM Sans WOFF2 files

Linters (run in CI via `npm ci` + npm scripts):

- `html-validate` — HTML linting
- `stylelint` — CSS linting
- `eslint` — JavaScript linting

## Project-specific notes

- No build step. The repository source is the deployed site. Do not introduce a build step without recording a new ADR.
- Self-hosted fonts and logos only. Do not load fonts or images from an external CDN. See `docs/decisions/005-dependency-posture.md`.
- No paid third-party tokens in CI. All CI tooling must be self-contained on free tooling. Use `semgrep scan --config p/default --error`, never `semgrep ci`.
- Content Security Policy is delivered via meta tags (GitHub Pages cannot set response headers). See `docs/decisions/004-github-pages-security-headers.md`. Do not weaken either page's CSP without a recorded decision and Jed's sign-off.
