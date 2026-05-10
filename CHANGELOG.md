# LLBS Strategy Page — Change Log

## 2026-05-10

### WCAG Colour Contrast Fixes
Five text elements in the dark-navy sections were failing WCAG AA (contrast ratio < 4.5:1). Changed all to `var(--white)` (~15:1, AAA compliant):
- `#join-us` intro paragraph — was `var(--mid-grey)` (#CCD2D8, ~2.8:1)
- `#join-us` closing paragraph — was `var(--mid-grey)` (#CCD2D8, ~2.8:1)
- `#join-us` "How You Can Help" h3 — was `var(--p46)` (#93B6C6, ~3.2:1)
- `#join-us` "Together, We Will" h3 — was `var(--p46)` (#93B6C6, ~3.2:1)
- Health priorities "Investment in LLBS" h3 — was `var(--p46)` (#93B6C6, ~3.2:1)

### Bullet Point Consistency
Route-box lists (Reason / Routes to Outcome in each theme tab) were using an em-dash (—) as the CSS bullet character. Changed `.route-box li::before` from `content: '\2014'` to `content: '\2022'` (standard bullet •) to match the rest of the page.

### Navigation — matched llbs.co.uk style
Redesigned the site header to match the style of the main LLBS website:
- Header background: dark navy → white
- Nav link colour: white → near-black (`var(--text)`)
- Font: Arial → DM Sans (Google Font, added via `<link>` preconnect)
- Logo container: removed white background box (not needed on white header)
- Mobile toggle: updated border/colour for dark-on-white
- Nav link font size: 0.8125rem → 0.9375rem
- Nav gap: 0.1rem → 0.25rem
- Hover state: teal-blue tint (`rgba(21,96,130,0.08)`) with `var(--primary)` text
- Header border-bottom (4px accent) replaced with subtle `box-shadow`

### CSS Specificity Fix — Join Section Background
`section:nth-of-type(even)` (specificity 0-1-1) was overriding `.cta-section` background (0-1-0), making the dark navy section render as light grey and hiding white text. Fixed by changing the alternating rule to `section:nth-of-type(even):not(.cta-section)`.

### Timeline — Continuous Bars
Removed horizontal padding and column borders from year cells so adjacent bars read as solid continuous blocks rather than segmented pieces. Key changes to `.timeline-table td:not(:first-child)`: `padding: 0`, `border-left: none`, `border-right: none`.

### Timeline — Date Corrections (verified against PDF)
Corrected theme bar positions to match the source PDF (page 7):
- **Community**: was mid-2027 → end-2028; corrected to full-2027 → mid-2028
- **Transport**: was 2027 → mid-2028; corrected to 2028 → mid-2029
- Wellbeing (2029–2030) and Future Ready (2026–mid-2027) were already correct
