# LLBS Project Wiki: Accessibility

This page records the LLBS project's WCAG (Web Content Accessibility Guidelines) 2.2 AAA position. It is based on the baseline audit Carol completed on 2026-05-21 by code inspection. That audit covered both `index.html` and `brand.html`.

## Conformance position

Neither page currently meets WCAG 2.2 at Level A, Level AA, or Level AAA.

The audit found 24 findings in total: 1 critical, 12 major, 6 minor, and 5 advisory. The critical finding is a contrast failure on the Transport theme label that falls below the AA floor. Several Level A failures exist on `brand.html`. The detailed findings are listed below.

The audit was code-inspection only. An automated run with axe-core and Pa11y, and a manual screen reader pass with VoiceOver and JAWS, are still required before any conformance statement can be published.

Tim's answers to the accessibility questions in the consolidated batch resolved four open items:

- The brand-blue primary colour contrast shortfall (`#156082` on white at 6.94:1, just below the 7:1 AAA threshold) is documented as exception ACC-LLBS-001. See `docs/exceptions/ACC-LLBS-001-brand-blue-contrast.md`.
- The Transport theme label is to be darkened to clear the AA contrast floor (finding 1.1 below).
- The `brand.html` canvas photo-positioning gap (pointer-only drag with no keyboard equivalent) is documented as exception ACC-LLBS-002. See `docs/exceptions/ACC-LLBS-002-canvas-keyboard-gap.md`.
- The `brand.html` status emoji are kept visually but text alternatives must be provided for screen readers via `aria-live`.

## What the pages do well

Both pages show a thoughtful accessibility baseline for a site built before the team existed:

- Both have a page `lang` attribute and descriptive page titles.
- `index.html` has a visible skip link, well-structured landmarks, and a reading order that follows the visual layout.
- The tab widget in `index.html` follows the WAI-ARIA (Accessible Rich Internet Applications) tab pattern with correct keyboard support.
- The timeline table has a visually-hidden caption.
- Most text on `index.html` meets the AA contrast threshold of 4.5:1.

## Approved exceptions

Two accessibility exceptions have been approved by Tim:

- ACC-LLBS-001: the brand-blue primary colour at 6.94:1 against white is accepted as a documented exception given the marginal shortfall (0.06 below the 7:1 AAA threshold). Full details in `docs/exceptions/ACC-LLBS-001-brand-blue-contrast.md`.
- ACC-LLBS-002: the canvas photo-positioning interaction in `brand.html` is pointer-only, with no keyboard equivalent for fine dragging. Coarse positioning is available via keyboard controls. Full details in `docs/exceptions/ACC-LLBS-002-canvas-keyboard-gap.md`.

## Findings: index.html

### Critical

**Finding 1.1: Transport theme label falls below AA contrast floor**
WCAG criterion: 1.4.3 Contrast (Minimum), Level AA; 1.4.6 Contrast (Enhanced), Level AAA
White text on the tint-80 background `#44809B` gives 4.37:1. This is below the AA minimum of 4.5:1 for normal text (the label text is approximately 13px bold, which does not qualify as large text). This is the only finding that breaks AA conformance on `index.html`.
Fix required: darken the Transport theme label background to achieve at least 4.5:1 against white for AA and 7:1 for AAA. Tim approved this change (answer 11).

### Major

**Finding 1.2: White text on primary tints t86 and t92**
WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
White text on tint-86 (`#367694`) gives 5.03:1 and on tint-92 (`#286D8C`) gives 5.74:1. Both pass AA but fail AAA. These tints appear as theme-label backgrounds for Wellbeing and Future Ready, as route-box borders, and on the income-card teal variant.
Fix required: use darker tints or dark text on these backgrounds.

**Finding 1.3: White text on primary blue `#156082`**
WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
White text on the primary colour `#156082` gives 6.94:1. This passes AA but falls 0.06 short of 7:1. Affects the hero call-to-action button, the active tab text, the Community theme label, and the income-card mid-variant label text. The large stat-card numbers (2.25rem bold) and large income-card numbers (2.75rem bold) do pass AAA for large text at 4.5:1.
Status: documented exception ACC-LLBS-001 applies to the marginal shortfall. See `docs/exceptions/ACC-LLBS-001-brand-blue-contrast.md`.

**Finding 1.4: Muted text on light backgrounds**
WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
The muted body text colour `#4A5568` gives 7.53:1 on white (passes), 6.23:1 on light-bg `#E7EAED` (fails), and 6.88:1 on lighter-bg `#F3F5F6` (fails). Affects section introductory paragraphs, stat-card labels, and value-card supporting text on the non-white section backgrounds.
Fix required: darken the muted text colour or restrict it to white backgrounds.

**Finding 1.5: SWOT quadrant headings**
WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
Strengths heading at 5.91:1 and Opportunities heading at 6.11:1 both fail AAA (7:1). Weaknesses and Threats pass.
Fix required: darken the Strengths and Opportunities heading colours.

**Finding 1.6: Hero subtitle**
WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
The hero subtitle "2025 to 2030" in colour `#7CA6B9` on the primary-dark background gives 6.14:1. At the minimum viewport the text renders at 20px regular, which does not qualify as large text.
Fix required: increase the contrast of this colour against the dark background.

**Finding 1.7: Income card teal label text**
WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
White text on the teal income card background `#367694` gives 5.03:1. Fails AAA for 0.9375rem normal weight text.
Fix required: darken the background or use dark text.

### Minor

**Finding 1.8: Value-card headings use h3 inside a list under an h2**
WCAG criterion: 2.4.10 Section Headings, Level AAA
Five h3 value-card headings sit as siblings after a parent h3 "Our Values", making a flat sequence. They would read more clearly as h4 elements.
Fix required: change value-card heading level from h3 to h4.

**Finding 1.9: Footer links use bare phone number and email address**
WCAG criterion: 2.4.9 Link Purpose (Link Only), Level AAA
The footer links to a bare "01507 605604" and "info@llbs.co.uk" carry no context when read from a screen reader link list.
Fix required: add `aria-label` attributes such as "Call LLBS on 01507 605604".

**Finding 1.10: Link text "Visit llbs.co.uk"**
WCAG criterion: 2.4.9 Link Purpose (Link Only), Level AAA
The link reads as a domain name rather than a destination description when pulled into a link list.
Fix required: change to "Visit the LLBS website" or similar.

**Finding 1.11: RNIB abbreviation not expanded on first use**
WCAG criterion: 3.1.4 Abbreviations, Level AAA
RNIB appears in a stat-card label without expansion. JHWS is correctly expanded; RNIB is not.
Fix required: write "Royal National Institute of Blind People (RNIB)" on first use, or use `<abbr title="Royal National Institute of Blind People">RNIB</abbr>`.

**Finding 1.12: No `prefers-reduced-motion` guard on CSS transitions**
WCAG criterion: 2.3.3 Animation from Interactions, Level AAA
Four CSS transition declarations exist with no `prefers-reduced-motion` guard. Transitions are subtle (0.15s to 0.2s) but must be suppressible for AAA conformance.
Fix required: wrap all transitions in `@media (prefers-reduced-motion: no-preference)` or add a reduce override.

### Advisory

**Finding 1.13: Income grid missing `role="list"`**
WCAG criterion: 1.3.1 Info and Relationships, Level A
The income grid has `aria-label` but no `role="list"`, and its children have no `role="listitem"`. The stats grid follows the correct pattern.
Fix advised: add `role="list"` to the income grid and `role="listitem"` to each card.

**Finding 1.14: Timeline "Not active" cells are empty**
WCAG criterion: 4.1.2 Name, Role, Value, Level A
Empty timeline cells carry `aria-label="Not active"`, which is correct for screen readers. Low-vision sighted users who do not use a screen reader may not distinguish empty from populated cells.
Fix advised: consider a visually-hidden indicator inside "Not active" cells.

**Finding 1.15: No glossary or landmark for specialist terms**
WCAG criterion: 3.1.3 Unusual Words, Level AAA
Terms such as "sight impairment officers", "befriending", and "vision impairment" have no inline definitions or link to a glossary.
Fix advised: add a link to a glossary on the main LLBS website, or add inline expansions.

## Findings: brand.html

### Major

**Finding 2.1: No skip link and no `<main>` landmark**
WCAG criterion: 2.4.1 Bypass Blocks, Level A; 1.3.6 Identify Purpose, Level AAA
The page has no skip link and no `<main>` element. A keyboard user must tab through the header before reaching the upload area.
Fix required: add `<a class="skip-link" href="#main-content">Skip to main content</a>` and wrap the main content in `<main id="main-content">`.

**Finding 2.2: File upload area is not keyboard-operable**
WCAG criterion: 2.1.1 Keyboard, Level A; 4.1.2 Name, Role, Value, Level A
The upload drop zone is a `<div>` with no `tabindex` and no role. The file input is `display: none`, removing it from the accessibility tree. A keyboard user cannot upload a photo.
Fix required: replace the `<div>` with a `<button>`, or add `tabindex="0"` and `role="button"` with a keydown handler for Enter and Space, and use a visually-hidden class rather than `display: none` for the file input.

**Finding 2.3: Canvas element has no accessible name or text alternative**
WCAG criterion: 1.1.1 Non-text Content, Level A
The `<canvas>` element has no `aria-label`, no role, and no fallback content.
Fix required: add an `aria-label` that describes the canvas state (format and dimensions) and update it dynamically.

**Finding 2.4: Status messages use emoji and lack a live region**
WCAG criterion: 1.1.1 Non-text Content, Level A; 4.1.3 Status Messages, Level AA
The status `<div>` has no `aria-live` attribute, so messages are not announced to screen readers. Emoji in status strings will be read aloud by screen readers with cluttered, unclear names.
Fix required: add `aria-live="polite"` and `aria-atomic="true"` to the status div. Tim's answer 13 confirmed the emoji may remain visually, but a screen-reader-friendly text alternative is required.

**Finding 2.5: Focus indicator is near-transparent on form controls**
WCAG criterion: 2.4.7 Focus Visible, Level AA; 2.4.13 Focus Appearance, Level AAA
The custom focus ring uses `rgba(26,86,219,0.15)`, which is nearly transparent at 15% opacity. The effective contrast ratio of the indicator against the form background is approximately 1.1:1.
Fix required: use `box-shadow: 0 0 0 3px #1a56db` at full opacity.

**Finding 2.6: Muted text contrast below AA on body background**
WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
The muted text colour `#5a6a82` gives 5.50:1 on white and 4.98:1 on the page background `#f0f4f8`. The latter technically fails AA for normal text.
Fix required: darken to approximately `#4a5a70` or darker to achieve 7:1 on white.

**Finding 2.7: Primary and danger button contrast**
WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
White text on primary button `#1a56db` gives 6.18:1. The danger button `#c0392b` on white gives 5.44:1. Both fail AAA for 0.95rem normal-weight text.
Fix required: darken button colours to achieve 7:1.

### Minor

**Finding 2.8: Contrast badge pill labels fall below AAA**
WCAG criterion: 1.4.6 Contrast (Enhanced), Level AAA
The pass, fail, and neutral pills in the contrast badge all fall below 7:1 for their 0.75rem bold text.
Fix required: darken each pill text colour slightly.

**Finding 2.9: Canvas photo-positioning is pointer-only**
WCAG criterion: 2.1.1 Keyboard, Level A; 2.1.3 Keyboard (No Exception), Level AAA
Fine photo repositioning relies on pointer-drag events only. The zoom slider, Re-centre button, and rotation slider provide a keyboard path to primary outputs, but no keyboard equivalent for fine repositioning exists.
Status: documented exception ACC-LLBS-002 applies. See `docs/exceptions/ACC-LLBS-002-canvas-keyboard-gap.md`.

**Finding 2.10: Decorative SVG icons not hidden from assistive technology**
WCAG criterion: 1.1.1 Non-text Content, Level A
SVG icons in the action buttons and the upload area lack `aria-hidden="true"`. Screen readers may read confusing path data or announce the button text twice.
Fix required: add `aria-hidden="true"` and `focusable="false"` to each decorative SVG.

### Advisory

**Finding 2.11: Spinner has no accessible name and is not guarded for reduced motion**
WCAG criterion: 4.1.3 Status Messages, Level AA; 2.3.3 Animation from Interactions, Level AAA
The spinner has no role or label and the `@keyframes spin` animation has no `prefers-reduced-motion` guard.
Fix advised: add `role="status"` and `aria-label`, or add `aria-hidden="true"` and rely on the status live region. Guard the animation with `prefers-reduced-motion`.

**Finding 2.12: No `prefers-reduced-motion` guard on spinner animation**
WCAG criterion: 2.3.3 Animation from Interactions, Level AAA
Same issue as Finding 2.11, recorded separately for tracking. See above.

**Finding 2.13: Logo alt text is generic**
WCAG criterion: 1.1.1 Non-text Content, Level A
The header logo in `brand.html` uses `alt="LLBS Logo"` rather than expanding the abbreviation as `index.html` does.
Fix advised: change to `alt="Lincoln and Lindsey Blind Society logo"`.

## Remediation priorities

The following work is required before a conformance statement can be published:

1. Run an automated check with axe-core and Pa11y on both pages.
2. Complete a manual screen reader pass with VoiceOver and JAWS on both pages.
3. Fix the critical finding (1.1, Transport label contrast) to clear AA.
4. Fix the Level A failures on `brand.html` (findings 2.1, 2.2, 2.3, 2.4, 2.5, 2.10).
5. Fix the remaining contrast failures across both pages, subject to the documented exceptions.
6. Add `prefers-reduced-motion` guards on both pages.
7. Fix the remaining minor and advisory items.

All findings are tracked as acceptance criteria in `docs/requirements.md`.
