# LLBS: Project Memory

This file is the project-specific memory for the LLBS (Lincoln and Lindsey Blind Society) project. It supplements the global team memory in the AgentTeam repository's `CLAUDE.md`. Every agent working on this project reads both files.

## Project identity

LLBS holds two deliverables, both served from the same repository.

`index.html` is the LLBS Living Well Together Strategy 2025 to 2030 public page. It is a read-only information page with navigation, statistics, a tab widget, and a timeline. Its only behaviour is the mobile navigation toggle and tab keyboard handler.

`brand.html` is the LLBS Photo Brander, a browser tool that lets LLBS staff and volunteers create branded social media images. All processing happens in the browser using the Canvas API. No image data leaves the user's device.

The live site is at `timdixon82.github.io/LLBS`. The repository is `timdixon82/LLBS`.

## Stack

Static front-end: HTML, CSS, and JavaScript, running entirely in the browser. No server, no database, no build step. See `docs/decisions/003-no-build-step.md`.

Source files after the file split:

- `index.html` - strategy page structure
- `css/strategy.css` - strategy page styles, including self-hosted DM Sans font-face rules
- `js/strategy.js` - strategy page behaviour (navigation toggle, ARIA tab handler)
- `brand.html` - Photo Brander page structure
- `css/brand.css` - Photo Brander styles
- `js/brand.js` - Photo Brander application code
- `assets/` - LLBS logo images
- `assets/fonts/` - self-hosted DM Sans WOFF2 files

## Architecture decisions

Key decisions are recorded in `docs/decisions/`. Read these before making structural changes.

- 001: Keep both pages in one repository.
- 002: Split each page into separate HTML, CSS, and JavaScript files.
- 003: No build step. The repository source is the deployed site.
- 004: GitHub Pages hosting; Content-Security-Policy delivered via meta tag; security-header gaps documented in `docs/exceptions/SEC-LLBS-001-security-headers.md`.
- 005: Self-host the DM Sans fonts and the LLBS logos; remove the CORS proxy code from `brand.html`.

## Security posture

Each page carries its own Content-Security-Policy meta tag.

`index.html` target CSP (all inline style attributes have been converted to CSS classes):
`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`

`brand.html` target CSP (no inline script or style after the file split):
`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`

Both pages also carry: `<meta name="referrer" content="strict-origin-when-cross-origin">`.

Do not weaken either policy without a recorded decision and Jed's sign-off.

The LLBS logo is served from `assets/` at the same origin as the pages. Do not restore the external logo URL or the CORS proxy code.

HTTPS is enforced on the GitHub Pages site. Do not change the "Enforce HTTPS" setting.

## Accessibility

The project targets WCAG 2.2 at AAA conformance.

Documented exceptions:
- `docs/exceptions/ACC-LLBS-001-brand-blue-contrast.md`: the LLBS primary colour `#156082` on white gives a contrast ratio of 6.94:1, marginally below the 7:1 AAA threshold. Approved by Tim.
- `docs/exceptions/ACC-LLBS-002-canvas-keyboard-gap.md`: photo positioning on the canvas in `brand.html` is currently pointer-only. A keyboard alternative is a Phase 2 accessibility task.

## Branch and pull request conventions

- Branch names follow the conventional-commits prefix: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `a11y/`.
- Commits use the conventional commit format: `type(scope): description`.
- Pull requests use the template in `.github/pull_request_template.md`.
- Sean opens pull requests; Sonja merges only with Tim's express approval.

## Project wiki

The project wiki is in `docs/`. The index is at `docs/index.md`. The operations log is at `docs/log.md`.
