# LLBS Project Wiki: Index

This is the catalogue of every page in the LLBS project wiki. The wiki covers `timdixon82/LLBS`, which holds two deliverables: `index.html`, the public Living Well Together Strategy 2025 to 2030 page for the Lincoln and Lindsey Blind Society (LLBS), and `brand.html`, the LLBS Photo Brander staff tool.

The wiki was established on 2026-05-21 when the team adopted this repository. For the background to that adoption, see the work log at `.claude/work/005-llbs-setup/log.md` in the team repository.

## Core pages

- [Index](index.md): this catalogue.
- [Log](log.md): chronological, append-only operations log.
- [Glossary](glossary.md): terms specific to the LLBS project.
- [Requirements](requirements.md): functional and non-functional requirements and acceptance criteria, reverse-engineered from the source files.
- [Accessibility](accessibility.md): the project's WCAG 2.2 AAA position and the baseline audit findings.
- [Coding standards](coding-standards.md): the project's stack and project-specific coding decisions.
- [Privacy](privacy.md): analytics, data collection, and UK GDPR posture.
- [Release process](release-process.md): branching model, merge gate, and deployment steps.

## Security

- [Security review](security-review.md): OWASP Top 10 assessment and CI check status.
- [Code review](code-review.md): Jed's code review and penetration test record.

## Decisions

Each Architecture Decision Record (ADR) covers one architectural choice for the project.

- [ADR 001: One repository, two separate pages](decisions/001-one-repo-two-pages.md)
- [ADR 002: Split each page into separate HTML, CSS, and JavaScript files](decisions/002-file-split.md)
- [ADR 003: No build step](decisions/003-no-build-step.md)
- [ADR 004: GitHub Pages hosting and the security-header constraint](decisions/004-github-pages-security-headers.md)
- [ADR 005: Dependency posture and removing the public CORS proxies](decisions/005-dependency-posture.md)

## Exceptions

Approved exceptions to the team's accessibility and security standards.

- [ACC-LLBS-001: Brand-blue primary colour contrast shortfall](exceptions/ACC-LLBS-001-brand-blue-contrast.md)
- [ACC-LLBS-002: Canvas photo-positioning is pointer-only](exceptions/ACC-LLBS-002-canvas-keyboard-gap.md)
- [SEC-LLBS-001: Missing HTTP security headers on GitHub Pages](exceptions/SEC-LLBS-001-security-headers.md)

## Patterns

Project-specific implementation patterns are in `docs/patterns/`. None recorded yet.

## Release process

See [Release process](release-process.md) for the full branching model, merge gate, and deployment steps. The global team release process is at `docs/release-process.md` in the AgentTeam wiki.
