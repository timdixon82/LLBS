# ADR 005: Dependency posture and removing the public CORS proxies

## Status

Accepted. Recorded by Jacob (architect) on 2026-05-21 during work 005-llbs-setup. Tim confirmed the self-hosting decision on 2026-05-21 (answer 4 in the consolidated question batch) and instructed that self-hosting fonts and logos should be the team's standing assumption for future projects. This cross-cutting decision is also recorded as global Decision Record 006 in the team wiki.

## Context

The team's static front-end stack standard requires keeping dependencies few and loading third-party scripts only when genuinely needed, pinned with Subresource Integrity (SRI).

### What `index.html` depends on

`index.html` has no third-party JavaScript library. All behaviour is the project's own code. It has two external resources:

- Web fonts from Google Fonts: two `<link rel="preconnect">` tags and a `<link rel="stylesheet">` pulling in the DM Sans typeface from `fonts.googleapis.com` and `fonts.gstatic.com`.
- The LLBS logo image, loaded from `https://www.llbs.co.uk/wp-content/uploads/2023/05/LLBS-logo-with-text.png`, an external WordPress site.

### What `brand.html` depends on

`brand.html` also has no third-party JavaScript library. However, its external-resource posture is the highest-priority concern in this review:

- The LLBS logo is loaded from a different external WordPress origin: `https://bd.llbs.co.uk/wp-content/uploads/2024/02/LLBS-logo-with-text-300x83-1.webp`.
- The application needs cross-origin pixel access to that logo, because it draws the logo onto a canvas and then exports the canvas as an image. A canvas tainted by a cross-origin image cannot be exported.
- To get clean cross-origin access, the code uses a list of public CORS proxy services: first `corsproxy.io`, then `api.allorigins.win`, then a direct URL fallback.

Public CORS proxies are an architectural and security concern:

- They are uncontrolled third-party dependencies the project does not own, does not pay for, and cannot rely on. Either can change behaviour, rate-limit the project, start charging, or disappear.
- They cannot be pinned with SRI, because a proxy response is generated per request and has no fixed hash.
- They are a supply-chain weak point. A compromised or malicious proxy could return a different image.
- Both external WordPress origins and Google Fonts disclose visitor IP addresses on every page load, which is a UK GDPR (General Data Protection Regulation) concern. Neither the proxies nor Google are named in any privacy notice for the site.

## Decision

### `index.html`: self-host the fonts and the logo

`index.html` must self-host the DM Sans web font and the LLBS logo:

- Download the DM Sans WOFF2 font files, confirm the licence (DM Sans is published under the SIL Open Font License, which permits self-hosting and redistribution), commit them to `assets/fonts/`, and reference them from `css/strategy.css` with `@font-face` rules.
- Download the LLBS logo and commit it to `assets/`, referenced with a relative path.

Self-hosting removes the runtime dependency on Google and on the LLBS WordPress server, removes the disclosure of visitor IP addresses to third parties, and reduces the CSP to `'self'` for `style-src`, `font-src`, and `img-src`.

### `brand.html`: remove the CORS proxies by self-hosting the logo

This is the priority recommendation of this record. `brand.html` must stop using public CORS proxies entirely.

The way to achieve this is to commit the LLBS logo to the repository as a project asset and load it with a relative URL from the same origin as the page. An image loaded same-origin is not a cross-origin resource. It does not taint the canvas, needs no `crossorigin` attribute, no cross-origin headers, and no proxy. The entire `CORS_PROXIES` list, the `loadLogoWithFallback` function, and the proxy fallback logic can then be deleted. The application becomes simpler, more reliable, and free of an uncontrolled third-party dependency. The CSP `connect-src` reduces to `'self'`.

This removes code rather than adding it, consistent with the team's principles of preferring the simple solution and leaving no dead code.

### Standard for any future dependency

If either page ever adds a third-party script or stylesheet:

- Add it only when the need is genuine and the project's own code cannot reasonably do the job.
- Prefer a self-hosted copy committed to the repository over a copy loaded from a third-party origin.
- If a resource must be loaded from a third-party origin, pin it with SRI and a `crossorigin` attribute, pinning a specific version, never a floating one.
- Record every third-party dependency in this record so the project keeps an inventory.

The project has no package manifest, so Dependabot has nothing to track. Keeping the dependency inventory in this record is the substitute for an automated dependency list.

### Current dependency inventory

At adoption date (2026-05-21), the project has these third-party dependencies pending self-hosting:

| Dependency | Page | Type | Self-host work |
| --- | --- | --- | --- |
| Google Fonts (DM Sans) | `index.html` | Font stylesheet and WOFF2 files | Download and commit to `assets/fonts/` |
| LLBS logo (www.llbs.co.uk) | `index.html` | Image | Download and commit to `assets/` |
| LLBS logo (bd.llbs.co.uk) | `brand.html` | Image via CORS proxies | Download and commit to `assets/`; delete proxy code |

Once self-hosting work is complete, the project has zero third-party dependencies on both pages.

## Alternatives considered

**Keep loading the logo from the LLBS WordPress sites and keep the proxies.** Rejected. It leaves `brand.html` depending on two public proxy services the project does not control and cannot integrity-check. Self-hosting the logo removes all of that at a small one-time cost.

**Keep the remote logo but replace the public proxies with a project-owned proxy.** Rejected as disproportionate. A project-controlled serverless proxy would be more trustworthy than a public one, but it adds a server-side component to a project that is otherwise purely static with no server. That contradicts ADR 003.

**Set the logo `crossorigin` attribute and rely on the WordPress site sending cross-origin headers.** Rejected as not reliable and not the project's to control. The cross-origin headers would have to be sent by the LLBS WordPress site, which the project does not configure.

**Drop DM Sans and use system fonts.** Considered. Using a system-font stack would remove the font dependency entirely. Not chosen because DM Sans is the LLBS brand typeface, named as such in `CHANGELOG.md` and matching the main LLBS website. Self-hosting keeps the brand typeface while removing the dependency.

## Consequences

- A follow-up piece of work self-hosts the DM Sans font and both LLBS logo images. It also deletes the `CORS_PROXIES` list and `loadLogoWithFallback` function from `brand.html`.
- Once the logo is self-hosted in `brand.html`, `connect-src` in the CSP reduces to `'self'`.
- Once fonts and logo are self-hosted in `index.html`, `style-src`, `font-src`, and `img-src` reduce to `'self'`.
- Until the self-hosting work is done, the project has documented third-party dependencies listed above in the inventory. The CORS proxy dependency is the highest-priority item to remove.
- The project keeps zero third-party JavaScript libraries on both pages. Any future dependency follows the standard above and is added to the inventory in this record.
- Tim's answer 4 instructed that self-hosting fonts and logos should always be the team assumption for future projects. Sonja recorded this as cross-cutting global Decision Record 006.
