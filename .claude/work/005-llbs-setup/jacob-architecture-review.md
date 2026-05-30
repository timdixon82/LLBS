# LLBS Architecture Review

This is the backfilled architecture review for the LLBS project, work folder 005-llbs-setup. LLBS, the Living Well Together Strategy, is a static front-end project being adopted by the team. The project predates the team, so it has had no architecture review until now. This document records that review and the Architecture Decision Records that follow from it.

The review is read-only. It does not change the LLBS repository. It assesses the project against the team's static front-end stack standard in the global wiki at `docs/stacks/static-front-end.md` and the stack-independent standards in `docs/coding-standards.md`.

## Scope of the review

The repository at `timdixon82/LLBS` holds five things:

- `index.html`, about 55 kilobytes, the Living Well Together Strategy brochure page.
- `brand.html`, about 39 kilobytes, an interactive tool called the LLBS Photo Brander.
- `CHANGELOG.md`, a hand-written change log for the strategy page.
- `LLBS Living Well Together Strategy 2025-2030.pdf`, the source strategy document.
- `README.md`, a two-line placeholder.

The review covers the architecture of the two HTML files, the project's file structure, whether it needs a build step, how it is hosted and how it meets the security-header standard, and what it depends on.

The single most important finding sits at the front of this review, because every other decision depends on it: the repository contains two different kinds of software, not one. `index.html` is a static brochure page, the same kind of thing as the team's Periodic-Table and Clock-Practice projects. `brand.html` is a client-side interactive application that uploads a user's photo, composites it on a canvas, calls public third-party proxy services, and shares or downloads the result. The two have different risk profiles and different architectural needs. They must not be reviewed as one page. Architecture Decision Record 001 addresses this directly.

## How LLBS compares with Periodic-Table and Clock-Practice

The team has just adopted two similar static sites. Their architecture reviews are a useful baseline, and LLBS is mostly the same shape, with two clear differences.

The similarities: all three are static front-end projects hosted on GitHub Pages with no server. All three were adopted as single-file pages with structure, presentation, and behaviour in one file. All three meet the recurring file-split decision and the GitHub Pages security-header pattern.

The two differences that make LLBS its own case:

1. LLBS is two pages, not one, and the second page is a genuine application with its own dependencies and its own risk surface. Periodic-Table and Clock-Practice were each a single self-contained page. This is why LLBS needs an Architecture Decision Record that neither of those projects needed: a record on whether the two pages belong in one project at all.
2. `brand.html` loads code paths and data across third-party origins: it fetches the LLBS logo from an external WordPress site, and when that fetch is blocked it routes the request through public proxy services, `corsproxy.io` and `allorigins.win`. Periodic-Table loads fonts from Google; Clock-Practice loads nothing third-party at all. A public proxy is a heavier and riskier dependency than a font service, and the dependency-posture decision below treats it as a priority to remove.

## Assessment against the static front-end standard

The static front-end stack standard sets the bar. LLBS meets some of it and misses some of it.

### Project structure

The standard says: "Keep structure (HTML), presentation (CSS), and behaviour (JavaScript) separate." Both `index.html` and `brand.html` fail this. Each file holds the page structure, a large inline `<style>` block, and a large inline `<script>` block together. `index.html` has about 720 lines of CSS and a short script of about 40 lines. `brand.html` has about 325 lines of CSS and about 680 lines of JavaScript. Architecture Decision Record 002 records the file-split decision.

The standard also says: "A clear entry point, `index.html`, with source organised by feature." The project has a clear `index.html` entry point, which is correct.

### Language and tooling

The standard says a small project needs no build step. Both files are served exactly as written, with no compile or bundle step. This is correct and Architecture Decision Record 003 confirms it.

The standard says to lint the HTML, CSS, and JavaScript in continuous integration. The project has no continuous integration and no lint configuration today. Adding the team's standard lint and accessibility workflow is repository-configuration work for Sean, on the project-setup branch. It is noted here so it is not lost; it is not itself an architecture decision.

### Hosting and security

The project is hosted on GitHub Pages. The standard requires a set of security response headers, and GitHub Pages cannot send custom headers. This is the same constraint Periodic-Table and Clock-Practice met, and Architecture Decision Record 004 records the same pattern, with one important addition for `brand.html`: that page does real work and has a real Content-Security-Policy to design, including the third-party origins it currently needs.

### Dependency posture

`index.html` loads web fonts from Google Fonts. `brand.html` loads the LLBS logo from an external site and falls back to public CORS proxy services. Neither file uses a third-party JavaScript framework or library; all behaviour is the project's own code. Architecture Decision Record 005 records the dependency posture and what must change.

## Architecture Decision Record 001: Treat LLBS as one repository holding two separate pages

### Status

Proposed. Recorded by Jacob, architect, on 2026-05-21, during work 005-llbs-setup. One part needs a decision from Tim; see the question at the end of this record.

### Context

The LLBS repository holds two HTML pages that are different kinds of software.

`index.html` is a static brochure: the Living Well Together Strategy presented as a long read-only page. It has navigation, statistics, tables, a tabbed theme section, and contact links. Its only behaviour is a mobile navigation toggle and the keyboard handling for the tab component. It collects no input and sends nothing anywhere. Its risk profile is the same as Periodic-Table and Clock-Practice.

`brand.html` is the LLBS Photo Brander, a client-side application. The user uploads a photo, the application composites it with the LLBS logo and overlay text on an HTML canvas, and the user shares or downloads the branded result. It reads a file the user chooses, fetches a remote logo image, calls public proxy services when the direct fetch fails, and uses the browser Web Share interface. It has about 680 lines of JavaScript and a real, stateful interaction model.

These two pages share a brand and a sponsoring organisation, but they share almost nothing technically. They have different audiences, different behaviour, different dependencies, and different security surfaces. The repository was assembled before the team existed, and the pairing has never been reviewed.

This record decides how the team should treat the two pages: as one project, or as two.

### Decision

For the adoption work, work 005, keep both pages in the one `timdixon82/LLBS` repository and adopt them together. Do not split the repository as part of this work.

Two reasons. First, the adoption work is a backfill of reviews and repository configuration, not a restructuring project; splitting a repository is a larger, separate piece of work that should be scoped on its own. Second, the two pages do share a real thing: the LLBS brand, the colour palette, the logo, and the DM Sans typeface. A future shared design system, or a shared stylesheet, is a plausible reason to keep them in one repository.

But the team must treat them as two distinct pages inside that one repository, each reviewed, configured, and tested in its own right. Concretely:

- Each page gets its own Content-Security-Policy, because their needs differ. `index.html` can have a tight policy. `brand.html` needs a wider one for the proxy origins it currently uses; see Architecture Decision Record 004 and Architecture Decision Record 005.
- Each page is split into its own HTML, CSS, and JavaScript files, in its own folder, so the two do not share or collide. See Architecture Decision Record 002.
- Carol's accessibility audit and Jed's code review must cover both pages. `brand.html` is the harder of the two: it is an interactive application with file upload, drag interaction, and canvas drawing, and its accessibility has not been checked at all. The brochure page `index.html` already shows accessibility care, with a skip link, ARIA tab roles, table captions, and visually-hidden helpers; `brand.html` shows much less, for example range sliders and colour inputs whose live values are not clearly announced, and a canvas-only drag interaction with no keyboard equivalent. This review flags the gap for Carol and Simon; it is not an architecture fix.

The README must also be rewritten. A two-line placeholder does not tell a reader the repository holds two separate pages. Tad's documentation work should make the two pages, and their separate purposes, explicit.

### Alternatives considered

#### Split into two repositories now

Rejected for this work, and recommended as a question for Tim for later. Two repositories, one for the strategy page and one for the photo brander, would give each page its own clean history, its own GitHub Pages site, its own issue list, and its own release line. This is architecturally the cleaner outcome, because the two pages have so little in common. It is rejected for this work only because splitting a repository is a deliberate restructuring task, not adoption housekeeping, and because the shared brand assets are a real reason one might keep them together. The choice is Tim's, and it is put to him in the question below.

#### Treat the repository as one page and review it as a whole

Rejected. This is the wrong mental model and would produce a wrong review. A single Content-Security-Policy across both pages would have to be as wide as the most permissive page needs, which would needlessly weaken the brochure page. A single accessibility pass that treated `brand.html` as "more of the same" would miss that it is an interactive application with its own, unreviewed accessibility surface. The two pages must be reviewed as two.

#### Drop the photo brander from the project

Rejected, and not the team's call. `brand.html` is a working tool that LLBS may rely on. Removing it is a product decision for Tim and for LLBS, not an architecture decision. If it is kept, it must be brought up to the team's standard like any other page; if Tim decides it is not wanted, that is recorded separately.

### Consequences

- The adoption work proceeds on the one repository, but every later record in this review treats `index.html` and `brand.html` as two distinct pages.
- `brand.html` carries the larger share of the review effort: it is an application, its dependency posture is the weakest part of the project, and its accessibility is unreviewed.
- Tad rewrites the README so it states plainly that the repository holds two pages and what each one is for.
- Whether the repository should later be split into two is a question for Tim, recorded below. If Tim chooses to split, that becomes its own piece of work with its own architecture record.

### Question for Tim

This is question 1 in the batch at the end of this review.

## Architecture Decision Record 002: Split each page into separate HTML, CSS, and JavaScript files

### Status

Proposed. Recorded by Jacob, architect, on 2026-05-21, during work 005-llbs-setup. The recommendation to schedule the split as follow-up work is a question for Tim; see the question at the end of this review.

### Context

Both pages in the repository hold structure, presentation, and behaviour in one file.

`index.html` is about 55 kilobytes. Its `<head>` carries an inline `<style>` block of roughly 720 lines, and the end of the `<body>` carries an inline `<script>` block of roughly 40 lines holding the mobile navigation toggle and the tab keyboard handler.

`brand.html` is about 39 kilobytes. Its `<head>` carries an inline `<style>` block of roughly 325 lines, and the end of the `<body>` carries an inline `<script>` block of roughly 680 lines: the whole Photo Brander application, including configuration, canvas drawing, colour and contrast helpers, file handling, pointer-drag handling, and the share and download logic.

The static front-end stack standard says, under "Project structure": "Keep structure (HTML), presentation (CSS), and behaviour (JavaScript) separate." Read plainly, that asks for separate files. Neither page meets it. This is the same gap the team found and recorded in Periodic-Table's Architecture Decision Record 001 and Clock-Practice's Architecture Decision Record 001.

This record decides what to do about the gap. It also decides whether the single 55-kilobyte `index.html` is the right size, and whether `brand.html` should be a separate file from `index.html` or consolidated with it.

### Decision

Three decisions, taken together.

First, on `brand.html` versus `index.html`: keep them as two separate pages, never consolidate them into one file. They are two different kinds of software with two different audiences (see Architecture Decision Record 001). A reader looking for the strategy should not have to load, or scroll past, a photo-editing application, and a person using the photo tool should not carry the weight of the strategy page. Two pages is correct. The question is not whether to merge them; it is how each one is structured internally.

Second, on the structure of each page: each page should be split from one file into separate HTML, CSS, and JavaScript files. The target layout, with file names in the team's kebab-case standard, is:

- `index.html`, the strategy page structure only, linking its stylesheet and script.
- `css/strategy.css`, the strategy page presentation, moved out of its inline `<style>` block.
- `js/strategy.js`, the strategy page behaviour, the navigation toggle and tab handler, moved out of its inline `<script>` block.
- `brand.html`, the Photo Brander page structure only, linking its stylesheet and script.
- `css/brand.css`, the Photo Brander presentation.
- `js/brand.js`, the Photo Brander application code.

The two pages keep their own CSS and JavaScript files; they do not share a stylesheet today, because their visual designs are different. If a shared brand layer is wanted later, that is a design decision for Simon and a later architecture record, not part of this split.

Third, on the 55-kilobyte size of `index.html`: the size is not itself a problem, and the page does not need to be broken into multiple pages or content fragments. 55 kilobytes is a single long brochure page, and a long brochure page is a reasonable thing to be one HTML document. The size is large mostly because of the inline CSS; once the roughly 720 lines of CSS move to `css/strategy.css`, the HTML file itself becomes far smaller and easier to read with a screen reader. The right fix for the size is the concern-split above, not pagination. The HTML should also have its many inline `style` attributes moved into the stylesheet as part of the same work; `index.html` currently sets layout and colour through dozens of inline `style` attributes, which both defeats the split and forces the Content-Security-Policy to allow inline styles.

Like the same decision in the other two projects, this split is a refactor only. It must not change either page's behaviour, appearance, or accessibility. The HTML, CSS, and JavaScript move to new files unchanged in content, except that inline `style` attributes are converted to classes in the stylesheet, which is a mechanical change with no visible effect.

For the adoption work, work 005, do not perform the split. Adoption is a backfill of reviews and configuration; the split is a refactor that moves every line and would make the security and code reviews harder to trace against the page the team actually adopted. Review first, then split as named follow-up work. This is the same sequencing the team chose for Clock-Practice.

### Alternatives considered

#### Keep both pages as single files permanently

Rejected. A single file is acceptable for a quick demo, but LLBS is now a maintained team project. The standard asks for separated concerns for good reasons that apply here: the browser can cache a stylesheet and a script separately from the HTML; a presentation change and a behaviour change land in separate diffs; and a separate `.css` file and `.js` file can be linted by the standard tools without first being extracted from the HTML. For `brand.html` the case is even stronger, because 680 lines of application JavaScript embedded in an HTML file is genuinely hard to navigate, hard to lint, and hard to review. Carrying a permanent standards exception is worse than doing the refactor once.

#### Split `index.html` into several smaller pages

Rejected. The strategy is one document with a single reading order and an in-page navigation menu that jumps between its sections. Breaking it into several pages would break that single-page navigation, add page loads between sections, and complicate the screen-reader reading experience for no gain. The 55-kilobyte size is addressed by moving the CSS out, not by pagination.

#### Consolidate `brand.html` into `index.html` as one combined page

Rejected, firmly. The two pages have different audiences and different risk surfaces. Combining them would force one Content-Security-Policy wide enough for the photo tool onto the brochure page, would make the brochure page load an application its readers do not need, and would mix a read-only document with a stateful tool in one file. They must stay separate pages.

#### Split the JavaScript further into feature modules now

Rejected as premature for `index.html`, whose script is about 40 lines, and reasonable but not required for `brand.html`. The standard says "source organised by feature", and `brand.html` is large enough that splitting `js/brand.js` into, for example, a canvas-drawing module, a contrast module, and a file-and-share module would be defensible. But that is a refinement that can follow the first split, and the team's principle is to prefer the simple solution and add structure when a real need arrives. The first split, into one HTML, one CSS, and one JavaScript file per page, is the decision here. A further module split for `brand.js` can be revisited once the page is in separate files and the team has lived with it.

### Consequences

- For work 005, the project carries one known, recorded gap against the stack standard: structure, presentation, and behaviour are not in separate files, on either page. This record is the documentation of that gap. Gerrie and Jed review the two pages as they stand and do not treat the layout itself as a defect to fix inside this work.
- A follow-up piece of work should split both pages, producing `index.html` with `css/strategy.css` and `js/strategy.js`, and `brand.html` with `css/brand.css` and `js/brand.js`. That work is a `refactor` change and must not alter behaviour, appearance, or accessibility.
- The split is a precondition for the tighter Content-Security-Policy in Architecture Decision Record 004. Until the split, both pages need `'unsafe-inline'` for script and style, which weakens their policies.
- The palette comment block at the top of the `index.html` `<style>` block, which records the colours extracted from the source PDF, is valuable design documentation. When the CSS moves to `css/strategy.css`, that comment must move with it, not be dropped. The same applies to the section-divider comments in `brand.html`.
- Whether to schedule the split as the next piece of work is a question for Tim, recorded below. It is question 2 in the batch.

## Architecture Decision Record 003: No build step

### Status

Accepted. Recorded by Jacob, architect, on 2026-05-21, during work 005-llbs-setup.

### Context

LLBS is a static front-end project. Both pages are served exactly as written: the browser receives the same `index.html` and `brand.html` that live in the repository. There is no compile, no bundle, no transform, and no generated output.

The static front-end stack standard says, under "Language and tooling": "A small project needs no build step. A larger one may use a light bundler such as Vite." This record decides whether LLBS needs a build step.

### Decision

LLBS has no build step. The repository source is the deployed site.

This holds whether the pages stay as single files or are later split into separate HTML, CSS, and JavaScript files per Architecture Decision Record 002. Separate plain files are still served directly with no build step. Both pages are written in standards-based HTML, modern CSS, and modern JavaScript, all of which a modern browser runs directly. `brand.html` is the larger and more complex page, but its roughly 680 lines of JavaScript are still plain browser JavaScript with no package imports and nothing that needs transforming.

A build step would only be needed if the project later took on something that must be transformed before a browser can use it: a JavaScript package installed from a package registry, a CSS pre-processor, a framework, or a module bundler made necessary by splitting `brand.js` into many modules. The named trigger for revisiting this decision is any of those. The expected choice, if a build step is ever needed, is a light bundler such as Vite.

### Alternatives considered

#### Add a light bundler such as Vite now

Rejected. A bundler earns its place when a project has many source modules to combine, third-party packages to resolve, or assets to transform. LLBS has none of these today. Even after the file split, it is two pages, each with one HTML, one CSS, and one JavaScript file, and no packages installed from a registry. Adding a bundler would add a `node_modules` folder, a lockfile, and a build command, all of which are then things to keep updated and secure, for no gain the project can use today.

#### Add a build step only to minify the output

Rejected. Minifying would shave a few kilobytes off two pages that together are under 100 kilobytes of source. The saving is small, and it comes at the cost of a build step and a gap between the source the team reviews and the file the browser runs. For pages this size the cost is not repaid. If the assets ever grow large enough for size to matter, revisit this.

### Consequences

- No build step means no build to break, no build dependencies to patch, and nothing between the repository and the browser. What the team reviews is exactly what is served, which keeps the security and code reviews honest.
- The continuous integration pipeline still runs lint and accessibility checks, as the stack standard requires, but it has nothing to compile. Continuous integration validates the source; it does not produce a separate artefact.
- GitHub Pages serves the repository content directly, with no GitHub Actions build job in between. See Architecture Decision Record 004.
- This decision is tied to the dependency posture in Architecture Decision Record 005. If LLBS ever adopts a dependency that must be installed and bundled, this no-build-step decision must be revisited at the same time.

## Architecture Decision Record 004: GitHub Pages hosting and the security-header constraint

### Status

Accepted. Recorded by Jacob, architect, on 2026-05-21, during work 005-llbs-setup. The Content-Security-Policy values are proposed and depend on the file split in Architecture Decision Record 002 and on the dependency changes in Architecture Decision Record 005.

### Context

LLBS is hosted on GitHub Pages, served from the public `timdixon82/LLBS` repository. This matches the global wiki's foundations decision: GitHub Pages is the standard host for static projects, and a GitHub Pages site is served from a public repository.

The team's coding standard requires a set of security response headers on every site: Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, and Permissions-Policy. The stack standard says to set these headers through the hosting configuration.

GitHub Pages has a hard limit here, the same one Periodic-Table and Clock-Practice met: it does not let the site owner set custom HyperText Transfer Protocol response headers. GitHub Pages does send Strict-Transport-Security once "Enforce HTTPS" is enabled, and sends X-Content-Type-Options: nosniff by default. The rest cannot be set as real headers.

This record decides how LLBS meets the security-header standard within that limit. LLBS differs from the earlier two projects in one way that matters: `brand.html` is an interactive application that loads cross-origin resources, so its Content-Security-Policy is a real piece of design, not a near-empty `'self'` policy.

### Decision

#### Hosting

Confirm GitHub Pages as the host, with "Enforce HTTPS" enabled. This is the standard static-project host and needs no change. The work brief and Sonja should confirm "Enforce HTTPS" is enabled on the repository, as it was for the earlier projects; if it is not yet on, enabling it is repository configuration for the setup branch.

#### Security headers, given the GitHub Pages limit

Because GitHub Pages cannot send custom response headers, LLBS meets the security-header standard as far as a static site on this host can, the same pattern recorded for Periodic-Table and Clock-Practice:

1. Content-Security-Policy is delivered through a `<meta http-equiv="Content-Security-Policy">` tag in the `<head>` of each page. A meta-tag policy is honoured by browsers and is the only delivery route available on GitHub Pages. Its known limits are that it cannot use the `frame-ancestors` directive, the `report-uri` or `report-to` directives, or the sandbox directive. The meta tag must be the first element in the `<head>` after `<meta charset>`, so the policy is in force before any script or style is parsed. Each page gets its own meta-tag policy; the two pages do not share one.

2. Strict-Transport-Security is sent by GitHub Pages once "Enforce HTTPS" is on. No project action is needed beyond keeping that setting on. Note that the hard deny-list forbids changing repository security settings, so this stays on.

3. X-Content-Type-Options is sent by GitHub Pages by default as `nosniff`. No project action is needed.

4. Referrer-Policy is delivered through a `<meta name="referrer">` tag in the `<head>`, set to `strict-origin-when-cross-origin`, the well-supported way to set a referrer policy from a page.

5. X-Frame-Options and Permissions-Policy cannot be set on GitHub Pages and have no reliable meta-tag equivalent. The defence against framing, the `frame-ancestors` directive, cannot be carried by a meta-tag policy. This leaves a residual gap: clickjacking protection and browser-feature lock-down are not enforced by headers on this host.

6. The residual gap is accepted as a documented security exception, not a defect, and recorded by Gerrie in the project wiki's `exceptions/` folder for Tim's approval. The reasoning differs slightly between the two pages, and Gerrie should record them as two assessments:

   - For `index.html`: the brochure page has no login, no form that posts anywhere, no personal data, and no cookies. The realistic harm from a missing X-Frame-Options on a page like this is low, the same finding as Periodic-Table and Clock-Practice.
   - For `brand.html`: this page does more. It is still low risk for clickjacking, because it has no login and no server-side action and processes the user's photo entirely in the browser, but it is not as plainly harmless as the brochure page. Gerrie should assess the clickjacking exception for `brand.html` specifically, considering whether a small framing-buster script is worth adding given that the page invites a user to upload a personal photo. This review's recommendation is that the exception is acceptable but should be reviewed by Gerrie rather than assumed.

#### Content-Security-Policy values

Each page gets its own policy, as strict as that page allows.

For `index.html`, the strategy page:

- Target policy, after the file split in Architecture Decision Record 002 and the font change in Architecture Decision Record 005:
  `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`
- The page currently loads the LLBS logo image from `www.llbs.co.uk` and web fonts from Google Fonts. Until those are self-hosted, `img-src` must also allow `https://www.llbs.co.uk`, and `style-src` and `font-src` must allow the Google Fonts origins. Architecture Decision Record 005 recommends self-hosting both, which lets the policy reduce to `'self'`.
- Interim policy, while the page is still a single file: the same policy but with `script-src 'self' 'unsafe-inline'` and `style-src 'self' 'unsafe-inline'`, because a single-file page has its script and style inline, and `index.html` also uses many inline `style` attributes. `'unsafe-inline'` weakens the policy; removing it is one of the reasons Architecture Decision Record 002 recommends the split, including the conversion of inline `style` attributes to classes.

For `brand.html`, the Photo Brander:

- This page is harder. It must allow what the application genuinely does:
  - `img-src` must allow `'self'`, `data:`, and `blob:`, because the page loads a user-chosen photo as an object URL (a `blob:` URL), loads the logo image, and the canvas work produces image data.
  - `connect-src` must allow the origins the page fetches the logo from. Today that is the external WordPress origin and, on fallback, the two public proxy origins `corsproxy.io` and `allorigins.win`. This is the weakest point of the policy and is the subject of Architecture Decision Record 005.
  - `script-src` and `style-src` should reach `'self'` after the file split; until then they need `'unsafe-inline'`.
- The exact `brand.html` policy cannot be finalised until Architecture Decision Record 005 is resolved, because the policy must list exactly the origins the page is allowed to contact, and the recommendation there is to remove the proxy origins entirely. The interim policy, while the proxies are still in use, must list them; the target policy, once the logo is self-hosted, removes them and `connect-src` can reduce to `'self'`.

The exact policy for each page must be tested in a real browser before release, because a Content-Security-Policy that is too strict will silently break the page. For `brand.html` the canvas, the object URL, and the logo fetch are the parts most likely to break under a strict policy. Carol and Jed verify both pages under their policies.

### Alternatives considered

#### Move hosting to a host that can set response headers, such as Netlify or Cloudflare Pages

Considered, and rejected for this work, for the same reasons recorded in the Periodic-Table and Clock-Practice records: the foundations decision sets GitHub Pages as the standard static host, the project already runs there, and the cost of a new platform and a deployment path is not repaid for pages of this risk profile. It remains the right answer if LLBS later needs the full header set, and the case is slightly stronger here than for the earlier projects, because `brand.html` handles a user's photo. If `brand.html` grows toward handling anything more sensitive, revisit the host then.

#### Put a content delivery network in front of GitHub Pages to inject headers

Rejected. A content delivery network in front of the Pages site could add the missing headers, but it adds a second platform to configure and maintain and a custom domain to manage. For pages of this risk profile that is disproportionate.

#### Use one shared Content-Security-Policy for both pages

Rejected. A shared policy would have to be as wide as `brand.html` needs, which would needlessly weaken `index.html`. Each page carries its own meta-tag policy, scoped to what that page actually does. This is a direct consequence of Architecture Decision Record 001.

### Consequences

- Each page carries its own `<meta http-equiv="Content-Security-Policy">` tag and a `<meta name="referrer">` tag, placed first in the `<head>` after `<meta charset>`. Adding them is a small content change for Sean on the setup branch.
- The project has documented security exceptions for the response headers GitHub Pages cannot send. Gerrie records them in the project wiki's `exceptions/` folder, with a separate short assessment for `brand.html` given its photo upload. Tim approves them.
- The strict target policies depend on the file split in Architecture Decision Record 002 and, for `brand.html`, on the dependency changes in Architecture Decision Record 005. Until then the pages use interim policies with `'unsafe-inline'` and, for `brand.html`, the proxy origins listed in `connect-src`.
- "Enforce HTTPS" must stay on. The hard deny-list forbids changing repository security settings, so it will.
- Both pages must be tested in a real browser under their policies before release. `brand.html` is the more fragile and must be exercised through a full upload-edit-share cycle.

## Architecture Decision Record 005: Dependency posture, and removing the public CORS proxies

### Status

Proposed. Recorded by Jacob, architect, on 2026-05-21, during work 005-llbs-setup. The recommendations are firm; one part, how urgently the proxy removal is scheduled, is a question for Tim, recorded below.

### Context

The static front-end stack standard sets two dependency rules: "Keep dependencies few. Every dependency is something to keep updated and secure", and "Load a third-party script only when genuinely needed, and pin it with Subresource Integrity." This record records what each LLBS page depends on today and the standard the project should follow.

#### What `index.html` depends on

`index.html` has no third-party JavaScript library; all behaviour is the project's own code. It has two external resources:

- Web fonts from Google Fonts. The `<head>` has `<link rel="preconnect">` tags to `fonts.googleapis.com` and `fonts.gstatic.com` and a `<link rel="stylesheet">` pulling in the DM Sans family. This is the same dependency Periodic-Table has.
- The LLBS logo image, loaded with an `<img>` tag from `https://www.llbs.co.uk/wp-content/uploads/2023/05/LLBS-logo-with-text.png`, an external WordPress site.

#### What `brand.html` depends on

`brand.html` also has no third-party JavaScript library; the whole Photo Brander is the project's own code. But its external-resource posture is the weakest part of the entire project, and the reason this record is a priority:

- The LLBS logo is loaded from a different external WordPress origin, `https://bd.llbs.co.uk/wp-content/uploads/2024/02/LLBS-logo-with-text-300x83-1.webp`.
- The application needs that logo with cross-origin pixel access, because it draws the logo onto a canvas and then exports the canvas as an image. A canvas tainted by a cross-origin image cannot be exported. To get clean cross-origin access, the code defines `CORS_PROXIES`, a list of public proxy services, and tries each in turn: first `corsproxy.io`, then `api.allorigins.win`, then the direct URL. The logo image URL is sent to whichever proxy answers, and that proxy fetches the image and returns it with permissive cross-origin headers.

Public CORS proxies are a real architectural and security concern, not a cosmetic one:

- They are an uncontrolled third-party dependency. `corsproxy.io` and `allorigins.win` are services the project does not own, does not pay for, and cannot rely on. Either can change its behaviour, rate-limit the project, start charging, or disappear, and the photo tool's branding strip would silently lose its logo.
- They cannot be pinned with Subresource Integrity. The standard says to pin third-party resources; a proxy response is generated per request and has no fixed hash, so the rule cannot be applied.
- They are a supply-chain weak point. The proxy sits in the middle of fetching the logo. A compromised or malicious proxy could return a different image. Today the only thing routed through the proxy is a public logo URL, so the exposure is limited, but the pattern is the concern: it normalises routing the application's fetches through an unaudited third party.
- The fallback list includes `url => url`, the direct URL, as the last option. If both proxies fail, the code falls back to a direct fetch, which will usually produce a canvas the browser marks as tainted, so the share and download would then fail for the logo. The fallback chain is fragile.

This is a clear OWASP "software and data integrity failures" and "vulnerable and outdated components" concern, and Gerrie and Jed should both treat it as a named item.

### Decision

#### `index.html`: self-host the fonts and the logo

`index.html` should self-host the DM Sans web font and the LLBS logo image rather than load them from third-party origins.

- The DM Sans font files should be downloaded, their licence confirmed (DM Sans is published under the SIL Open Font License, which permits self-hosting and redistribution), committed to the repository under an `assets/fonts/` folder, and referenced from `css/strategy.css` with `@font-face` rules. This removes the runtime dependency on Google, removes a request that shares the visitor's internet address with a third party, and lets the Content-Security-Policy reduce `style-src` and `font-src` to `'self'`. This is the same recommendation the team made for Periodic-Table.
- The LLBS logo should be downloaded and committed to the repository under an `assets/` folder, and referenced with a relative path. Loading it from the live `www.llbs.co.uk` site means the strategy page depends on that separate site staying up and not moving the file, and it cannot be integrity-checked. A committed copy is a fixed, version-controlled asset served from the project's own origin.

#### `brand.html`: remove the public CORS proxies by self-hosting the logo

This is the priority recommendation of this record. `brand.html` should stop using public CORS proxies entirely. The way to do that is to remove the remote logo fetch: commit the LLBS logo into the repository as a project asset and load it with a relative URL from the same origin as the page.

An image loaded same-origin is not a cross-origin resource at all. It does not taint the canvas, so it needs no `crossorigin` attribute, no cross-origin headers, and no proxy. The entire `CORS_PROXIES` list, the `loadLogoWithFallback` function, and the proxy fallback logic can then be deleted. The application becomes simpler, more reliable, and free of an uncontrolled third-party dependency, and its Content-Security-Policy `connect-src` can reduce to `'self'`.

This is both a security improvement and a reliability improvement, and it removes code rather than adding it, so it is consistent with the team's "prefer the simple solution" and "leave no dead code" principles. It should be done as part of, or immediately after, the file split in Architecture Decision Record 002, and it is the single most important change this review recommends for `brand.html`.

Until the logo is self-hosted, the proxy origins are a documented third-party dependency in this record and must be listed in the `brand.html` Content-Security-Policy `connect-src` (see Architecture Decision Record 004), and the residual integrity risk is a security exception for Gerrie to assess. Self-hosting removes the question entirely, which is why it is the recommended path and not merely an option.

One licensing note: the LLBS logo is the property of Lincoln and Lindsey Blind Society. Committing it to the repository is almost certainly fine, because the repository is LLBS's own and the logo is used to brand LLBS's own content, but Sonja should confirm with Tim that LLBS is content for the logo file to live in the public `timdixon82/LLBS` repository. The repository is public because GitHub Pages requires it. This is question 3 in the batch below.

#### Standard for any future dependency

If either page ever adds a third-party script or stylesheet, it follows the team's standard rules: add it only when the need is genuine and the project's own code cannot reasonably do the job; prefer a self-hosted copy committed to the repository over a copy loaded from a third-party origin; if a resource must be loaded from a third-party origin, pin it with Subresource Integrity and a `crossorigin` attribute, pinning a specific version, never a floating one; and record every third-party dependency in this record so the project keeps an inventory, as the OWASP guidance on vulnerable and outdated components requires.

The project has no package manifest, so Dependabot has nothing to track here. Keeping the dependency inventory in this record is the project's substitute for an automated dependency list.

### Alternatives considered

#### Keep loading the logo from the LLBS WordPress site, and keep the proxies

Rejected. It leaves `brand.html` depending on two public proxy services the project does not control and cannot integrity-check, and it leaves both pages depending on the live LLBS WordPress site for an image. Self-hosting the logo removes all of that at a small one-time cost: download one image, commit it, change the source path.

#### Keep the remote logo but replace the public proxies with a project-owned proxy

Rejected as disproportionate. A small proxy the project controls, for example a serverless function, would be more trustworthy than a public proxy. But it adds a server-side component, a deployment, and something to keep patched, to a project that is otherwise purely static with no server. That contradicts the no-build-step and static-hosting decisions. Self-hosting the logo image needs no server at all and is strictly simpler.

#### Set the logo `<img>` `crossorigin` attribute and rely on the WordPress site sending cross-origin headers

Rejected as not reliable and not the project's to control. The cross-origin headers would have to be sent by the LLBS WordPress site, which the project does not configure and which could change. A self-hosted same-origin image needs no cross-origin headers from anyone.

#### Drop the custom font and use system fonts

Considered. Using a system-font stack, as Clock-Practice does, would remove the font dependency entirely. It is not chosen as the recommendation because DM Sans is the LLBS brand typeface, named as such in the CHANGELOG and matching the main LLBS website, so the typeface is a design intent. Self-hosting keeps the brand typeface while removing the dependency. Whether system fonts are acceptable is a design call for Simon; if he judges them acceptable, that is an even simpler outcome.

### Consequences

- A follow-up piece of work self-hosts the DM Sans font and the LLBS logo for `index.html`, and self-hosts the logo and removes the `CORS_PROXIES` list and `loadLogoWithFallback` fallback logic for `brand.html`. This is a `refactor` and a `fix` change.
- Once the logo is self-hosted in `brand.html`, the public proxy dependency is gone, the page no longer contacts `corsproxy.io` or `allorigins.win`, and the `connect-src` directive of its Content-Security-Policy reduces to `'self'`.
- Once the fonts and logo are self-hosted in `index.html`, its Content-Security-Policy `style-src`, `font-src`, and `img-src` reduce to `'self'`.
- Until the self-hosting work is done, the project has documented third-party dependencies: Google Fonts and the LLBS WordPress logo for `index.html`, and the WordPress logo plus the two public CORS proxies for `brand.html`. Gerrie records the proxy dependency as a security exception and assesses it; this review marks it the highest-priority item to remove.
- The project keeps zero third-party JavaScript libraries on both pages. Any future dependency follows the standard above and is added to this record's inventory.
- Sonja confirms with Tim that LLBS is content for the logo image to be committed to the public repository. This is question 3 below.

## Summary of decisions

- Architecture Decision Record 001: the repository holds two different kinds of software, a static brochure page and an interactive application; adopt them together but review, configure, and test them as two separate pages. Whether to split into two repositories later is a question for Tim.
- Architecture Decision Record 002: split each page into separate HTML, CSS, and JavaScript files; keep `index.html` and `brand.html` as two separate pages and never consolidate them. The 55-kilobyte size of `index.html` is fine and is mostly inline CSS that the split removes. Do the split as named follow-up work, not inside the adoption.
- Architecture Decision Record 003: no build step; the repository source is the deployed site.
- Architecture Decision Record 004: stay on GitHub Pages; deliver the Content-Security-Policy and Referrer-Policy by meta tag, one policy per page; record the headers GitHub Pages cannot send as security exceptions, with a separate assessment for `brand.html` because it handles a user photo.
- Architecture Decision Record 005: self-host the DM Sans font and the LLBS logo; remove the public CORS proxies from `brand.html` by self-hosting the logo so it loads same-origin. This is the highest-priority change in the review.

## Open questions for Tim

These are the questions this review raises, batched for Sonja to put to Tim in the team's numbered-and-lettered format.

1. The LLBS repository holds two different things: the strategy brochure page and the separate Photo Brander tool. Should they stay in one repository, or be split into two?
   A. Keep both pages in the one `timdixon82/LLBS` repository (recommended for now; they share the LLBS brand assets, and splitting a repository is a separate piece of work).
   B. Plan to split them into two repositories as a later piece of work.

2. Both pages should be split from single files into separate HTML, CSS, and JavaScript files. This review recommends doing that as a named follow-up piece of work after the adoption, not inside it. Should the team schedule that split as the next piece of work?
   A. Schedule the file split as the next piece of work after the LLBS adoption (recommended; it unlocks the stronger Content-Security-Policy and proper linting).
   B. Leave both pages as single files for now and revisit later.

3. The `brand.html` Photo Brander currently fetches the LLBS logo through public proxy services, which is an uncontrolled third-party dependency this review recommends removing by committing the logo into the repository. The repository is public, because GitHub Pages requires it. Is LLBS content for the LLBS logo image to be committed to the public `timdixon82/LLBS` repository?
   This is a free-text question; Tim answers by quoting the number.

## Note for Sonja: a possible cross-cutting pattern

The GitHub Pages security-header pattern (Content-Security-Policy and Referrer-Policy delivered by meta tag, the unsendable headers recorded as exceptions) has now recurred on three projects: Periodic-Table, Clock-Practice, and LLBS. The file-split decision has also recurred on three projects. Both are now plainly cross-cutting: any future static project on GitHub Pages will meet the same two situations. This review flags both as candidates for the global wiki's `patterns/` folder, so a fourth static project does not have to rediscover them. The decision to promote them is Sonja's, per the cross-cutting-write rule in CLAUDE.md.
