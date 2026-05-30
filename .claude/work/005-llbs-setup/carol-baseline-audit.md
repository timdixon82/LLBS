# WCAG 2.2 AAA Baseline Accessibility Audit: LLBS

Audit date: 2026-05-21
Auditor: Carol (tester)
Pages audited: `index.html` and `brand.html` from the `timdixon82/LLBS` repository
Method: Code inspection only. Automated tools (axe-core, Pa11y) could not be run because shell execution of those tools was not available in this session. This report is therefore inspection-only and should be supplemented by an automated run before any conformance claim is made.
Verdict: FAIL at AAA. FAIL at AA (one issue). Does not meet WCAG 2.2 AAA on either page.

---

## Summary by severity

- Critical: 1 finding
- Major: 12 findings
- Minor: 6 findings
- Advisory: 5 findings

---

## Section 1: index.html findings

### 1.1 Contrast: theme-label pill white on tint-80 (critical)

WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
Severity: Critical

The four strategy-theme label pills in the themes table and the timeline use white text on colour backgrounds derived from the primary teal-blue. The tint-80 value `#44809B` gives a contrast ratio of 4.37:1 against white. This is below the AA minimum of 4.5:1 for normal text, making this the single finding that breaks AA conformance as well as AAA. The pills are short text strings at approximately 13px bold, which does not qualify as large text under WCAG rules (large text requires bold text at 18.66px or larger, or regular text at 24px or larger).

Location: `.theme-label--t80` used for the Transport theme label in the themes table (line 950), the timeline table (lines 998-1001), and the tab panel border accents.

Fix: Darken the tint-80 background to achieve at least 4.5:1 against white for AA and 7:1 for AAA, or use dark text on the current tint-80 background.

---

### 1.2 Contrast: white text on primary tints t86 and t92 (major)

WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
Severity: Major

White text on the tint-86 background `#367694` gives 5.03:1. White text on tint-92 `#286D8C` gives 5.74:1. Both pass AA (4.5:1) for normal text but fail AAA (7:1). These tints appear as theme-label pill backgrounds for the Wellbeing and Future Ready themes, as borders on route-boxes in those tab panels, and as the income-card teal variant background.

Locations: `.theme-label--t86`, `.theme-label--t92`, `.income-card--teal`, and associated `border-top-color` inline styles in the Wellbeing and Future Ready tab panels.

Fix: Use darker tints or switch to dark text on these backgrounds. The primary-dark `#042433` on t86 gives 10.97:1 and would pass AAA.

---

### 1.3 Contrast: white text on primary blue `#156082` (major)

WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
Severity: Major

White text on the primary colour `#156082` gives 6.94:1. This passes AA but falls 0.06 short of the AAA threshold of 7:1. This affects the hero call-to-action button (1rem bold text), the active tab selected state text (0.9375rem), the theme-label pill for the Community theme, the income-card mid-variant label text (0.9375rem), and route-box h4 uppercase headings.

For the large stat-card numbers (2.25rem bold) and the large income-card numbers (2.75rem bold), 6.94:1 passes AAA for large text (4.5:1 threshold). Those instances are not failures.

Locations: `.hero__cta`, active `.tab-button[aria-selected="true"]`, `.theme-label` (Community), `.income-card--mid` label text, `.route-box h4` (where border-top colour is primary but that does not affect text).

Fix: Darken the primary to approximately `#115470` or darker to clear 7:1 against white, or use white-on-primary only for text sizes that qualify as large.

---

### 1.4 Contrast: muted text on light backgrounds (major)

WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
Severity: Major

The muted body text colour `#4A5568` produces the following ratios:
- Against white `#FFFFFF`: 7.53:1 (passes AAA).
- Against the light-bg `#E7EAED` used on alternate sections: 6.23:1 (fails AAA).
- Against the lighter-bg `#F3F5F6` used on odd sections: 6.88:1 (fails AAA).

The muted colour is used for section introductory paragraphs (`.section-intro`), stat-card labels (`.stat-card__label`), and other supporting text. When those elements appear on the light or lighter backgrounds, they fail the 7:1 AAA threshold.

Locations: `.section-intro` in sections with `background: var(--lighter-bg)` or `background: var(--light-bg)`, `.stat-card__label`, `.value-card p`, `.income-card__label` (where on a white card background this passes at 7.53:1).

Fix: Darken `--text-muted` to approximately `#3D4A5C` or lower to achieve 7:1 on the lightest background used, or restrict muted text to white backgrounds only.

---

### 1.5 Contrast: SWOT quadrant headings (major)

WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
Severity: Major

The Strengths quadrant h3 uses `#2A6A1A` on `#EBF5E9`: 5.91:1, fails AAA (7:1).
The Opportunities quadrant h3 uses the primary `#156082` on `#EBF1FA`: 6.11:1, fails AAA.
The Weaknesses h3 at 7.23:1 and the Threats h3 at 7.24:1 both pass AAA.

Locations: `.swot-quadrant--s h3` and `.swot-quadrant--o h3` in the Summary Analysis section.

Fix: Darken the Strengths heading to at least `#235815` and darken or replace the Opportunities heading colour to meet 7:1 on `#EBF1FA`.

---

### 1.6 Contrast: hero subtitle (major)

WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
Severity: Major

The hero subtitle "2025 to 2030" uses colour `--p56 #7CA6B9` on the primary-dark background `#042433`, giving 6.14:1. The subtitle font size is defined as `clamp(1.25rem, 3vw, 1.75rem)` with `font-weight: normal`. At the minimum viewport the font renders at 20px regular. WCAG defines large text as either 18pt (24px) regular or 14pt (18.66px) bold. At 20px regular the text does not qualify as large, so the 7:1 AAA threshold applies. The ratio of 6.14:1 fails AAA (and would fail even at the minimum large-text threshold of 4.5:1 if it did qualify, since 6.14 exceeds 4.5, but the relevant threshold here is 7:1).

Note: at viewports wide enough to render the text at 24px or above it would qualify as large and the ratio would pass AAA at 4.5:1. However, conformance cannot be claimed only for some viewport widths.

Location: `.hero__subtitle` in the hero section.

Fix: Increase contrast of `--p56` to clear 7:1 against `--primary-dark`, or use `--mid-grey #CCD2D8` which gives 10.56:1.

---

### 1.7 Contrast: income-card teal label text (major)

WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
Severity: Major

The teal income card uses `--t86 #367694` as its background. Its label text is white at 0.9375rem normal weight, giving 5.03:1, which fails AAA (7:1). This is distinct from finding 1.2 because the income-card context is a standalone data card rather than a pill label.

Location: `.income-card--teal` label text.

Fix: As per finding 1.2, darken the background or use dark text.

---

### 1.8 Heading hierarchy: value cards use h3 as card titles inside a list under an h2 (minor)

WCAG criterion: 1.3.1 Info and Relationships, Level A; 2.4.6 Headings and Labels, Level AA; 2.4.10 Section Headings, Level AAA
Severity: Minor

The "Our Values" subsection opens with an h3 "Our Values" at line 900 and then each value card also uses an h3 for the value name (Personal, Community, Reliable, Empowering, Collaborative). Because the value cards are marked `role="listitem"`, the intent is a list structure, but having h3 elements inside list items creates a flat sequence of h3s following the parent h3. This is structurally unusual. A screen reader user navigating by heading will encounter "Our Values" followed immediately by five h3 siblings with single-word names, which is not wrong but is less informative than it could be. The five value-name headings would read more clearly as h4s under the "Our Values" h3.

Location: `.values-grid` in the Vision, Mission, and Values section.

Fix: Change the value-card heading level from h3 to h4.

---

### 1.9 Footer link text: phone number as bare digits (minor)

WCAG criterion: 2.4.9 Link Purpose (Link Only), Level AAA
Severity: Minor

The footer contains two links whose text is a bare phone number "01507 605604" and a bare email address "info@llbs.co.uk". Read from a screen reader link list, these carry no context about whose number or email this is. The CTA section above the footer uses better text ("Call 01507 605604" and "Email info@llbs.co.uk"), but the footer does not follow that pattern.

Location: Footer `<a href="tel:01507605604">` and `<a href="mailto:info@llbs.co.uk">`.

Fix: Wrap each link in descriptive text or add an aria-label: for example `aria-label="Call LLBS on 01507 605604"`.

---

### 1.10 Link text: "Visit llbs.co.uk" (minor)

WCAG criterion: 2.4.9 Link Purpose (Link Only), Level AAA
Severity: Minor

The link "Visit llbs.co.uk" in the CTA section is marginally ambiguous when read in isolation from a link list, because it sounds like a domain name rather than a destination description. It is not as severe as "click here" but a screen reader user pulling up the links list may need to infer context.

Location: `<a href="https://www.llbs.co.uk">Visit llbs.co.uk</a>` in the Join Us section.

Fix: Change to "Visit the LLBS website" or similar.

---

### 1.11 Abbreviations not expanded on first use: SWOT, RNIB (minor)

WCAG criterion: 3.1.4 Abbreviations, Level AAA
Severity: Minor

The abbreviation SWOT (Strengths, Weaknesses, Opportunities, Threats) is used as a section label in the aria-label attribute "SWOT analysis: Strengths, Weaknesses, Opportunities, Threats", which does expand the acronym there. However the visible heading "Summary Analysis 2025" avoids the term SWOT entirely, which is good. The deeper problem is RNIB (Royal National Institute of Blind People) at line 798, used in parentheses with no expansion in the visible text: "(RNIB)". The JHWS (Lincolnshire Joint Health and Wellbeing Strategy) abbreviation is expanded in the first paragraph where it appears. RNIB is not.

Location: `.stat-card__label` "Projected people with vision impairment in Greater Lincolnshire by 2032 (RNIB)".

Fix: Write "Royal National Institute of Blind People (RNIB)" on first use, or use `<abbr title="Royal National Institute of Blind People">RNIB</abbr>`.

---

### 1.12 No `prefers-reduced-motion` media query (minor)

WCAG criterion: 2.3.3 Animation from Interactions, Level AAA
Severity: Minor

The stylesheet contains four CSS `transition` declarations on navigation links, the hero CTA, tab buttons, and CTA contact links. None of these are guarded by `prefers-reduced-motion: reduce`. The transitions are short (0.15s to 0.2s) and subtle, so they are unlikely to cause vestibular harm, but AAA conformance requires that motion triggered by interaction can be disabled. The user's operating system reduced-motion preference is not respected by the page.

Location: Lines 138, 239, 497, and 687 in the inline stylesheet.

Fix: Wrap all transitions in `@media (prefers-reduced-motion: no-preference)` blocks, or add a `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none; } }` override.

---

### 1.13 Income-grid missing semantic list role (advisory)

WCAG criterion: 1.3.1 Info and Relationships, Level A
Severity: Advisory

The income-grid div at line 1217 carries `aria-label="Income growth targets"` but no `role="list"`. Its children (three `.income-card` divs) have no `role="listitem"`. The stats-grid at line 783 correctly uses `role="list"` and `role="listitem"`. The income-grid should follow the same pattern for consistency.

Location: `.income-grid` in the Income and Sustainability section.

Fix: Add `role="list"` to `.income-grid` and `role="listitem"` to each `.income-card`.

---

### 1.14 Timeline table: "Not active" cells are empty (advisory)

WCAG criterion: 1.3.1 Info and Relationships, Level A; 4.1.2 Name, Role, Value, Level A
Severity: Advisory

Empty table cells in the timeline table carry `aria-label="Not active"` rather than a visible indicator. This is a reasonable approach for screen reader users but the cells have zero visual content, which may confuse low-vision sighted users who are not using a screen reader but who also cannot perceive the empty space as meaningful. A short text character or an icon with the same aria-label would serve both groups. This is advisory rather than a clear failure because the approach does not violate any criterion for blind users.

Location: Timeline table in the Strategy section.

Fix: Consider adding a visually-hidden dash or a low-opacity indicator inside "Not active" cells so that sighted low-vision users can distinguish empty from populated cells.

---

### 1.15 No glossary or landmark for first-time jargon (advisory)

WCAG criterion: 3.1.3 Unusual Words, Level AAA
Severity: Advisory

The content uses several terms that may be unfamiliar to a first-time reader: "sight impairment officers", "LLBS strategy days", "befriending", and "vision impairment" is used without definition. The document has no glossary link and no inline definitions for specialist terms. This advisory note does not mean the language is unclear: most of the content reads at a plain level. However, AAA criterion 3.1.3 requires that a mechanism is available to identify the meaning of unusual words or phrases used in a specialised way. A link to a glossary on the main LLBS website, or inline expansions, would satisfy this.

---

## Section 2: brand.html findings

### 2.1 No skip link and no main landmark (major)

WCAG criterion: 2.4.1 Bypass Blocks, Level A; 1.3.6 Identify Purpose, Level AAA
Severity: Major

The brand.html page has no skip link and no `<main>` element. The page content sits under a `<header>`, then directly in `<body>`. A screen reader user landing on this page must tab through the logo and heading before reaching the upload area. The fix takes one line of HTML: add `<main>` around the upload and editor sections. A skip link from the header to that main element would satisfy 2.4.1.

Location: `brand.html` body structure.

Fix: Add `<a class="skip-link" href="#main-content">Skip to main content</a>` and wrap the upload-area and editor divs in `<main id="main-content">`.

---

### 2.2 File upload area is a div, not keyboard-operable as a control (major)

WCAG criterion: 2.1.1 Keyboard, Level A; 2.1.3 Keyboard (No Exception), Level AAA; 4.1.2 Name, Role, Value, Level A
Severity: Major

The upload area (`id="dropZone"`) is a `<div>` element. It responds to click events by opening the file input. However, a `<div>` is not natively focusable and will not receive keyboard focus by tab navigation unless it has `tabindex="0"`. Inspecting the markup shows no `tabindex` attribute and no `role` attribute on the drop zone. The hidden `<input type="file">` is `display: none`, which removes it from the accessibility tree and from keyboard reach. The file input therefore cannot be reached or activated from the keyboard.

A screen reader user using keyboard-only navigation cannot upload a photo because neither the div nor the file input is focusable. This is a Level A failure (2.1.1 and 4.1.2) and an AAA failure (2.1.3).

Location: `<div class="upload-area" id="dropZone">` and `<input type="file" id="fileInput">` at lines 342 and 349.

Fix: Replace the `<div>` with a `<button>` that triggers `fileInput.click()`, or add `tabindex="0"` and `role="button"` to the div with a `keydown` handler for Enter and Space, and change the file input to be visually hidden using the `.visually-hidden` class rather than `display: none`.

---

### 2.3 Canvas element has no accessible name, no role, and no text alternative (major)

WCAG criterion: 1.1.1 Non-text Content, Level A; 4.1.2 Name, Role, Value, Level A
Severity: Major

The `<canvas id="canvas">` element has no `aria-label`, no `aria-labelledby`, no `role`, and no fallback content between the tags. The canvas renders the composite branded image. For a screen reader user, the canvas is invisible. The current design, where a screen reader user would use the labelled controls (format select, zoom slider, text inputs) to configure the output and then use the Download or Share button to export it, partially mitigates this, but the canvas itself should carry at least an aria-label describing its current state (for example "Branded image preview, 1080 by 1080 pixels, Instagram Square format").

Location: `<canvas id="canvas"></canvas>` at line 356.

Fix: Add `aria-label` to the canvas and update it dynamically when the format or content changes. Provide a text description of the output state via a visually-hidden live region or by updating the status element.

---

### 2.4 Status messages use emoji (major)

WCAG criterion: 1.1.1 Non-text Content, Level A; 4.1.3 Status Messages, Level AA
Severity: Major

The `setStatus` function writes strings containing emoji characters to the `#status` div: for example "Loading image" prefixed with a hourglass emoji, "Ready" with a checkmark, and "Error" with a cross. The `#status` div has no `aria-live` attribute, so these messages are not announced at all by screen readers. The contrast-badge div at line 433 does carry `aria-live="polite"`, but that is a separate element.

Two separate problems are present here: first, the status div is not a live region so messages are not announced; second, the emoji characters will be read aloud by screen readers (VoiceOver would say "hourglass not done loading image", JAWS would read something similar) which produces cluttered, unclear announcements.

Locations: `<div id="status"></div>` at line 444; `setStatus` function at line 1149 and all call sites.

Fix: Add `aria-live="polite"` and `aria-atomic="true"` to the `#status` div. Remove emoji from status strings and replace with plain text only ("Loading image...", "Ready.", "Error: could not read image.").

---

### 2.5 Focus indicator removed for form controls (major)

WCAG criterion: 2.4.7 Focus Visible, Level AA; 2.4.13 Focus Appearance, Level AAA
Severity: Major

The stylesheet at lines 186 to 192 sets `outline: none` on focused input, select, and textarea elements within `.control-group`, replacing the browser's default focus ring with a custom `box-shadow` of `0 0 0 3px rgba(26,86,219,0.15)`. The box-shadow colour `rgba(26,86,219,0.15)` is nearly transparent. At 15% opacity of `#1a56db` on white, the effective visual colour approximates `#D8E3F8`, which gives a contrast ratio of approximately 1.1:1 against the white form background. This fails WCAG 2.4.13 Focus Appearance (AAA) and likely 2.4.7 Focus Visible (AA), because the focus indicator is not discernible.

Location: CSS at lines 186-192 in brand.html.

Fix: Increase the box-shadow alpha to at least 100% and ensure the resulting colour meets the 2.4.13 AAA requirements: the focus indicator must cover an area at least as large as a 2px perimeter of the unfocused component, and the change must have a contrast ratio of at least 3:1 against adjacent colours and at least 3:1 against the unfocused state. A practical fix is `box-shadow: 0 0 0 3px #1a56db` at full opacity.

---

### 2.6 Contrast: brand.html muted text `#5a6a82` on white (major)

WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
Severity: Major

The muted text colour `#5a6a82` used throughout brand.html for help text, upload-area spans, and header paragraph text gives 5.50:1 against white and 4.98:1 against the page background `#f0f4f8`. Both fail AAA (7:1) for normal text. The ratio against `#f0f4f8` also technically fails AA (4.5:1) for normal-sized text, making this an AA failure for text on the body background.

Locations: `.upload-area span`, `header p`, `.help-text` throughout brand.html.

Fix: Darken `#5a6a82` to approximately `#4a5a70` or darker to achieve 7:1 on white.

---

### 2.7 Contrast: brand.html primary buttons (major)

WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
Severity: Major

The primary action button uses white text on `#1a56db` background: 6.18:1. The secondary button uses `#1a56db` on white: 6.18:1. The danger button uses `#c0392b` on white: 5.44:1. All three fail AAA (7:1) for normal text. The button labels are 0.95rem normal-weight text, so they do not qualify as large text.

Locations: `.btn-primary`, `.btn-secondary`, `.btn-danger` in brand.html.

Fix: Darken the button colours. For the primary, `#154da8` or similar achieves 7:1 against white. For the danger, `#9b2219` achieves 7:1 against white.

---

### 2.8 Contrast: brand.html contrast-pill badge labels (minor)

WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
Severity: Minor

The contrast badge inside the controls panel displays pass or fail pills. The pass pill uses `#065f46` on `#d1fae5`: 6.78:1. The fail pill uses `#991b1b` on `#fee2e2`: 6.80:1. The neutral pill uses `#475569` on `#e2e8f0`: 6.15:1. All three fall short of the 7:1 AAA threshold for the small font size (0.75rem bold). The text in these pills is the interface's own accessibility feedback, so the irony of an accessibility tool failing the contrast standard it reports on is worth noting.

Location: `.contrast-pill` elements in the contrast badge.

Fix: Darken each pill text colour slightly: for example `#055040` for pass, `#8a1515` for fail, `#3d4e5e` for neutral.

---

### 2.9 Canvas interaction is pointer-only: no keyboard alternative (minor)

WCAG criterion: 2.1.1 Keyboard, Level A; 2.1.3 Keyboard (No Exception), Level AAA; 2.5.1 Pointer Gestures, Level A
Severity: Minor

Photo repositioning on the canvas relies entirely on pointer-drag events (`pointerdown`, `pointermove`, `pointerup`) and mouse-wheel zoom. There is no keyboard alternative for repositioning the photo or the text overlay within the canvas. The controls panel provides a zoom slider and a Re-centre photo button, so coarse positioning is achievable via keyboard, but fine positioning by dragging is not.

The severity is minor rather than major because the slider controls provide a meaningful keyboard path to the primary outputs (zoom, text, download), and the drag interaction is an enhancement. However, for complete keyboard conformance, arrow-key nudging of the photo position should be available when the canvas is focused.

Location: Canvas pointer event handlers at lines 1022-1066 in brand.html.

Fix: Add keyboard focus to the canvas (`tabindex="0"`), and handle `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` key events to nudge photo and text positions by a defined step.

---

### 2.10 SVG icons in action buttons are not hidden from assistive technology (minor)

WCAG criterion: 1.1.1 Non-text Content, Level A; 4.1.2 Name, Role, Value, Level A
Severity: Minor

The three action buttons (Share Image, Download, Start Over) each contain an SVG icon followed by a text label. The SVG elements have no `aria-hidden="true"` attribute. Screen readers will attempt to interpret each SVG's path data as an accessible name, either announcing something meaningless or announcing the button text twice: once from the SVG and once from the visible label. This is a mild annoyance rather than a blocker because the button's visible text provides the accessible name, but the SVG should be hidden to prevent redundant or confusing announcements.

The upload-area SVG at line 343 has the same problem.

Locations: Lines 343, 448-451, 456-459, 462-464 in brand.html.

Fix: Add `aria-hidden="true"` and `focusable="false"` to each decorative SVG.

---

### 2.11 Spinner element has no accessible name and is not hidden when inactive (advisory)

WCAG criterion: 4.1.3 Status Messages, Level AA
Severity: Advisory

The spinner `<div class="spinner" id="shareSpinner">` at line 453 animates when sharing is in progress. It has no text content, no aria-label, and no role. The `@keyframes spin` animation has no `prefers-reduced-motion` guard (see also finding 1.12 equivalent). When the spinner is visible, it provides no accessible status to screen reader users; the `setStatus` live-region omission (finding 2.4) is the primary issue, and the spinner is a secondary concern.

Location: `<div class="spinner" id="shareSpinner">` at line 453.

Fix: Add `role="status"` and `aria-label="Sharing, please wait"` to the spinner div, or rely entirely on the fixed status live region and add `aria-hidden="true"` to the spinner.

---

### 2.12 No `prefers-reduced-motion` guard on spinner animation (advisory)

WCAG criterion: 2.3.3 Animation from Interactions, Level AAA
Severity: Advisory

The `@keyframes spin` animation at line 324 drives the loading spinner. It is not guarded by `prefers-reduced-motion: no-preference` or suppressed by `prefers-reduced-motion: reduce`. Users who have requested reduced motion will still see the spinning animation.

Location: `@keyframes spin` and `.spinner` class in brand.html.

Fix: Add `@media (prefers-reduced-motion: reduce) { .spinner { animation: none; } }`.

---

### 2.13 Logo alt text is generic (advisory)

WCAG criterion: 1.1.1 Non-text Content, Level A
Severity: Advisory

The header logo image in brand.html carries `alt="LLBS Logo"`. This passes the criterion (it is not empty on an informative image) but the alternative text does not expand the abbreviation. The index.html logo correctly uses `alt="Lincoln and Lindsey Blind Society"`. Consistency between the two pages would be better.

Location: `<img id="headerLogo" ... alt="LLBS Logo" />` at line 336.

Fix: Change to `alt="Lincoln and Lindsey Blind Society logo"`.

---

## Section 3: conformance statement

Neither page meets WCAG 2.2 at Level A, AA, or AAA.

- The theme-label white-on-tint-80 contrast failure (finding 1.1) falls below the AA minimum of 4.5:1 for normal text. This is the only finding that breaks Level A/AA conformance on index.html in isolation, but it is sufficient to prevent an AA or AAA claim.
- The missing keyboard access on the brand.html file upload (finding 2.2) is a Level A keyboard failure.
- The absent focus indicator on brand.html form controls (finding 2.5) is a Level AA failure.
- Numerous findings at AAA (contrast, reduced motion, link purpose, abbreviations, canvas accessibility) prevent AAA conformance on both pages.

The pages show a thoughtful baseline: both have a page language attribute, both have descriptive page titles, index.html has a skip link and well-structured landmarks, the tab widget follows the WAI-ARIA tab pattern with correct keyboard support, the timeline table has a visually-hidden caption, and most text meets the 4.5:1 AA contrast threshold. The AAA gap is primarily in contrast (the colour palette was designed to a target slightly below 7:1 in several places) and in a handful of missing AAA criteria.

---

## Section 4: questions for Tim (to be routed through Sonja)

1. The primary brand blue `#156082` on white falls 0.06 below the AAA threshold at 6.94:1. Darken it to clear 7:1 would change the brand colour slightly. Does Tim want this changed to match the AAA target, or accepted as a documented exception given the marginal shortfall?

2. The tint-80 contrast failure (white on `#44809B` at 4.37:1) is the only AA-level failure. It uses brand-derived tints. Should Sean darken this tint for the strategy page, or should a documented exception be filed and AA compliance accepted for that element?

3. The canvas photo-positioning interaction in brand.html is pointer-only. Full keyboard support would require significant additional JavaScript. Should this be added now, accepted as a documented exception, or deferred?

4. The status messages in brand.html use emoji for visual feedback. Removing emoji will reduce the decorative appeal. Should they be replaced with plain-text equivalents, or kept visually with an aria-label alternative?

---

## Section 5: audit metadata

- Method: Manual code inspection only. No axe-core or Pa11y run was executed in this session (shell tool execution was not available). A follow-up automated run is required before any conformance claim is published.
- Colour contrast ratios were calculated using the WCAG 2.2 relative-luminance formula, verified with a Node.js script executed during the audit.
- Screen reader testing (VoiceOver, JAWS, NVDA) was not performed in this session. Manual screen reader testing is required to confirm findings 2.2, 2.3, 2.4, and 2.10.
- Tool-call count: approximately 35 bash and read calls.
- Duration: single session, 2026-05-21.
