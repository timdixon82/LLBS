# Exception SEC-LLBS-001: Missing HTTP security headers on GitHub Pages

## Summary

GitHub Pages does not allow site owners to set custom HTTP response headers. The LLBS site therefore cannot serve X-Frame-Options, Permissions-Policy, or a `frame-ancestors` Content Security Policy (CSP) directive as real response headers. This exception documents and approves that gap, on the basis that the site is a public information site with no authenticated content, no forms, and no cookies, and the residual risk is low.

## Details

| Field | Value |
| --- | --- |
| Exception identifier | SEC-LLBS-001 |
| Category | Security: OWASP A05:2021 Security Misconfiguration |
| Date raised | 2026-05-21 |
| Raised by | Gerrie (security governance) and Jed (code review) independently, during backfill reviews |
| Approved by | Tim Dixon |
| Approval date | 2026-05-21 (answer 5 in the consolidated question batch) |
| Review date | 2027-05-21, or when the site gains any authenticated content |

## What this exception covers

GitHub Pages sends the following headers automatically when "Enforce HTTPS" is on:

- `Strict-Transport-Security`: sent by GitHub Pages. In place.
- `X-Content-Type-Options: nosniff`: sent by GitHub Pages by default. In place.

The headers that cannot be set on GitHub Pages are:

- `X-Frame-Options`: cannot be sent. Prevents clickjacking by blocking the page from being embedded in a frame on a third-party site.
- `Permissions-Policy`: cannot be sent. Restricts which browser features a page may use.
- `Content-Security-Policy` frame-ancestors directive: the `frame-ancestors` directive cannot be carried by a `<meta>` tag CSP; it requires a real HTTP header.

The team mitigates by delivering the CSP and Referrer-Policy through `<meta>` tags, per ADR 004. The meta-tag approach covers all CSP directives except `frame-ancestors`, `report-uri`, `report-to`, and the sandbox directive.

## Separate assessment for brand.html

`index.html` and `brand.html` have different risk profiles for the missing headers.

For `index.html`: the brochure page has no login, no form that posts anywhere, no personal data, and no cookies. The realistic harm from missing X-Frame-Options on a page like this is low. A clickjacking attack against a read-only strategy document has no obvious goal: there is nothing a visitor could be tricked into submitting or authorising.

For `brand.html`: this page does more. It is still low risk for clickjacking, because it has no login and no server-side action. All processing is in the browser. However, `brand.html` does invite a user to upload a personal photo. A clickjacking attack could in theory trick a user into uploading a photo while believing they are on a different site. Gerrie assessed this risk and concluded it is acceptable given that the photo never leaves the user's device and no data is sent to any server. The harm from such an attack would be negligible: no data is captured, no credentials are stolen. The exception is approved for `brand.html` on this basis. If `brand.html` ever gains a server-side action, a form submission, or authentication, this assessment must be revisited.

## Residual risk

The residual risk is low for both pages. The specific gaps are:

- Clickjacking: both pages can be embedded in a third-party frame. For `index.html` there is no meaningful target. For `brand.html` the impact of a successful clickjacking attack is limited to the user unknowingly uploading a photo that never leaves their device.
- Browser-feature lock-down: without Permissions-Policy, the browser does not restrict which device APIs the page may request. Neither page currently requests any device API (camera, microphone, geolocation). The gap is theoretical.

## Mitigation in place

- The CSP meta tag on each page restricts script and style sources, limiting injection vectors.
- The Referrer-Policy meta tag limits referrer data sent on outbound links.
- Both pages are served over HTTPS enforced by GitHub Pages.
- Neither page has authentication, cookies, forms, or server-side actions.

## Conditions

This exception is valid while:

- The site is hosted on GitHub Pages with no CDN or edge layer that could inject custom headers.
- Neither page has authentication, forms that post to a server, or cookies.
- "Enforce HTTPS" remains on for the repository. The team's hard deny-list forbids disabling repository security settings, so this condition is permanently met.
- The exception is reviewed by the date above.

If the site moves to a host that can send custom headers (such as Netlify or Cloudflare Pages), this exception should be closed and the full header set should be applied.

## Related

- Gerrie's security review, finding A05-01, in `.claude/work/005-llbs-setup/gerrie-security-review.md`.
- Jed's code review, finding 1 and finding 4.
- ADR 004 (`docs/decisions/004-github-pages-security-headers.md`) for the meta-tag CSP approach.
