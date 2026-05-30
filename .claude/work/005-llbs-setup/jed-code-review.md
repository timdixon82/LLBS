# LLBS Code Review and Penetration Test

Reviewer: Jed (penetration testing and code review)
Date: 2026-05-21
Scope: `index.html` and `brand.html` in the `timdixon82/LLBS` repository
Stack: Static front-end (HTML, CSS, JavaScript) hosted on GitHub Pages
Review type: Backfill -- the project predates the team

---

## Summary

Two files were reviewed. Neither file uses any unsafe DOM injection method (innerHTML, outerHTML, insertAdjacentHTML, or the deprecated document-write API). Neither uses dynamic code evaluation via eval or via constructing functions from strings. There are no inline event handler attributes on HTML elements. JavaScript is confined to script blocks at the bottom of each file. The DOM injection risk is low.

The main findings are infrastructure-level: absent security headers, missing Subresource Integrity (SRI) on a third-party stylesheet, and one privacy-affecting configuration in `brand.html` that relies on third-party CORS proxies to load a logo. None of the findings represent a direct exploit path for an attacker against a visitor. All are Medium or Low severity within the context of a read-mostly static site.

Severity counts:

- High: 0
- Medium: 2
- Low: 2
- Informational: 1

---

## Findings

### Finding 1: No Content-Security-Policy header or meta tag

Severity: Medium
OWASP Top 10 category: A05:2021 Security Misconfiguration

Affected files: `index.html`, `brand.html`

Neither file sets a Content-Security-Policy (CSP) via an HTTP response header or a `<meta http-equiv="Content-Security-Policy">` tag. GitHub Pages does not inject a CSP header by default.

Without a CSP, the browser permits script execution from any origin. If an attacker were able to inject markup into a future version of either page (for example, through a supply-chain compromise of the Google Fonts stylesheet or through a future developer error), the browser would execute that script without any policy barrier.

For `brand.html` the risk is elevated: the page actively fetches content from two third-party CORS proxy services (`corsproxy.io` and `api.allorigins.win`) and draws the result onto an HTML Canvas. A CSP would constrain which origins are permitted to respond to those fetches.

How to reproduce: Open either file in a browser. In the developer tools, inspect the response headers. No `Content-Security-Policy` header is present.

Recommended fix: Add a `<meta http-equiv="Content-Security-Policy">` tag to the `<head>` of each file. A starting policy for `index.html` (which loads only Google Fonts as a third-party resource) would restrict `default-src` to `none`, allow `style-src` for `self` and Google Fonts plus unsafe-inline for the inline style block, allow `font-src` for `fonts.gstatic.com`, allow `img-src` for `self` and `www.llbs.co.uk`, allow `script-src` for `self` only, and add `frame-ancestors 'none'`.

`brand.html` needs a wider `connect-src` to permit its CORS proxy calls and `img-src` to permit fetching the logo. Sean should draft the policy for Gerrie to approve before it is added, to avoid breaking the canvas export functionality.

---

### Finding 2: Missing Subresource Integrity on the Google Fonts stylesheet

Severity: Medium
OWASP Top 10 category: A08:2021 Software and Data Integrity Failures

Affected file: `index.html`, line 9

The file loads a stylesheet from Google Fonts without an `integrity` attribute:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
      rel="stylesheet">
```

Without SRI, if the Google Fonts CDN (Content Delivery Network) were compromised or if a network-level attacker intercepted the response, a modified stylesheet could be delivered. CSS injection can leak content via attribute selectors even without JavaScript execution. No external scripts are loaded in `index.html`, which limits the overall risk.

SRI cannot be applied to Google Fonts stylesheets in the usual way because Google dynamically generates the `@font-face` CSS based on the `User-Agent` header of the request, making a fixed `integrity` hash impractical. The correct mitigation is to self-host the DM Sans font files rather than loading them from Google Fonts. This also removes the third-party connection entirely.

How to reproduce: Inspect line 9 of `index.html`. No `integrity` attribute is present on the `<link>` element.

Recommended fix: Self-host the DM Sans font files. Download the WOFF2 files from Google Fonts, add them to the repository, and replace the Google Fonts `<link>` elements with a self-hosted `@font-face` rule in the `<style>` block. This removes the third-party dependency and makes an SRI problem moot.

---

### Finding 3: Third-party CORS proxies used to load logo in brand.html

Severity: Low
OWASP Top 10 category: A05:2021 Security Misconfiguration

Affected file: `brand.html`, lines 476 to 479

The `brand.html` file attempts to load the LLBS logo via a cascade of fallback approaches. The first two are third-party CORS proxy services operated by parties outside LLBS control: `corsproxy.io` and `api.allorigins.win`. The third fallback is the direct URL, which fails cross-origin for canvas use.

When a user opens `brand.html`, their browser sends a request that includes the full LLBS logo URL to one of those third-party services. Those services see the referrer, the user's IP address, and the fact that the user is interacting with an LLBS tool. This is a minor data-sharing concern under the United Kingdom General Data Protection Regulation (UK GDPR).

More practically: if either proxy service becomes unavailable, changes its API, starts injecting content, or is acquired by a hostile actor, the logo load fails silently and the branding strip is rendered without a logo. There is no notice to the user.

This is not a cross-site scripting (XSS) risk because the result is drawn onto a Canvas element rather than injected into the DOM.

How to reproduce: Open `brand.html`, upload a photo, and observe the network requests in developer tools. A request is made to `corsproxy.io` or `api.allorigins.win`.

Recommended fix: Host the LLBS logo in the repository alongside `brand.html` (for example at `assets/llbs-logo.webp`). Load it with a relative URL. This removes the third-party dependency, eliminates the CORS problem entirely, makes the logo available offline, and removes the data-sharing exposure. The CORS proxy array and the `loadLogoWithFallback` function can then be simplified to a single direct `loadImage` call.

---

### Finding 4: No frame-ancestors protection against clickjacking

Severity: Low
OWASP Top 10 category: A05:2021 Security Misconfiguration

Affected files: `index.html`, `brand.html`

Neither file prevents the pages from being embedded inside an `<iframe>` on a third-party site. Without a `frame-ancestors` directive in a CSP, or an `X-Frame-Options: DENY` header from the server, an attacker could embed either page inside a framed page and use UI redressing (clickjacking) to trick a visitor into interacting with the LLBS page while believing they are on the attacker's page.

For a read-only strategy document like `index.html`, the practical risk is low: there is no form or sensitive action a visitor could be tricked into completing. For `brand.html`, a user could be tricked into uploading a photo and sharing an image, though the impact is limited to reputational embarrassment rather than a data breach.

How to reproduce: Embed either page in an `<iframe>` on another page. The browser renders it without complaint.

Recommended fix: Add `frame-ancestors 'none'` to the CSP meta tag described in Finding 1. If HTTP headers become configurable in future (for example, via a `_headers` file if the project migrates to Netlify or Cloudflare Pages), add `X-Frame-Options: DENY` as well.

---

### Finding 5: Inline property assignments on Image elements used as event callbacks

Severity: Informational
OWASP Top 10 category: Not applicable

Affected file: `brand.html`, lines 580 to 581

The `loadImage` function assigns callbacks to the `onload` and `onerror` properties of an `Image` element. This is standard JavaScript and does not constitute an inline HTML event handler attribute. It is included only because the task scope asked for a check of `onerror` and similar patterns. No action is needed.

---

## What was not found

The following items were checked and are clear:

- No unsafe DOM injection methods are present in either file. The review checked for innerHTML, outerHTML, insertAdjacentHTML, the deprecated document-write API, eval, and dynamic code construction from strings.
- No inline HTML event handler attributes (onclick, onmouseover, and similar) in either file.
- No bare `http://` resource loads. All external resources use `https://`.
- No external JavaScript libraries or scripts loaded from third-party CDNs. All JavaScript is inline within script blocks.
- No links with `target="_blank"` lacking `rel="noopener noreferrer"`. There are no `target="_blank"` links at all.
- No user-supplied data is written into the DOM. In `brand.html`, user input is rendered onto a Canvas element only.
- No hardcoded credentials, API keys, or tokens in either file.

---

## Questions for Tim (via Sonja)

None. The findings are clear enough to proceed without a decision from Tim.

---

## Handoff note to Sonja

Two medium findings require development work before the project is considered clean:

1. Finding 1 (missing CSP) needs a policy drafted and added. Sean should draft it; Gerrie should review and approve the policy before it is committed.
2. Finding 2 (Google Fonts SRI) is best resolved by self-hosting the font, which Sean can do alongside the Finding 1 work.

Finding 3 (CORS proxies) is low effort: Sean can add the logo file to the repository and update the JavaScript to use a relative path.

Finding 4 (frame-ancestors) is resolved automatically when Finding 1 is addressed, provided `frame-ancestors 'none'` is included in the CSP.

No findings block a first release of the site as-is. This is a read-only strategy document with no authentication, no personal data collected, and no forms. The medium findings should be tracked and addressed in the next development sprint.
