# ADR 004: GitHub Pages hosting and the security-header constraint

## Status

Accepted. Recorded by Jacob (architect) on 2026-05-21 during work 005-llbs-setup. Tim approved the security-header exception on 2026-05-21 (answer 5 in the consolidated question batch). The Content Security Policy values shown here are targets; interim policies with `'unsafe-inline'` apply until ADR 002 and ADR 005 work is complete.

## Context

LLBS is hosted on GitHub Pages, served from the public `timdixon82/LLBS` repository. The live site is at `timdixon82.github.io/LLBS`.

The team's coding standard requires a set of security response headers on every site: Content Security Policy (CSP), Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, and Permissions-Policy.

GitHub Pages has a hard limit: it does not allow the site owner to set custom HTTP response headers. GitHub Pages sends Strict-Transport-Security once "Enforce HTTPS" is enabled, and sends X-Content-Type-Options with value `nosniff` by default. The rest cannot be set as real response headers.

This record decides how LLBS meets the security-header standard within that limit. LLBS differs from earlier projects (Periodic-Table, Clock-Practice) in one important way: `brand.html` is an interactive application that loads cross-origin resources, so its CSP is a real piece of design, not a near-empty `'self'` policy.

## Decision

### Hosting

Confirm GitHub Pages as the host, with "Enforce HTTPS" enabled. This is the standard static-project host and needs no change.

### Security headers within the GitHub Pages limit

1. **Content Security Policy** is delivered through a `<meta http-equiv="Content-Security-Policy">` tag in the `<head>` of each page, placed first after `<meta charset>`. A meta-tag policy is honoured by all current browsers and is the only delivery route available on GitHub Pages. Its known limits: it cannot use the `frame-ancestors` directive, the `report-uri` or `report-to` directives, or the sandbox directive. Each page gets its own policy; the two pages do not share one.

2. **Strict-Transport-Security** is sent by GitHub Pages once "Enforce HTTPS" is on. No project action is needed beyond keeping that setting on.

3. **X-Content-Type-Options** is sent by GitHub Pages by default as `nosniff`. No project action is needed.

4. **Referrer-Policy** is delivered through a `<meta name="referrer" content="strict-origin-when-cross-origin">` tag in the `<head>`.

5. **X-Frame-Options** and **Permissions-Policy** cannot be set on GitHub Pages and have no reliable meta-tag equivalent. The `frame-ancestors` CSP directive also cannot be delivered by meta tag. This leaves a residual gap: clickjacking protection and browser-feature lock-down are not enforced by headers.

6. The residual gap is accepted as a documented security exception. Tim approved this exception (answer 5). See `docs/exceptions/SEC-LLBS-001-security-headers.md`.

### Content Security Policy values

Each page carries its own policy, as strict as that page permits.

**`index.html` target policy** (after the file split in ADR 002 and the self-hosting work in ADR 005):

```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'
```

**`index.html` interim policy** (while the page is still a single file with inline script, inline style, and inline style attributes):

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://www.llbs.co.uk; font-src 'self' https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; form-action 'none'
```

`'unsafe-inline'` in the interim policy is a weakness that the file split removes. It is included only because a single-file page has its script and style inline.

**`brand.html` target policy** (after self-hosting the logo per ADR 005 and doing the file split per ADR 002):

```
default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'
```

`img-src` must allow `data:` and `blob:` because the canvas work produces data URIs and the file upload creates blob URLs.

**`brand.html` interim policy** (while the CORS proxies are still in use and the page is a single file):

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://bd.llbs.co.uk; connect-src 'self' https://corsproxy.io https://api.allorigins.win https://bd.llbs.co.uk; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'
```

The exact policy for each page must be tested in a real browser before release. For `brand.html`, the canvas, blob URLs, and any remaining logo fetch are the parts most likely to break under a strict policy. Carol and Jed verify both pages under their respective policies.

## Alternatives considered

**Move hosting to a host that can set response headers (Netlify, Cloudflare Pages).** Considered and rejected for this work. The foundations decision sets GitHub Pages as the standard static host, the project already runs there, and the cost of migrating platforms is not repaid for pages of this risk profile. This remains the right answer if LLBS later needs the full header set, and the case is slightly stronger here than for earlier projects because `brand.html` handles a user's photo.

**Put a content delivery network in front of GitHub Pages to inject headers.** Rejected. A CDN in front of the Pages site could add the missing headers, but it adds a second platform to configure and maintain and a custom domain to manage. Disproportionate for this risk profile.

**Use one shared CSP for both pages.** Rejected. A shared policy would have to be as wide as `brand.html` needs, which would needlessly weaken `index.html`. Each page carries its own policy. This is a direct consequence of ADR 001.

## Consequences

- Each page carries its own `<meta http-equiv="Content-Security-Policy">` tag and a `<meta name="referrer">` tag, placed first in the `<head>` after `<meta charset>`.
- The project has a documented security exception for the response headers GitHub Pages cannot send. See `docs/exceptions/SEC-LLBS-001-security-headers.md`.
- The strict target policies depend on the file split in ADR 002 and, for `brand.html`, on the dependency changes in ADR 005. Until that work is done, the interim policies with `'unsafe-inline'` apply.
- "Enforce HTTPS" must stay on. The team's hard deny-list forbids disabling repository security settings.
- Both pages must be tested in a real browser under their policies before release. `brand.html` is the more fragile and must be exercised through a full upload-edit-share-download cycle.
