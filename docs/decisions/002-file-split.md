# ADR 002: Split each page into separate HTML, CSS, and JavaScript files

## Status

Accepted. Recorded by Jacob (architect) on 2026-05-21 during work 005-llbs-setup. Tim confirmed the decision on 2026-05-21 (answer 9 in the consolidated question batch). The split is scheduled as a follow-up piece of work after the adoption.

## Context

Both pages in the repository hold structure, presentation, and behaviour in one file.

`index.html` is about 55 kilobytes. Its `<head>` carries an inline `<style>` block of roughly 720 lines, and the end of the `<body>` carries an inline `<script>` block of roughly 40 lines holding the mobile navigation toggle and the tab keyboard handler. The file also uses many inline `style` attributes throughout the HTML.

`brand.html` is about 39 kilobytes. Its `<head>` carries an inline `<style>` block of roughly 325 lines, and the end of the `<body>` carries an inline `<script>` block of roughly 680 lines: the entire Photo Brander application, including configuration, canvas drawing, colour and contrast helpers, file handling, pointer-drag handling, and the share and download logic.

The team's static front-end stack standard requires structure (HTML), presentation (CSS), and behaviour (JavaScript) to be in separate files. Neither page meets this standard today. The same gap was found and recorded for the Periodic-Table and Clock-Practice projects.

## Decision

Three decisions, taken together.

First, `brand.html` and `index.html` must remain as two separate pages. They must never be consolidated into one file. They are two different kinds of software with two different audiences.

Second, each page must be split from one file into separate HTML, CSS, and JavaScript files. The target layout is:

- `index.html`: strategy page structure only, linking its stylesheet and script.
- `css/strategy.css`: strategy page presentation, extracted from the inline `<style>` block. Inline `style` attributes throughout the HTML must be converted to CSS classes at the same time.
- `js/strategy.js`: strategy page behaviour, the navigation toggle and tab keyboard handler.
- `brand.html`: Photo Brander page structure only, linking its stylesheet and script.
- `css/brand.css`: Photo Brander presentation.
- `js/brand.js`: Photo Brander application code.

The two pages keep separate CSS and JavaScript files; they do not share a stylesheet today, because their visual designs differ.

Third, the 55-kilobyte size of `index.html` is not a problem and the page must not be broken into multiple pages. The size is largely the inline CSS; once that moves to `css/strategy.css` the HTML file itself becomes much smaller. The correct response to the size is the concern-split, not pagination.

The split is a refactor only. It must not change either page's behaviour, appearance, or accessibility.

The split is not part of the adoption work (work 005). Adoption is a backfill of reviews and configuration; the split is a refactor that would move every line and make the security and code reviews harder to trace. Tim confirmed this sequencing (answer 9).

The colour palette comment block at the top of the `index.html` inline style block is valuable design documentation; it must move to `css/strategy.css`, not be discarded. The same applies to the section-divider comments in `brand.html`.

## Alternatives considered

**Keep both pages as single files permanently.** Rejected. A single file is acceptable for a quick demo. LLBS is now a maintained team project. The stack standard requires separated concerns for good reasons: the browser can cache a stylesheet and a script separately; a presentation change and a behaviour change land in separate diffs; and a separate `.css` file and `.js` file can be linted by standard tools. For `brand.html` with 680 lines of JavaScript embedded in HTML, the case is especially strong. Carrying a permanent standards exception is worse than doing the refactor once.

**Split `index.html` into several smaller pages.** Rejected. The strategy is one document with a single reading order and an in-page navigation menu. Breaking it into multiple pages would break that navigation, add page loads between sections, and complicate the screen reader experience for no gain.

**Consolidate `brand.html` into `index.html`.** Rejected firmly. The two pages have different audiences and different risk surfaces. Combining them would force the wide Photo Brander CSP onto the brochure page and mix a read-only document with a stateful tool in one file.

**Split the JavaScript further into feature modules now.** Rejected as premature. The standard is "source organised by feature". For `index.html` the script is 40 lines. For `brand.html` a further module split is defensible but is a refinement that can follow the first split. The team's principle is to prefer the simple solution and add structure when a real need arrives.

## Consequences

- Until the split is done, the project carries a known, recorded gap against the stack standard. The split is the next piece of work after the adoption.
- The split is a precondition for the tighter CSP described in ADR 004. Until the split, both pages need `'unsafe-inline'` for script and style, which weakens their policies.
- Inline `style` attributes throughout `index.html` must be converted to CSS classes as part of the split. This conversion has no visible effect but is required to remove `'unsafe-inline'` from the CSP.
- A follow-up piece of work delivers: `index.html`, `css/strategy.css`, `js/strategy.js`, `brand.html`, `css/brand.css`, `js/brand.js`. This is a `refactor` change and must not alter behaviour, appearance, or accessibility.
