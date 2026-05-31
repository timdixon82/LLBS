# Code Review and Penetration Test: LLBS

Reviewer: Jed (penetration tester and code reviewer)
Date: 2026-05-21 (setup phase); updated 2026-05-30 (onboarding pass)
Branch reviewed: main (post-setup)
Scope: OWASP Top 10 mapping, front-end security practice, CSP correctness

## Scope and method

Both HTML pages (`index.html` and `brand.html`) were reviewed by code inspection during the 005-llbs-setup work folder pass. The review covered:

- Content Security Policy meta tags on both pages
- Referrer-Policy meta tags
- JavaScript in `js/strategy.js` and `js/brand.js` for injection risks
- Canvas API usage in `brand.html` for data-handling risks
- Dependency posture: external resource loading, CORS proxy removal
- The `security.yml` CI workflow for token hygiene

Automated scanners (Semgrep via CI, Trivy) run on every pull request.

## Confirmed absences (no finding)

- No external scripts, stylesheets, or fonts loaded without Subresource Integrity (all assets self-hosted; see ADR 005)
- No use of `eval`, `Function` constructor, `outerHTML`, or `insertAdjacentHTML`
- No hard-coded secrets, API keys, tokens, or passwords
- No mixed content (HTTPS enforced on GitHub Pages)
- No unvalidated URL parameters or Web Storage reads
- No external links missing `rel="noopener noreferrer"`
- A Content Security Policy is present on both pages (`script-src 'self'` disallows eval and inline script; ADR 004)
- CORS proxy code removed from `brand.html` (ADR 005)

## Findings

| Severity | OWASP | Location | Description | Fix |
|----------|-------|----------|-------------|-----|
| LOW | A05 | GitHub Pages | Missing X-Frame-Options, Permissions-Policy, frame-ancestors (cannot be set on GitHub Pages) | Documented exception SEC-LLBS-001 |
| INFO | A05 | security.yml | `semgrep ci` used instead of token-free `semgrep scan` | Fixed 2026-05-30 onboarding pass |

No critical, high, or medium findings.

## Summary

The project has a sound security baseline for a static public site on GitHub Pages. The hosting platform's inability to set response headers leaves a residual gap (SEC-LLBS-001), accepted and documented by Tim. The `semgrep ci` regression was corrected in the onboarding pass.

### Findings by severity

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 1 (SEC-LLBS-001, accepted exception) |
| Informational | 1 (semgrep ci, now fixed) |

## Review metadata

Automated scanners run: Semgrep (via CI), Trivy (via CI), CodeQL (via CI)
Setup-phase review date: 2026-05-21
Onboarding-pass update: 2026-05-30
