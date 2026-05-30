# LLBS Project: Reverse-Engineered Requirements

This document records the business analysis, user stories, and acceptance criteria for the Lincoln and Lindsey Blind Society (LLBS) Living Well Together Strategy site. The project predates the team and has no prior requirements documentation. Everything here was reverse-engineered from the source files on 2026-05-21.

## 1. Project overview

The LLBS repository contains two distinct deliverables in a single GitHub repository.

The first deliverable is `index.html`, a single-page public website that presents the LLBS Living Well Together Strategy 2025 to 2030 to a general audience of members, funders, volunteers, partner organisations, and the public. It is a read-only, information-only page with no forms, no accounts, and no interactive data entry.

The second deliverable is `brand.html`, a self-contained browser tool that lets LLBS staff and volunteers create branded social media images. A user uploads a photo, positions it, adds optional text, and downloads or shares the finished image. All processing happens inside the browser using the Canvas API; no image data is sent to a server.

Both files are static HTML. The stack is HTML, CSS, and JavaScript with no build step and no server. The repository is hosted on GitHub Pages.

## 2. Personal data

Neither deliverable processes personal data as defined by the UK General Data Protection Regulation (UK GDPR).

`index.html` displays no forms, collects no input, and sets no cookies. The external links to `llbs.co.uk`, the donation page, and the telephone and email contacts take the user away from this site; any data those destinations process is governed by LLBS's own privacy notice, not by this repository.

`brand.html` loads a photo into browser memory via a local object URL. The photo never leaves the device; it is not uploaded to any server. The LLBS logo is fetched from an external URL at `bd.llbs.co.uk` via a CORS (Cross-Origin Resource Sharing) proxy list, but no user data accompanies that request.

## 3. Target users

Three distinct user groups interact with the two deliverables.

### 3.1 Strategy page users (index.html)

- Members and service users of LLBS and their families and carers, including people who are severely sight-impaired and rely on screen readers such as JAWS and VoiceOver.
- Funders, commissioners, and statutory partners such as Lincolnshire County Council, Integrated Care Board commissioners, and NHS partners, who read the strategy to assess alignment with the Lincolnshire Joint Health and Wellbeing Strategy (JHWS).
- Volunteers, prospective volunteers, and partner organisations seeking to understand LLBS's direction and how to get involved.
- Members of the public in Greater Lincolnshire who may benefit from LLBS support and who need to learn what LLBS does.

### 3.2 Photo brander users (brand.html)

- LLBS staff and volunteers who produce social media content on behalf of LLBS. They need to create consistently branded images quickly, without specialist software, from a desktop or mobile browser.

## 4. Functional requirements: strategy page (index.html)

### 4.1 Content presentation

1. The page must present the full Living Well Together Strategy 2025 to 2030, including the introduction, who LLBS serves, the SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis, the vision and mission statements, the five organisational values, the four strategic themes with their starting points and intended 2030 outcomes, the strategy timeline, the income and sustainability targets, the alignment with the Lincolnshire JHWS, and the call to action for donors, volunteers, and partners.
2. The page must display key statistics accurately: 1,600 or more people currently supported; 16,000 square miles of rural communities served; 1 in 26 of the 42,000 visually impaired people in Greater Lincolnshire; and the RNIB (Royal National Institute of Blind People) projection of 52,000 by 2032.
3. The income targets must be presented as three figures: 9.3 percent annual growth to maintain current services, an additional 4 percent to fund the strategy, and approximately 13 percent total annual growth.

### 4.2 Navigation

4. The page must provide a sticky navigation header that links to each of the nine named sections: Introduction, Who We Are, Analysis, Vision and Values, Strategy, Themes, Income, Health Priorities, and Join Us.
5. The header must include the LLBS logo as a link to the main LLBS website at `llbs.co.uk`.
6. On viewports narrower than 820 CSS pixels, the navigation links must collapse behind a disclosed toggle button labelled "Menu".

### 4.3 Theme detail tabs

7. The Theme Detail section must present four tabs labelled Community, Transport, Wellbeing, and Future Ready.
8. Each tab panel must show the intended 2030 outcome, a member quote, and four route-boxes labelled Why, Intended Direction, Reason, and Routes to Outcome.
9. Only one tab panel must be visible at a time; the other three must be hidden from all users and assistive technologies.

### 4.4 Timeline

10. The strategy timeline must represent the four themes across five calendar years (2026 to 2030) as a visual bar chart table.
11. The bars must reflect the sequencing verified against the source PDF: Community active from full-2027 to mid-2028; Transport active from 2028 to mid-2029; Wellbeing active from 2029 to 2030; Future Ready active from 2026 to mid-2027.

### 4.5 Call to action

12. The Join Us section must provide four direct contact links: a link to the LLBS donation page, a link to the LLBS website, a telephone link to 01507 605604, and an email link to info@llbs.co.uk.

## 5. Functional requirements: photo brander (brand.html)

### 5.1 Image upload

1. The tool must accept image files by click-to-browse and by drag and drop. Accepted formats are JPEG, PNG, WEBP, and GIF.
2. On file selection the upload area must be replaced by an editor view.

### 5.2 Format selection

3. The user must be able to choose from four output formats: Instagram and Facebook square at 1080 by 1080 pixels, Story and Reel portrait at 1080 by 1920 pixels, Twitter and X landscape at 1600 by 900 pixels, and Facebook post at 1200 by 630 pixels.

### 5.3 Photo positioning and transform

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

12. The bottom 10 percent of the output image (with a minimum of 80 pixels and a maximum of 180 pixels) must be a white strip bearing the LLBS logo, with a blue line accent at the top of the strip in colour `#1a56db`.
13. The LLBS logo must be fetched from `bd.llbs.co.uk`. If that origin fails, the tool must try two CORS proxy services before rendering the strip without a logo rather than failing silently with no feedback.

### 5.6 Export

14. The user must be able to download the composed image as a JPEG file at 0.92 quality. The filename must follow the pattern `<originalname>_llbs_branded.jpg`.
15. On browsers that support the Web Share API, a Share Image button must invoke the native share sheet with the composed image, the title "LLBS Branded Photo", and attribution text.
16. A Start Over button must clear the canvas, hide the editor, and return to the upload area.

## 6. Non-functional requirements

### 6.1 Accessibility

1. Both pages must meet WCAG 2.2 AAA for all success criteria applicable to a static web page. This satisfies the UK Equality Act 2010, the European Accessibility Act, and Section 508 of the US Rehabilitation Act.
2. `index.html` must include a visible skip link that moves keyboard focus to the main content region when activated.
3. All interactive controls on both pages must be operable by keyboard alone, with a visible focus indicator of at least 3 CSS pixels.
4. The tab widget on `index.html` must implement the ARIA (Accessible Rich Internet Applications) tab pattern: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, and keyboard navigation using Arrow Left, Arrow Right, Home, and End.
5. All colour combinations on both pages must meet the WCAG 2.2 AAA contrast ratio: 7:1 for normal text, 4.5:1 for large text (18 point or 14 point bold).
6. `brand.html` must display a live WCAG contrast badge that reports the contrast ratio between the chosen font colour and background colour, and shows AA Pass, AAA Pass, AA Fail, or Not Applicable, updated in real time.
7. All images that convey information must have descriptive alternative text.
8. The mobile navigation toggle on `index.html` must use `aria-expanded` to communicate its open or closed state to screen readers.

### 6.2 Performance and compatibility

9. Both pages must load and be usable on a current release of Chrome, Edge, Firefox, and Safari.
10. Both pages must be responsive and usable on viewports from 320 CSS pixels wide to at least 1440 CSS pixels wide.
11. No server is required. Both pages must work as static files served from GitHub Pages.

### 6.3 Brand consistency

12. Both pages must use the LLBS primary colour palette: `#156082` primary teal-blue, `#042433` dark navy, `#0556A8` bright blue accent, and `#4EA72E` green.
13. `index.html` must use the DM Sans typeface loaded from Google Fonts. `brand.html` must offer DM Sans as a font option labelled "DM Sans (LLBS brand)".
14. The header style of `index.html` must match the style of the main LLBS website: white background, DM Sans, near-black link text.

### 6.4 Security

15. All JavaScript must run client-side. No user data, no image data, and no secrets must be sent to any server controlled by this project.
16. The LLBS logo URL in `brand.html` is loaded from an external origin. CORS proxy URLs must not be used to exfiltrate user data; the proxy calls carry only the logo URL, not user content.
17. No API keys or credentials must appear in the source code.

### 6.5 Maintainability

18. The CHANGELOG.md file must be updated to record all changes made after the team adopts the project.
19. The project wiki must be kept current as the team makes changes.

## 7. Acceptance criteria

### 7.1 Strategy page

- [ ] Navigating to the page with a screen reader, all nine section headings are announced in the correct reading order.
- [ ] A keyboard-only user can activate the skip link with Tab and reach the main content region without traversing the navigation.
- [ ] All nine navigation links scroll to the correct section on activation.
- [ ] On a viewport narrower than 820 pixels, the navigation links are hidden; activating the Menu button reveals them and sets `aria-expanded="true"`.
- [ ] The SWOT grid announces its four quadrants as labelled regions to a screen reader.
- [ ] The stats grid announces each card as a list item within a group labelled "Key statistics".
- [ ] The tabs widget: activating a tab shows its panel and hides the other three; pressing Arrow Right moves focus to the next tab; pressing Arrow Left moves focus to the previous tab; pressing Home moves to the first tab; pressing End moves to the last tab; the hidden panels have `hidden` attribute set.
- [ ] The timeline table has a visible caption (visually hidden is acceptable) that describes the data; each bar cell has an `aria-label` of "Active" or "Not active" or a date range.
- [ ] All text on a dark background has a contrast ratio of at least 7:1 (normal text) or 4.5:1 (large text), verified with axe-core and manual checks.
- [ ] The four contact links in the Join Us section open the correct destinations: donation page, llbs.co.uk, phone dialler, email client.
- [ ] The page loads and all content is visible without JavaScript enabled (progressive enhancement: the tab panels fall back to all visible).

Note: the current implementation hides non-active tab panels via JavaScript's `hidden` attribute and does not provide a CSS-only fallback. This is flagged as a known gap for Carol's accessibility audit.

### 7.2 Photo brander

- [ ] Uploading a JPEG, PNG, WEBP, and GIF file each results in the photo being displayed in the editor.
- [ ] Changing the format selector updates the canvas dimensions and repositions the photo to fit.
- [ ] Dragging the photo on the canvas moves it; the zoom slider and mouse wheel change the scale; the rotation slider rotates it.
- [ ] Re-centre resets the photo position to centre; Fit to Frame resets scale and rotation to defaults.
- [ ] Typing overlay text renders it on the canvas; dragging the text block moves it independently of the photo.
- [ ] The contrast badge updates immediately when the font colour, background colour, background opacity, or text size changes.
- [ ] The branding strip appears at the bottom of every output; it contains the LLBS logo on a white background with a blue accent line.
- [ ] Clicking Download saves a JPEG file with the `_llbs_branded.jpg` suffix.
- [ ] Clicking Start Over returns to the upload area and clears all state.
- [ ] All form controls (sliders, selects, text inputs, colour pickers) are reachable and operable by keyboard alone.
- [ ] The contrast badge region has `aria-live="polite"` so screen reader users hear updates without losing focus.

## 8. Open questions for Tim

The following questions require Tim's decision before the requirements can be considered complete. They are batched here for Sonja to put to Tim.

1. **Intended hosting URL.** The brief confirms the repository is `timdixon82/LLBS`. Is the page currently live at a GitHub Pages URL, or at a custom domain? Knowing the live URL is needed for Carol's accessibility audit and for the project wiki.

2. **Scope of brand.html.** Is `brand.html` intended for LLBS staff and volunteers only, or is it publicly accessible to anyone who finds the repository? This affects whether any access controls or guidance text are needed.

3. **No-JavaScript fallback for tabs.** The current tab implementation hides panels via JavaScript. If a user visits the page without JavaScript, all four theme panels collapse. Is this acceptable, or should the page degrade so that all four panels are visible without JavaScript?

4. **External CORS proxy dependency.** The photo brander uses two third-party CORS proxy services (`corsproxy.io` and `api.allorigins.win`) to load the LLBS logo. These are public, unauthenticated services with no uptime guarantees. Does LLBS or Tim have a preference to self-host the logo, serve it from a same-origin path, or accept the current proxy arrangement?

5. **CHANGELOG ownership.** The CHANGELOG currently records changes made before the team adopted the project. Should the team continue in the same file and format, or start a new section clearly marking team-era changes?

6. **PDF as part of the deliverable.** The PDF `LLBS Living Well Together Strategy 2025-2030.pdf` is in the repository. Is the PDF a static asset to keep in place, or is it excluded from the team's maintenance scope?
