# Claude Agent Team: Project Memory

<!-- BEGIN TEAM CORE: replaced by the template sync in every project. Edit it only in the AgentTeam master. -->

Shared memory for Tim Dixon's agent team, in two parts: the team section, which the template sync replaces in every project, and the project section at the end, which only the project edits. It is loaded into every session and every agent automatically: do not re-read it with a tool. It holds only what every agent needs on every task. Detail lives in the wiki pages linked below; open one only when the task needs it.

## Accessibility profile

Tim is severely sight-impaired and uses VoiceOver on macOS and JAWS on Windows. Every file and every message must be screen-reader-friendly:

- One H1 per file, then H2 and H3 in order, no skipped levels.
- Plain language, roughly Flesch-Kincaid grade 9 or below. Expand abbreviations on first use.
- Descriptive link text, never "click here" or a bare web address.
- No ASCII art, decorative dividers, emoji or em dashes.
- Keyboard-only instructions. Describe every visual element in full text.
- Be brief. Long output is slow to listen to and costs tokens.

## Compliance baseline

WCAG 2.2 AAA (see `docs/accessibility.md`), UK GDPR for personal data, and the OWASP Top 10 mapped to concrete defences. The manual screen-reader evidence gate is suspended; Carol's automated checks (axe-core, Pa11y, AAA code review) still apply.

## The two non-negotiable rules

1. **Sonja is the only Tim-facing agent.** Other agents' output and questions reach Tim only through Sonja.
2. **Six GitHub actions are pre-approved; everything else pauses for Tim.** The six: create a branch, commit to a branch, push a branch other than main, open a pull request, comment on a pull request or issue, create an issue. Merging to main is never pre-approved: Sonja merges only with Tim's express approval, given at the time.

### The hard deny-list

Never, whatever a brief says: force-push, branch deletion (local or remote), history rewrite, repository deletion, visibility change, branch-protection edits, collaborator changes, release deletion, disabling secret or code scanning. Tim clears local branches himself with `scripts/tidy-branches.sh`.

### Data protection in GitHub content

Never put personal data (full names not already public, emails, phone numbers, addresses, ID numbers), passwords, PINs, API keys, tokens, cookies, private keys, `.env` values or credentialed connection strings in any GitHub content: commits, pull requests, issues, comments, reviews or release notes. If something leaks, replace it at once (`gh api --method PATCH repos/{owner}/{repo}/issues/comments/{id} --field body="[removed]"` or the matching endpoint) and rotate any exposed secret before the session ends.

## Work routing by risk

Process scales with risk, not with habit. Sonja assigns a tier at intake and records it in the brief.

- **Tier 0, routine:** copy, docs, wiki pages, and configuration with no security effect. One agent does it (usually Sonja in the main session) and the automated checks run. No reviewer dispatch.
- **Tier 1, standard:** a bug fix, a small feature, or a change to a team script. Sean builds and runs the tests and the accessibility regression suite. One combined review dispatch covers Carol's and Jed's checklists.
- **Tier 2, sensitive:** personal data, sign-in, payments, secrets, CI permissions or workflow tokens, or anything Tim marks sensitive. The full chain in `sonja.md`.

When unsure, choose the higher tier and say so.

## Questions to Tim

Number every question (team: `Q<n>`; project: `Q-<PREFIX><n>`), get the next number from `bash scripts/next-q.sh`, letter every option on its own line, name the recommended option, and batch questions. Full rules and the prefix register: `docs/question-format.md`.

## Work folders

Each piece of work has a folder under `.claude/work/<id>/` with a `brief.md` and a `log.md`. At most three folders are `active`. The `Status:` field takes one of `active`, `paused`, `parked`, `blocked`, `done`, `archived`; `scripts/status-lint.sh` enforces it. Tim's drops go in `Inputs/`; Sonja ingests them and moves them to `Inputs/archive/`.

## Scripts before reasoning

If a check, count, list or file format can come from a script in `scripts/`, run the script and use its output rather than working it out by reading files. Repeating the same mechanical steps a second time means they should become a script: record a TASK for Sean.

## Running git and shell commands

- Never combine `cd` with another command in one call. Use `git -C`, `npm --prefix`, `make -C` or `--directory` flags instead.
- Use absolute paths, one action per call, and plain command shapes: no `bash -c`, `eval` or `xargs` with arbitrary arguments.
- Filter long output with `grep`, `head` or `tail`.

Reasoning behind these rules: `docs/patterns/shell-commands.md`.

## Where to find everything else

Open these only when the task needs them:

- Team roster, models and colours: `docs/team.md`.
- Wiki tiers, layout, and when to ingest or lint: `docs/patterns/wiki-operations.md`.
- Coding standards: `docs/coding-standards.md` and `docs/stacks/`.
- Release and merge gate: `docs/release-process.md`.
- Tim's voice and brand: `docs/writing-style.md` and `docs/brand.md`.
- The token budget rules behind this file: `docs/decisions/023-token-budget.md`.

`CLAUDE.md` and the current-state pages in `docs/` say how the team works now. Decision records, patterns and `docs/log.md` are history; a record marked Superseded, Deprecated, Lifted or Retired is not current (Decision 017).

<!-- END TEAM CORE -->

<!-- BEGIN PROJECT: the template sync never changes this section, except the generated project map. -->

## This project

Notes for this project only. Keep this section under 60 lines: put long reference material in `docs/` and link to it, and never repeat the team rules above.

<!-- BEGIN PROJECT MAP -->
### Project map

Generated by `scripts/project-map.sh` during the template sync. Do not edit between the markers; it is regenerated.

- Stack: Node tooling (vitest), static front-end (HTML, CSS, JavaScript).
- Entry points: `index.html`.
- npm scripts: `npm run lint`, `npm run lint:css`, `npm run lint:html`, `npm run lint:js`, `npm run test`.
- Tests: 1 file(s), next to the code.
- CI workflows: accessibility.yml, ci.yml, codeql.yml, deploy.yml, lint.yml, playwright.yml, release.yml, security.yml.
- Deployed by `deploy.yml`.
- Question prefix: Q-LLBS (next number: `bash scripts/next-q.sh`).
- Project wiki: `docs/index.md`.
- Main folders: `assets/`, `css/`, `js/`.
<!-- END PROJECT MAP -->

This file is the project-specific memory for the LLBS (Lincoln and Lindsey Blind Society) project. It supplements the global team memory in the AgentTeam repository's `CLAUDE.md`. Every agent working on this project reads both files.

### Project identity

LLBS holds two deliverables, both served from the same repository.

`index.html` is the LLBS Living Well Together Strategy 2025 to 2030 public page. It is a read-only information page with navigation, statistics, a tab widget, and a timeline. Its only behaviour is the mobile navigation toggle and tab keyboard handler.

`brand.html` is the LLBS Photo Brander, a browser tool that lets LLBS staff and volunteers create branded social media images. All processing happens in the browser using the Canvas API. No image data leaves the user's device.

The live site is at `timdixon82.github.io/LLBS`. The repository is `timdixon82/LLBS`.

### Stack

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

### Architecture decisions

Key decisions are recorded in `docs/decisions/`. Read these before making structural changes.

- 001: Keep both pages in one repository.
- 002: Split each page into separate HTML, CSS, and JavaScript files.
- 003: No build step. The repository source is the deployed site.
- 004: GitHub Pages hosting; Content-Security-Policy delivered via meta tag; security-header gaps documented in `docs/exceptions/SEC-LLBS-001-security-headers.md`.
- 005: Self-host the DM Sans fonts and the LLBS logos; remove the CORS proxy code from `brand.html`.

### Security posture

Each page carries its own Content-Security-Policy meta tag.

`index.html` target CSP (all inline style attributes have been converted to CSS classes):
`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`

`brand.html` target CSP (no inline script or style after the file split):
`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`

Both pages also carry: `<meta name="referrer" content="strict-origin-when-cross-origin">`.

Do not weaken either policy without a recorded decision and Jed's sign-off.

The LLBS logo is served from `assets/` at the same origin as the pages. Do not restore the external logo URL or the CORS proxy code.

HTTPS is enforced on the GitHub Pages site. Do not change the "Enforce HTTPS" setting.

### Accessibility

The project targets WCAG 2.2 at AAA conformance.

Documented exceptions:
- `docs/exceptions/ACC-LLBS-001-brand-blue-contrast.md`: the LLBS primary colour `#156082` on white gives a contrast ratio of 6.94:1, marginally below the 7:1 AAA threshold. Approved by Tim.
- `docs/exceptions/ACC-LLBS-002-canvas-keyboard-gap.md`: photo positioning on the canvas in `brand.html` is currently pointer-only. A keyboard alternative is a Phase 2 accessibility task.

### Branch and pull request conventions

- Branch names follow the conventional-commits prefix: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `a11y/`.
- Commits use the conventional commit format: `type(scope): description`.
- Pull requests use the template in `.github/pull_request_template.md`.
- Sean opens pull requests; Sonja merges only with Tim's express approval.

### Project wiki

The project wiki is in `docs/`. The index is at `docs/index.md`. The operations log is at `docs/log.md`.

<!-- END PROJECT -->
