# LLBS: Open Work Items

This file tracks open work items for the LLBS project. It is updated as items are resolved or added. Cross-reference: `docs/accessibility.md` for full detail on each accessibility finding.

## Pre-existing AAA failures, deferred to the accessibility phase

These items were identified by Pa11y (WCAG 2.2 AAA) and confirmed as pre-existing in the original codebase. They are suppressed in `pa11y.json` during the setup pull request. The accessibility phase must remove the Pa11y ignores as each item is fixed.

### index.html: G17 contrast failures (WCAG 1.4.6, Level AAA)

- Hero call-to-action link: 6.94:1 on primary blue `#156082`. Recommended background: `#145f81`.
- Section-intro paragraphs (introduction, SWOT, strategy, timeline): 6.88:1, muted text `#4a5568`. Recommended text: `#485366`.
- Blockquote footers (who-we-are, community panel): 2.51:1. Recommended text: `#fefeff`.
- SWOT Strengths heading: 5.91:1. Recommended text: `#1e5e0e`.
- SWOT Opportunities heading: 6.11:1. Recommended text: `#0b5678`.
- Vision label: 3.22:1. Recommended background: `#00293c`.
- Mission card text: 1.09:1. Recommended background: `#57595a`.
- Strategy table theme labels (Community, Wellbeing, Future Ready): 5.03:1 to 6.94:1. Recommended background: `#145f81` or darker.
- Strategy table Transport theme label: 4.37:1. Recommended background: `#235f7a`.
- Timeline table headers (Theme, 2026 to 2030): 6.94:1 on primary blue. Recommended background: `#145f81`.
- Community panel intended-outcome label: 6.23:1. Recommended text: `#424d60`.
- Community panel route-box headings (Why, Intended Direction, Reason, Routes to Outcome): 6.34:1. Recommended text: `#000e15`.
- Income card labels (mid and teal variants): 5.03:1 to 6.94:1 on teal backgrounds. Recommended backgrounds: `#145f81` and `#1f5f7d`.
- Active Community tab button: 6.94:1 on primary blue. Recommended text: `#145f81`.

### index.html: G18 contrast failures (WCAG 1.4.6, Level AAA, large text)

- Income card number +4%: 3.22:1 on mid-teal. Recommended background: `#00496b`.
- Income card number ~13%: 2.33:1 on dark-teal. Recommended background: `#094967`.

### index.html: G141 heading-structure (WCAG 1.3.1 AAA)

- Community panel h4 headings flagged as out of order by Pa11y. Pa11y false positive on tab-panel structure; assess and confirm (or correct) during the accessibility phase. Selector: community panel route-box h4 elements.

### brand.html: G17 contrast failures (WCAG 1.4.6, Level AAA)

- Header paragraph muted text: 4.98:1 on page background `#f0f4f8`. Recommended: darken text colour to at least `#4a5a70`.
- Upload-area span text: 5.50:1 on white. Same recommendation.

### brand.html: non-text contrast gap (WCAG 1.4.11, Level AA)

- Input border colour `#cbd5e1`: approximately 1.49:1 against white. Below the 3:1 non-text contrast threshold. Recommended: change to `#768da5` or darker.
