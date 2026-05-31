# Security Review: LLBS

This document records the security review for LLBS, carried out by Jed (penetration testing and security governance). It covers the OWASP Top 10 assessment, any findings, and the release condition.

A setup-phase security review was completed during work folder 005-llbs-setup on 2026-05-21. The findings from that review are reflected in the decisions and exceptions below. This document should be updated whenever a significant change is made to the project's security posture.

## Verdict

SAFE WITH DOCUMENTED EXCEPTIONS. The project may be released subject to the exceptions recorded in `docs/exceptions/`.

Required ongoing actions:
- The `semgrep ci` regression in `security.yml` was corrected to `semgrep scan --config p/default --error` during the 2026-05-30 onboarding pass.

## OWASP Top 10 assessment

### A01 Broken access control

Not applicable. LLBS is a public read-only static site with no access control, authentication, or user accounts. `brand.html` processes user-provided photos entirely in the browser; no data is transmitted to a server.

### A02 Cryptographic failures

No sensitive data is transmitted or stored. HTTPS is enforced via GitHub Pages "Enforce HTTPS" setting. No cryptographic operations are performed. Not applicable.

### A03 Injection

No server-side processing. `index.html` and `brand.html` contain no user input that is reflected into the DOM without sanitisation. The Content Security Policy (delivered via meta tag) blocks inline scripts and untrusted script sources. See `docs/decisions/004-github-pages-security-headers.md`.

CSP meta tags are the primary injection mitigation given the GitHub Pages hosting constraint (no response headers). The `script-src 'self'` policy disallows eval and inline script. The canvas API in `brand.html` processes image data entirely in-browser.

### A04 Insecure design

No server-side logic. The Photo Brander's design is intentionally client-side only: no image data leaves the device. See `docs/decisions/005-dependency-posture.md`.

### A05 Security misconfiguration

Partially mitigated. GitHub Pages cannot set the full set of HTTP security headers. `X-Frame-Options`, `Permissions-Policy`, and `frame-ancestors` CSP cannot be delivered. This is a documented exception — see `docs/exceptions/SEC-LLBS-001-security-headers.md`.

Mitigations in place:
- Content Security Policy via meta tag
- Strict-Transport-Security via GitHub Pages (Enforce HTTPS on)
- X-Content-Type-Options: nosniff via GitHub Pages default
- Referrer-Policy via meta tag

### A06 Vulnerable and outdated components

Mitigated via Dependabot (weekly grouped updates for GitHub Actions and npm). CI runs Trivy and dependency-review on every pull request.

### A07 Identification and authentication failures

Not applicable. No authentication, no user accounts.

### A08 Software and data integrity failures

GitHub Actions workflows use pinned SHAs for all actions. Dependabot tracks and proposes SHA updates. No `npm run build` step means the deployed files are the committed source files. Release automation uses release-please.

### A09 Security logging and monitoring failures

Not applicable for a static site. No server-side logging is possible on GitHub Pages.

### A10 Server-side request forgery

Not applicable. No server-side processing.

## Continuous integration checks

- CodeQL analysis (JavaScript): passing
- Trivy vulnerability scan: passing
- Dependency review: passing
- Semgrep scan (`semgrep scan --config p/default --error`, token-free): passing

Note: `semgrep ci` (which requires SEMGREP_APP_TOKEN) is not used. All scanning is self-contained on free tooling.

## Findings

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| SEC-LLBS-001 | LOW | Missing HTTP security headers on GitHub Pages (X-Frame-Options, Permissions-Policy, frame-ancestors) | Accepted exception — see docs/exceptions/SEC-LLBS-001-security-headers.md |

## Release condition

The project is cleared for release when:
- All CI checks pass (CodeQL, Trivy, dependency-review, Semgrep).
- Both pages carry their target Content Security Policies (no `'unsafe-inline'`).
- Carol has signed off accessibility and functional testing.
- The documented exceptions (SEC-LLBS-001, ACC-LLBS-001, ACC-LLBS-002) remain the only open items.
