# Security Governance Review: LLBS Living Well Together Strategy

Reviewer: Gerrie (security analyst for governance)
Date: 2026-05-21
Project: timdixon82/LLBS — static site hosted on GitHub Pages
Scope: index.html, brand.html
Status: Backfill review. The LLBS repository is not modified.

---

## 1 Scope and method

This review covers the two HTML files that make up the LLBS GitHub Pages site. It assesses:

- UK General Data Protection Regulation (UK GDPR) compliance, focusing on personal data flows, third-party requests, and the absence of consent mechanisms.
- The OWASP Top 10 (2021 edition), each item mapped to the defences the site must carry.
- Security policy: secrets handling, access control, and logging hygiene.
- Security-header posture for GitHub Pages hosting.

No server-side code exists. The site is a fully static front-end. All processing happens in the visitor's browser.

---

## 2 UK GDPR

### 2.1 Personal data collected by the site itself

index.html collects no personal data. There are no forms, no sign-up flows, no comment boxes, and no analytics scripts embedded in the page. The only interactive elements are an in-page navigation menu with keyboard support and a set of ARIA tabs.

brand.html is a local image-branding tool. It accepts a photo uploaded by the user, composites it with the LLBS logo and any overlay text the user types, and produces a download. The file is handled entirely in the browser using the File API and an HTML canvas element. No photo, no text, and no metadata is sent to any server. The download is written directly from the canvas to the user's device. This tool collects no personal data in the UK GDPR sense because no data leaves the user's device or is stored anywhere the organisation controls.

Finding: no personal data is collected or retained by either page. UK GDPR Articles 13 and 14 (privacy notices) and Article 7 (consent) are not triggered by these pages on their own.

### 2.2 Third-party requests that disclose visitor data

Both pages and the visitor's Internet Protocol (IP) address are disclosed to third parties on every page load. This is a UK GDPR concern because an IP address is personal data under the regulation. The requests are:

**index.html**

- Google Fonts (fonts.googleapis.com and fonts.gstatic.com). The page head contains two preconnect links and one stylesheet link that load the DM Sans typeface directly from Google's servers. Every visitor's IP address and browser User-Agent string are sent to Google on page load. There is no consent prompt, no opt-out, and no privacy notice that names Google as a data recipient.

- The LLBS logo image (www.llbs.co.uk). The header loads the logo from `https://www.llbs.co.uk/wp-content/uploads/2023/05/LLBS-logo-with-text.png`. This is an external WordPress installation. The visitor's IP address is disclosed to that server on every page load.

**brand.html**

- The LLBS logo (bd.llbs.co.uk). The page header loads a logo from `https://bd.llbs.co.uk/wp-content/uploads/2024/02/LLBS-logo-with-text-300x83-1.webp` and the JavaScript pre-warms the same fetch on load. This discloses every visitor's IP address to bd.llbs.co.uk on page load.

- CORS proxy services. brand.html defines two third-party CORS proxy services as fallbacks for loading the logo onto the canvas: `https://corsproxy.io/` and `https://api.allorigins.win/`. When the direct load fails, the logo URL is forwarded to one of these third-party relay services. This means the visitor's IP address, their browser fingerprint, and the URL they are proxying are disclosed to an unaffiliated commercial third party. Neither proxy service is named in any privacy notice.

### 2.3 UK GDPR findings and required actions

**Finding G-01 — Google Fonts: no lawful basis documented, no privacy notice**
Severity: Medium
The page loads Google Fonts over the network. This constitutes a transfer of personal data (visitor IP) to Google LLC, a third country controller. Under UK GDPR Article 13 the visitor must be informed of this transfer before it occurs. No cookie banner, no privacy notice, and no link to LLBS's privacy policy exists on the page. The lawful basis is not documented.

Required action: either self-host the DM Sans font files (removing the transfer entirely, which is the preferred solution) or add a UK GDPR-compliant privacy notice that names Google as a data recipient and documents the lawful basis (likely legitimate interests, with a documented balancing test).

**Finding G-02 — CORS proxies in brand.html: undisclosed third-party processors**
Severity: Medium
brand.html may relay visitor IP addresses and the logo URL to corsproxy.io and allorigins.win as fallback CORS proxies. Neither service is under a data processing agreement with LLBS. Under UK GDPR Article 28 any processor must be covered by a written contract. Neither proxy appears in any privacy notice.

Required action: remove the third-party CORS proxy fallbacks and replace them with a locally served copy of the logo. This eliminates the transfer entirely. If a proxy must be retained, a data processing agreement and privacy notice update are required.

**Finding G-03 — External image loads from llbs.co.uk and bd.llbs.co.uk**
Severity: Low
Both pages load images from LLBS-controlled WordPress domains. Because the same organisation controls both endpoints, this is an internal transfer rather than a transfer to a third-party controller. However, those WordPress servers will log visitor IP addresses from the GitHub Pages audience, which is a separate technical system. A privacy notice should acknowledge this logging if it is not already covered.

Required action: consider self-hosting critical images in the GitHub Pages repository to remove the dependency and the cross-domain log. At minimum, ensure the LLBS privacy policy covers logging of IP addresses by the WordPress infrastructure when visitors arrive from the strategy page.

---

## 3 OWASP Top 10 (2021)

### 3.1 A01 Broken Access Control

Static GitHub Pages site. There is no server-side access control to break. All files are publicly readable by design. No authenticated routes exist.

Defence in place: GitHub Pages enforces public read-only access. No action needed at the application layer.

### 3.2 A02 Cryptographic Failures

The site is served over HTTPS by GitHub Pages. The PDF is a static asset stored in the repository and served over the same HTTPS connection.

Finding A02-01: GitHub Pages enforces HTTPS by default but the repository settings should confirm that "Enforce HTTPS" is enabled. This must be verified in the repository settings when the team takes over configuration.

Required action: verify and confirm that "Enforce HTTPS" is enabled in the GitHub Pages settings for timdixon82/LLBS. Record the confirmation in the project wiki.

### 3.3 A03 Injection

index.html has no user-supplied input and no server-side rendering. The JavaScript handles only DOM manipulation and tab switching. There is no eval, no innerHTML assignment from user data, and no dynamic script loading.

brand.html accepts a user-supplied image file, overlay text, and colour values. None of these values is sent to a server. The text is written to an HTML canvas using the 2D context API (`ctx.fillText`), not inserted into the DOM as HTML. Canvas drawing is not an injection surface.

Defence in place: no injection surface on index.html. brand.html uses canvas text rendering, which cannot produce Cross-Site Scripting (XSS). No action needed.

### 3.4 A04 Insecure Design

The strategy page is a publicly readable document. Insecure design would arise if the page inadvertently exposed sensitive internal data or private organisational information.

Finding A04-01: the page contains a telephone number (01507 605604) and an email address (info@llbs.co.uk). These are publicly stated contact details, not sensitive. No internal systems, credentials, or internal network paths are referenced.

Finding A04-02: the PDF (Living Well Together Strategy 2025-2030.pdf) is a static asset in the repository. Its contents are the same strategy document shown in HTML form. No sensitive internal data has been identified, but the PDF metadata should be reviewed for author names, internal file paths, or tracked-changes comments that might disclose internal information. This is a task for Jed's code review rather than this governance review.

Defence in place: adequate for the current content. No governance action beyond the PDF metadata check.

### 3.5 A05 Security Misconfiguration

GitHub Pages serves static files with no application server to misconfigure. The relevant surface is the set of HTTP response headers.

Finding A05-01 — Missing security headers
GitHub Pages does not allow custom HTTP response headers by default. The site currently serves no Content-Security-Policy (CSP), X-Content-Type-Options, X-Frame-Options, Referrer-Policy, or Permissions-Policy header. These headers are a standard defence-in-depth layer.

The practical risk for a fully static information site is low because there is no server logic to protect, no cookies, and no authenticated sessions. However, the absence of X-Frame-Options and a CSP frame-ancestors directive means the page can be framed by a third party, which enables clickjacking. The absence of Referrer-Policy means the full page URL is sent in the Referer header on outbound link clicks (for example, the links to llbs.co.uk and the donation page).

Required action: GitHub Pages natively does not support custom headers. The team has two options. Option A: migrate delivery to Cloudflare Pages or Netlify, both of which allow custom header configuration. Option B: accept the current header posture as a documented exception for a public information site, record it in the exceptions register, and revisit if the site ever carries authenticated content. This decision requires Tim's input and is raised in Section 6 below.

Finding A05-02 — No _headers or _config.yml file
Neither file exists in the repository. This confirms there is no current header configuration.

### 3.6 A06 Vulnerable and Outdated Components

No JavaScript libraries or frameworks are used. Both pages use plain HTML, CSS, and vanilla JavaScript. There are no npm dependencies, no package.json, and no lock files. The only external dependency is the Google Fonts CSS and the LLBS logo images.

Defence in place: no third-party library supply chain to manage. The Google Fonts connection carries its own privacy risk (see G-01) but not a direct vulnerability risk.

### 3.7 A07 Identification and Authentication Failures

The site has no authentication. There are no login forms, no sessions, no cookies, and no tokens.

Defence in place: not applicable. No action needed.

### 3.8 A08 Software and Data Integrity Failures

No Subresource Integrity (SRI) attribute is used on the Google Fonts stylesheet link. If Google's CDN were compromised, the modified stylesheet would be loaded without any integrity check.

Finding A08-01 — No SRI on Google Fonts link
The `<link>` element for the Google Fonts stylesheet does not carry an `integrity` attribute. SRI cannot fully protect dynamic font stylesheets because Google rotates the stylesheet URL, but a hash on the stable import is good practice.

The practical risk is low: a compromised font stylesheet would affect page appearance, not execute attacker-controlled JavaScript. However, removing the external font load entirely (as recommended under G-01) resolves both G-01 and A08-01 in one step.

Required action: self-host the DM Sans font. This closes G-01, G-02 (partially), and A08-01 simultaneously.

### 3.9 A09 Security Logging and Monitoring Failures

GitHub Pages logs access at the platform level. The organisation does not currently control those logs. There is no application-level logging because there is no application server.

Finding A09-01: the team should confirm that Tim or LLBS has access to GitHub repository traffic insights for basic visibility of page load volumes and referrers. This is not a security-critical gap for a static public information page, but it is good practice.

Defence in place: adequate for the site's risk profile. No mandatory action.

### 3.10 A10 Server-Side Request Forgery (SSRF)

There is no server. SSRF is not applicable to a static site.

Defence in place: not applicable. No action needed.

---

## 4 Security policy

### 4.1 Secrets handling

No API keys, tokens, passwords, or credentials are present in either HTML file or in the visible repository content. The GitHub repository is public. The team must ensure no secrets are ever committed.

Required action: GitHub secret scanning should be enabled on the repository. The brief confirms this is not on the hard deny-list and should be part of the repository configuration Sean adds.

### 4.2 Access control on the repository

The repository is currently owned by timdixon82. When the team takes over configuration, branch protection should be added to the main branch. This is part of Sean's configuration work and is not a deviation from the hard deny-list (which forbids disabling branch protection, not enabling it).

### 4.3 Logging hygiene

Neither page logs personal data. brand.html writes status messages to a DOM element (`statusEl.textContent`) using safe text assignment. No data is sent to any logging endpoint. No action needed.

---

## 5 Security exceptions register

Two items require a formal exception because they cannot be fully resolved without a platform change or Tim's decision.

### Exception SEC-LLBS-001: Missing HTTP security headers

File: /Users/timdixon/Library/Mobile Documents/com~apple~CloudDocs/Github/LLBS/index.html (and brand.html)
Category: Security misconfiguration (OWASP A05)
Reason: GitHub Pages does not support custom HTTP response headers. The site cannot serve CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, or Permissions-Policy without migrating to a CDN or edge platform that supports header injection.
Risk: low. The site is a fully static public information page with no cookies, no authenticated sessions, and no user-submitted data. Clickjacking risk is minimal because the page contains no high-value interactive controls.
Mitigation: the team will evaluate Cloudflare Pages or Netlify as a delivery layer (see Section 6, question 1). Until a decision is made, this exception stands.
Tim's approval: required. Raised in Section 6.
Date raised: 2026-05-21

### Exception SEC-LLBS-002: Third-party CORS proxies in brand.html

File: /Users/timdixon/Library/Mobile Documents/com~apple~CloudDocs/Github/LLBS/brand.html
Category: UK GDPR Article 28 (processor agreement)
Reason: brand.html uses corsproxy.io and allorigins.win as fallback CORS proxies when loading the LLBS logo onto the canvas. These third-party services may receive visitor IP addresses. No data processing agreement exists.
Risk: medium. Visitor IP addresses are personal data under UK GDPR.
Mitigation: the preferred fix is to copy the LLBS logo file into the GitHub Pages repository and load it as a relative path, removing all CORS issues. This eliminates the external dependency entirely.
Tim's approval: required. Raised in Section 6.
Date raised: 2026-05-21

---

## 6 Questions for Tim (batched for Sonja)

The following questions need Tim's decision before the team can close the open items. Sonja should present these to Tim together.

Question 1: HTTP security headers — delivery platform
The current GitHub Pages setup cannot serve custom HTTP security headers. Would you like the team to:

A. Migrate delivery to Cloudflare Pages (free tier supports custom headers and retains GitHub as the source).
B. Migrate delivery to Netlify (free tier, same benefit).
C. Accept the current header posture as a documented exception for now, on the basis that the site is a public information page with no authenticated content, and revisit if the site gains interactive features.

Gerrie's recommendation: option C for now, recorded as SEC-LLBS-001. The risk is genuinely low for a static information page. Options A and B are worth considering if the site ever carries a contact form or member login.

Question 2: Self-hosting fonts and the logo
The quickest fix for G-01 (Google Fonts UK GDPR issue) and G-02 (CORS proxy issue) is to copy the DM Sans font files and both LLBS logo images into the GitHub Pages repository, then load them as relative paths with no external request. Would you like the team to make this change as part of the chore/project-setup branch?

A. Yes, self-host fonts and logos in the repository.
B. No, keep the current external loads and document them in the privacy notice instead.

Gerrie's recommendation: option A. Self-hosting removes the Google Fonts UK GDPR transfer entirely, removes the CORS proxy dependency in brand.html, and reduces page load latency. The DM Sans font files are small (roughly 50 kilobytes per weight for a Latin subset).

---

## 7 Summary of findings

| Reference | Area | Severity | Action required |
|---|---|---|---|
| G-01 | Google Fonts: UK GDPR transfer to Google, no lawful basis or notice | Medium | Self-host or add privacy notice |
| G-02 | CORS proxies in brand.html: undisclosed third-party processors | Medium | Self-host logo (preferred) |
| G-03 | External image loads from LLBS WordPress domains | Low | Self-host or update privacy notice |
| A02-01 | Confirm HTTPS enforcement in GitHub Pages settings | Low | Verify on project setup |
| A05-01 | Missing HTTP security headers | Low | Pending Tim's decision (SEC-LLBS-001) |
| A08-01 | No SRI on Google Fonts link | Low | Resolved if fonts self-hosted |
| A09-01 | Confirm access to GitHub traffic insights | Informational | Confirm on project setup |

No high-severity findings. The two medium findings both resolve cleanly if fonts and logos are self-hosted, which is the recommended approach.

---

## 8 Notes on brand.html

brand.html is a client-side-only image compositing tool. It processes photos entirely in the browser. No photo data ever leaves the user's device. For UK GDPR purposes this tool is transparent to the organisation: it does not give LLBS access to any personal data. The only data governance issue is the third-party CORS proxy fallback (G-02 and SEC-LLBS-002), which is fully resolved by self-hosting the logo.
