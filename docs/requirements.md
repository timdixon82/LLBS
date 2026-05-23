# LLBS Project Wiki: Requirements

This document records the functional and non-functional requirements for the LLBS (Lincoln and Lindsey Blind Society) project, together with acceptance criteria for each deliverable. The project predates the team and had no prior requirements documentation. Everything here was reverse-engineered from the source files and from the five backfill reviews completed on 2026-05-21.

Tim's answers to the consolidated question batch (recorded in `.claude/work/005-llbs-setup/log.md`) resolved several open requirements questions. Those answers are reflected below.

## 1. Project overview

The repository holds two distinct deliverables.

`index.html` is a single-page public website that presents the LLBS Living Well Together Strategy 2025 to 2030 to members, funders, volunteers, partner organisations, and the public. It is a read-only information page with no forms, no accounts, and no interactive data entry.

`brand.html` is the LLBS Photo Brander, a self-contained browser tool that lets LLBS staff and volunteers create branded social media images. A user uploads a photo, positions it, adds optional overlay text, and downloads or shares the finished image. All processing happens inside the browser using the Canvas API (Application Programming Interface). No image data is sent to a server.

Both deliverables are static HTML pages. The stack is HTML, CSS (Cascading Style Sheets), and JavaScript with no build step and no server. The repository is hosted on GitHub Pages at `timdixon82.github.io/LLBS`.

## 2. Personal data

Neither deliverable processes personal data as defined by the UK General Data Protection Regulation (UK GDPR). `index.html` displays no forms, collects no input, and sets no cookies. `brand.html` loads photos into browser memory only; no photo or user data is sent to any server. Both pages previously made third-party requests that disclosed visitor IP addresses to Google and to external WordPress servers. The team decision (Tim's answer 4) is to self-host fonts and logos, which removes those disclosures.

## 3. Target users

### 3.1 Strategy page users (index.html)

- Members and service users of LLBS, and their families and carers. This group includes people who are severely sight-impaired and who rely on screen readers such as JAWS (Job Access With Speech) and VoiceOver.
- Funders, commissioners, and statutory partners such as Lincolnshire County Council, Integrated Care Board commissioners, and NHS partners, who read the strategy to assess alignment with the Lincolnshire Joint Health and Wellbeing Strategy (JHWS).
- Volunteers, prospective volunteers, and partner organisations seeking to understand LLBS's direction and how to get involved.
- Members of the public in Greater Lincolnshire who may benefit from LLBS support.

### 3.2 Photo Brander users (brand.html)

- LLBS staff and volunteers who produce social media content on behalf of LLBS. They need to create consistently branded images quickly, without specialist software, from a desktop or mobile browser.
- The tool is treated as publicly accessible (Tim's answer 2), so any member of the public who finds the page can use it, though its intended audience is staff and volunteers.

## 4. Functional requirements: strategy page (index.html)

### 4.1 Content presentation

1. The page must present the full Living Well Together Strategy 2025 to 2030, covering: the introduction, who LLBS serves, the SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis, the vision and mission statements, the five organisational values, the four strategic themes with their starting points and 2030 outcomes, the strategy timeline, the income and sustainability targets, the alignment with the Lincolnshire JHWS, and the call to action for donors, volunteers, and partners.
2. The page must display key statistics accurately: 1,600 or more people currently supported; 16,000 square miles of rural communities served; 1 in 26 of the 42,000 visually impaired people in Greater Lincolnshire; and the Royal National Institute of Blind People (RNIB) projection of 52,000 by 2032.
3. Income targets must be presented as three figures: 9.3 percent annual growth to maintain current services, an additional 4 percent to fund the strategy, and approximately 13 percent total annual growth.

### 4.2 Navigation

4. The page must provide a sticky navigation header linking to each of the nine named sections: Introduction, Who We Are, Analysis, Vision and Values, Strategy, Themes, Income, Health Priorities, and Join Us.
5. The header must include the LLBS logo as a link to the main LLBS website at `llbs.co.uk`.
6. On viewports narrower than 820 CSS pixels, the navigation links must collapse behind a disclosed toggle button labelled "Menu".

### 4.3 Theme detail tabs

7. The Theme Detail section must present four tabs labelled Community, Transport, Wellbeing, and Future Ready.
8. Each tab panel must show the intended 2030 outcome, a member quote, and four route-boxes labelled Why, Intended Direction, Reason, and Routes to Outcome.
9. Only one tab panel must be visible at a time; the other three must be hidden from all users and from assistive technologies.

### 4.4 No-JavaScript fallback

10. When a visitor arrives without JavaScript enabled, a message must be shown telling them that JavaScript is needed to use the interactive features of the page (Tim's answer 3). The static content of the page must remain readable.

### 4.5 Timeline

11. The strategy timeline must represent the four themes across five calendar years (2026 to 2030) as a visual bar chart table.
12. The bars must reflect the sequencing verified against the source PDF: Community active from full-2027 to mid-2028; Transport active from 2028 to mid-2029; Wellbeing active from 2029 to 2030; Future Ready active from 2026 to mid-2027.

### 4.6 Call to action

13. The Join Us section must provide four direct contact links: a link to the LLBS donation page, a link to the LLBS website, a telephone link to 01507 605604, and an email link to info@llbs.co.uk.

## 5. Functional requirements: Photo Brander (brand.html)

### 5.1 Image upload

1. The tool must accept image files by keyboard-activated browse and by drag-and-drop. Accepted formats are JPEG, PNG, WEBP, and GIF.
2. On file selection, the upload area must be replaced by the editor view.

### 5.2 Format selection

3. The user must be able to choose from four output formats: Instagram and Facebook square at 1080 by 1080 pixels; Story and Reel portrait at 1080 by 1920 pixels; Twitter and X landscape at 1600 by 900 pixels; and Facebook post at 1200 by 630 pixels.

### 5.3 Photo positioning and transformation

4. The user must be able to drag the photo within the frame to reposition it.
5. The user must be able to zoom the photo from 10 percent to 400 percent using a slider or the mouse wheel.
6. The user must be able to rotate the photo from negative 180 degrees to positive 180 degrees using a slider.
7. Re-centre and Fit to Frame buttons must reset the photo position and scale respectively.

### 5.4 Overlay text

8. The user must be able to type up to 200 characters of overlay text. The text must wrap automatically within a configurable margin.
9. The user must be able to drag the text block anywhere within the photo area.
10. The user must be able to set the text size from 16 pixels to 120 pixels, choose from eight fonts, and set the font colour and background colour independently.
11. The text background must support variable opacity from 0 percent (fully transparent) to 100 percent (fully opaque).

### 5.5 Branding strip

12. The bottom 10 percent of the output image, with a minimum of 80 pixels and a maximum of 180 pixels, must be a white strip bearing the LLBS logo, with a blue accent line at the top of the strip in colour `#1a56db`.
13. The LLBS logo must be loaded from the repository's own assets folder. If the load fails, the tool must render the strip without a logo rather than failing silently (Tim's answer 4; self-hosting the logo makes the CORS proxy fallback chain unnecessary).

### 5.6 Status messages

14. Status messages must use plain text only, with no emoji characters (Tim's answer 13 clarified that the emoji may be kept visually, but a text alternative must be provided for screen readers via `aria-live`). The status element must carry `aria-live="polite"` and `aria-atomic="true"` so screen reader users hear updates.

### 5.7 Export

15. The user must be able to download the composed image as a JPEG file at 0.92 quality. The filename must follow the pattern `<originalname>_llbs_branded.jpg`.
16. On browsers that support the Web Share API, a Share Image button must invoke the native share sheet with the composed image, the title "LLBS Branded Photo", and attribution text.
17. A Start Over button must clear the canvas, hide the editor, and return to the upload area.

## 6. Non-functional requirements

### 6.1 Accessibility

1. Both pages must target WCAG 2.2 at AAA conformance. The baseline audit found both pages currently failing; the accessibility work plan is in `docs/accessibility.md`.
2. `index.html` must include a visible skip link that moves keyboard focus to the main content region when activated.
3. `brand.html` must include a skip link and a `<main>` landmark.
4. All interactive controls on both pages must be operable by keyboard alone, with a visible focus indicator.
5. The tab widget on `index.html` must implement the ARIA (Accessible Rich Internet Applications) tab pattern with `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, and keyboard navigation using Arrow Left, Arrow Right, Home, and End.
6. All colour combinations on both pages must meet WCAG 2.2 AAA contrast ratios, subject to the approved exceptions in `docs/exceptions/`.
7. `brand.html` must display a live WCAG contrast badge that reports the contrast ratio between the chosen font colour and background colour, updated in real time.
8. All images that convey information must have descriptive alternative text. The `brand.html` header logo must use `alt="Lincoln and Lindsey Blind Society logo"`.
9. The mobile navigation toggle on `index.html` must use `aria-expanded` to communicate its open or closed state to screen readers.
10. CSS transitions on both pages must be suppressed when the user has requested reduced motion via the operating system `prefers-reduced-motion` setting.
11. The RNIB abbreviation must be expanded on first use in `index.html`.
12. Footer links must carry descriptive `aria-label` text so they are meaningful when read in isolation from a link list.
13. Decorative SVG icons in `brand.html` buttons must carry `aria-hidden="true"` and `focusable="false"`.
14. The income grid in `index.html` must carry `role="list"` with `role="listitem"` on each card, matching the stats grid pattern.
15. The value-card headings in the Vision and Values section must use h4, not h3.

### 6.2 Performance and compatibility

16. Both pages must load and be usable on current releases of Chrome, Edge, Firefox, and Safari.
17. Both pages must be responsive and usable on viewports from 320 CSS pixels wide to at least 1440 CSS pixels wide.
18. No server is required. Both pages must work as static files served from GitHub Pages.

### 6.3 Brand consistency

19. Both pages must use the LLBS primary colour palette: `#156082` primary teal-blue, `#042433` dark navy, `#0556A8` bright blue accent, and `#4EA72E` green.
20. `index.html` must use the DM Sans typeface, self-hosted. `brand.html` must offer DM Sans as a font option labelled "DM Sans (LLBS brand)".
21. The header style of `index.html` must match the style of the main LLBS website: white background, DM Sans, near-black link text.

### 6.4 Security

22. All JavaScript must run client-side. No user data, image data, or secrets must be sent to any server controlled by this project.
23. The LLBS logo must be served from the same origin as the pages, not from an external origin or a third-party CORS proxy (Tim's answer 4).
24. No API keys or credentials must appear in the source code.
25. Each page must carry a `<meta http-equiv="Content-Security-Policy">` tag in the `<head>`, placed first after `<meta charset>`. The policies are defined in ADR 004.
26. Each page must carry a `<meta name="referrer" content="strict-origin-when-cross-origin">` tag.
27. GitHub secret scanning must be enabled on the repository.
28. Branch protection must be added to the `main` branch.

### 6.5 Maintainability

29. `CHANGELOG.md` must be updated to record all changes made by the team, in a clearly marked team-era section (Tim's answer 6).
30. The strategy PDF in the repository root is a static asset and is not team-maintained (Tim's answer 7).
31. This project wiki must be kept current as the team makes changes.

## 7. Acceptance criteria

### 7.1 Strategy page (index.html)

- [ ] Navigating to the page with a screen reader, all nine section headings are announced in the correct reading order.
- [ ] A keyboard-only user can activate the skip link and reach the main content region without traversing the navigation.
- [ ] All nine navigation links scroll to the correct section on activation.
- [ ] On a viewport narrower than 820 pixels, the navigation links are hidden; activating the Menu button reveals them and sets `aria-expanded="true"`.
- [ ] The SWOT grid announces its four quadrants as labelled regions to a screen reader.
- [ ] The stats grid announces each card as a list item within a group labelled "Key statistics".
- [ ] The tabs widget: activating a tab shows its panel and hides the other three; Arrow Right moves to the next tab; Arrow Left moves to the previous tab; Home moves to the first tab; End moves to the last tab; hidden panels carry the `hidden` attribute.
- [ ] The timeline table has a caption (visible or visually hidden) describing the data; each bar cell has an `aria-label` of "Active" or "Not active" or a date range.
- [ ] All text on a dark background has a contrast ratio of at least 7:1 for normal text and 4.5:1 for large text, verified with axe-core and manual checks, subject to the documented exception in ACC-LLBS-001.
- [ ] The four contact links in the Join Us section open the correct destinations: donation page, llbs.co.uk, phone dialler, email client.
- [ ] When JavaScript is disabled, the page displays a message informing the visitor that JavaScript is required.
- [ ] DM Sans font is loaded from `assets/fonts/` and not from an external origin.
- [ ] The LLBS logo is loaded from `assets/` and not from an external origin.
- [ ] The page carries a Content Security Policy meta tag scoped to `'self'` for all directives.
- [ ] Colour transitions are suppressed on devices with `prefers-reduced-motion: reduce`.
- [ ] RNIB is expanded to "Royal National Institute of Blind People" on first use.
- [ ] Footer links carry descriptive `aria-label` attributes.
- [ ] The income grid carries `role="list"` and each income card carries `role="listitem"`.
- [ ] Value-card headings use h4.

### 7.2 Photo Brander (brand.html)

- [ ] Uploading a JPEG, PNG, WEBP, and GIF file each results in the photo being displayed in the editor.
- [ ] Changing the format selector updates the canvas dimensions and repositions the photo to fit.
- [ ] Dragging the photo on the canvas moves it; the zoom slider and mouse wheel change the scale; the rotation slider rotates it.
- [ ] Re-centre resets the photo position to centre; Fit to Frame resets scale and rotation to defaults.
- [ ] Typing overlay text renders it on the canvas; dragging the text block moves it independently of the photo.
- [ ] The contrast badge updates immediately when font colour, background colour, background opacity, or text size changes.
- [ ] The branding strip appears at the bottom of every output; it contains the LLBS logo on a white background with a blue accent line.
- [ ] Clicking Download saves a JPEG file with the `_llbs_branded.jpg` suffix.
- [ ] Clicking Start Over returns to the upload area and clears all state.
- [ ] The file upload area is keyboard-focusable and activatable by Enter or Space.
- [ ] All form controls (sliders, selects, text inputs, colour pickers) are reachable and operable by keyboard alone.
- [ ] The status element carries `aria-live="polite"` and `aria-atomic="true"`, and status messages use plain text.
- [ ] The canvas element carries an `aria-label` describing its current state.
- [ ] Decorative SVG icons carry `aria-hidden="true"` and `focusable="false"`.
- [ ] The focus indicator on form controls is fully opaque and meets WCAG 2.4.13 Focus Appearance.
- [ ] The spinner animation is suppressed on devices with `prefers-reduced-motion: reduce`.
- [ ] The LLBS logo is loaded from `assets/` and not from an external origin or CORS proxy.
- [ ] The page carries a skip link and a `<main>` landmark.
- [ ] The header logo uses `alt="Lincoln and Lindsey Blind Society logo"`.
