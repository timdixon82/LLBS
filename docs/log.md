# LLBS Project Wiki: Operations Log

This log is chronological and append-only. Each entry records what the team did, learned, or decided. Entries are never edited after they are written.

## [2026-05-21] ingest | Backfill reviews completed; wiki established

The team adopted the `timdixon82/LLBS` repository. Five backfill reviews were carried out in parallel: business analysis (Tad), architecture (Jacob), security governance (Gerrie), code review and penetration test (Jed), and WCAG 2.2 AAA baseline audit (Carol). The project wiki was scaffolded from those reviews.

The site holds two deliverables: `index.html`, the public Living Well Together Strategy 2025 to 2030 page, and `brand.html`, the LLBS Photo Brander staff tool. Neither processes personal data. The live site is at `timdixon82.github.io/LLBS`.

Tim answered 13 questions in the consolidated batch for this adoption work. His answers are recorded in the work log at `.claude/work/005-llbs-setup/log.md` in the team repository. The decisions that affect this wiki are:

- Tim confirmed the live URL as `timdixon82.github.io/LLBS`.
- `brand.html` is treated as publicly accessible.
- The no-JavaScript fallback for tabs is accepted as documented, with a message added for visitors who have JavaScript disabled.
- Fonts and logos are to be self-hosted.
- The GitHub Pages security-header gap is accepted as a documented exception (SEC-LLBS-001).
- The team starts a clearly marked team-era section in `CHANGELOG.md`.
- The strategy PDF is a static asset, left in place, not team-maintained.
- The repository stays as one, not split.
- Both pages are to be split into separate HTML, CSS, and JavaScript files as follow-up work.
- The brand-blue contrast shortfall is documented as an exception (ACC-LLBS-001).
- The Transport theme label is to be darkened to clear the AA contrast floor.
- The `brand.html` keyboard photo-positioning gap is documented as an exception (ACC-LLBS-002).
- The `brand.html` status emoji are kept, but text alternatives are added for screen readers.

Jacob noted that the GitHub Pages security-header pattern and the single-file split decision have both recurred across three projects (Periodic-Table, Clock-Practice, LLBS) and flagged them as candidates for the global wiki patterns folder. Sonja agreed and recorded cross-cutting Decision 006 in the global wiki.

Pages created in this wiki establishment:
- `docs/index.md`
- `docs/log.md` (this file)
- `docs/glossary.md`
- `docs/requirements.md`
- `docs/accessibility.md`
- `docs/decisions/001-one-repo-two-pages.md`
- `docs/decisions/002-file-split.md`
- `docs/decisions/003-no-build-step.md`
- `docs/decisions/004-github-pages-security-headers.md`
- `docs/decisions/005-dependency-posture.md`
- `docs/exceptions/ACC-LLBS-001-brand-blue-contrast.md`
- `docs/exceptions/ACC-LLBS-002-canvas-keyboard-gap.md`
- `docs/exceptions/SEC-LLBS-001-security-headers.md`
