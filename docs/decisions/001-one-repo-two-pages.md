# ADR 001: Treat LLBS as one repository holding two separate pages

## Status

Accepted. Recorded by Jacob (architect) on 2026-05-21 during work 005-llbs-setup. Tim confirmed the decision on 2026-05-21 (answer 8 in the consolidated question batch).

## Context

The LLBS repository holds two HTML pages that are different kinds of software.

`index.html` is a static brochure: the Living Well Together Strategy presented as a long read-only page. It has navigation, statistics, tables, a tabbed theme section, and contact links. Its only behaviour is a mobile navigation toggle and keyboard handling for the tab component. It collects no input and sends nothing anywhere.

`brand.html` is the LLBS Photo Brander, a client-side application. The user uploads a photo, the application composites it with the LLBS logo and overlay text on an HTML canvas, and the user shares or downloads the branded result. It reads a file the user chooses, fetches a remote logo image, and uses the browser Web Share API. It has about 680 lines of JavaScript and a real, stateful interaction model.

These two pages share a brand and a sponsoring organisation, but they share almost nothing technically. They have different audiences, different behaviour, different dependencies, and different security surfaces. The repository was assembled before the team existed and the pairing had never been reviewed.

## Decision

Keep both pages in the one `timdixon82/LLBS` repository and adopt them together. Do not split the repository.

Two reasons for this. First, the adoption work is a backfill of reviews and repository configuration, not a restructuring project. Splitting a repository is a larger, separate piece of work. Second, the two pages share real things: the LLBS brand, the colour palette, the logo, and the DM Sans typeface.

However, the team must treat them as two distinct pages inside the one repository, each reviewed, configured, and tested in its own right. Specifically:

- Each page gets its own Content Security Policy (CSP), because their needs differ. See ADR 004.
- Each page is split into its own HTML, CSS, and JavaScript files. See ADR 002.
- Accessibility and security reviews must cover both pages separately.

## Alternatives considered

**Split into two repositories now.** Rejected for this adoption work. Two repositories would give each page its own clean history and its own release line, which is architecturally cleaner. The two pages share so little technically that separate repositories would be the right long-term outcome. It is rejected here only because splitting a repository is a deliberate restructuring task, not adoption housekeeping. Tim confirmed (answer 8) that the repository stays as one.

**Treat the repository as one page and review it as a whole.** Rejected. This is the wrong mental model. A single CSP scoped to both pages would have to be as wide as the more permissive page needs, which would needlessly weaken the brochure page. Treating `brand.html` as more of the same would miss that it is an interactive application with its own accessibility surface.

**Drop the photo brander from the project.** Rejected and not the team's call. `brand.html` is a working tool that LLBS may rely on. Removing it is a product decision for Tim and for LLBS, not an architecture decision.

## Consequences

- The adoption proceeds on one repository, but every subsequent record and review treats `index.html` and `brand.html` as two distinct pages.
- `brand.html` carries the larger share of review effort: it is an application, its dependency posture is the weakest part of the project, and its accessibility was unreviewed before the team adopted the project.
- The README must be rewritten so it states plainly that the repository holds two pages and what each one does.
