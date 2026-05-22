# LLBS Project Wiki: Glossary

This glossary defines terms specific to the LLBS project. General team terms are in the global wiki glossary at `docs/glossary.md` in the team repository.

## Domain terms

**LLBS**
Lincoln and Lindsey Blind Society. The charitable organisation that owns this repository and for whom the strategy page and photo brander were created.

**Living Well Together Strategy**
The LLBS five-year organisational strategy for 2025 to 2030. It is the subject of `index.html` and of the PDF in the repository root.

**JHWS**
Lincolnshire Joint Health and Wellbeing Strategy. The statutory strategy produced by Lincolnshire County Council and health commissioners. The LLBS strategy is aligned to it. Expanded on first use in `index.html`.

**RNIB**
Royal National Institute of Blind People. Referenced in the strategy page statistics (projected figures for vision impairment by 2032). Requires expansion on first use per WCAG 2.2 criterion 3.1.4 Abbreviations.

**SWOT**
Strengths, Weaknesses, Opportunities, Threats. The analysis framework used in the strategy's Summary Analysis section. The `index.html` aria-label already expands the acronym; the visible heading avoids the term.

**Greater Lincolnshire**
The area served by LLBS, encompassing Lincolnshire county and the North and North East Lincolnshire unitary authorities.

## Technical terms

**Photo Brander**
The informal name for the `brand.html` tool. Its full title is "LLBS Photo Brander". Staff and volunteers use it to compose branded social media images in a browser without specialist software.

**CORS**
Cross-Origin Resource Sharing. A browser security mechanism that restricts which origins a web page may request resources from. Relevant to `brand.html`, which previously used third-party CORS proxy services to load the LLBS logo onto an HTML canvas. Self-hosting the logo removes the CORS issue.

**CORS proxy**
A third-party relay service that fetches a resource from one origin and returns it with permissive cross-origin headers. `brand.html` previously used `corsproxy.io` and `allorigins.win` as fallback CORS proxies. Self-hosting the logo removes the need for them.

**Canvas API**
The browser interface (`HTMLCanvasElement` and `CanvasRenderingContext2D`) used by `brand.html` to composite photos, the LLBS logo, and overlay text into a single image for download or sharing.

**CSP**
Content Security Policy. A browser security mechanism, delivered as an HTTP response header or a `<meta http-equiv="Content-Security-Policy">` tag, that restricts which scripts, styles, and resources a page may load. GitHub Pages cannot send custom response headers, so the policy is delivered by meta tag.

**SRI**
Subresource Integrity. An attribute on `<link>` and `<script>` elements that lets the browser verify a resource has not been tampered with, by comparing a hash in the attribute against the fetched content. Cannot be used on dynamically-generated resources such as the Google Fonts stylesheet.

**Web Share API**
A browser interface that invokes the device's native share sheet. Used by `brand.html` to let users share the composed image on browsers that support it.

**DM Sans**
The typeface specified in the LLBS brand. Used in `index.html` for all text, and available as a font option in `brand.html`. It is currently loaded from Google Fonts; the team decision is to self-host it.

**tint-80, tint-86, tint-92**
Internal colour names used in the `index.html` stylesheet to denote lightened variants of the primary teal-blue `#156082`. The shorthand refers to the percentage of the original hue retained. Tint-80 (`#44809B`) is the Transport theme label background and was the only colour failing AA contrast in the baseline audit.

**primary teal-blue**
The LLBS primary brand colour, `#156082`. Used throughout `index.html` for headings, buttons, and theme labels.

**primary-dark**
The LLBS dark navy colour, `#042433`. Used as the hero section background and for high-contrast text.

## Acronyms used in the code

**ADR**
Architecture Decision Record. A short document that records a significant architectural choice, its context, the decision made, the alternatives considered, and the consequences. Five ADRs are recorded in `docs/decisions/`.

**UK GDPR**
United Kingdom General Data Protection Regulation. The data protection law that applies to this project. Neither page collects personal data directly, but both previously made third-party requests that disclosed visitor IP addresses.

**OWASP**
Open Web Application Security Project. The organisation that publishes the OWASP Top 10, a list of the most critical web application security risks. The team maps its security baseline to the OWASP Top 10 (2021 edition).

**WCAG**
Web Content Accessibility Guidelines. The international standard for web accessibility, published by the World Wide Web Consortium (W3C). The team's target is WCAG 2.2 at AAA conformance.

**ARIA**
Accessible Rich Internet Applications. A W3C specification for adding semantic information to HTML elements so that assistive technologies can interpret them. Used in `index.html` for the tab widget and navigation toggle.
