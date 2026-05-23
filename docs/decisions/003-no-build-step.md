# ADR 003: No build step

## Status

Accepted. Recorded by Jacob (architect) on 2026-05-21 during work 005-llbs-setup.

## Context

LLBS is a static front-end project. Both pages are served exactly as written: the browser receives the same `index.html` and `brand.html` that live in the repository. There is no compile step, no bundle step, and no generated output.

The team's static front-end stack standard says: "A small project needs no build step. A larger one may use a light bundler such as Vite." This record decides whether LLBS needs a build step.

## Decision

LLBS has no build step. The repository source is the deployed site.

This holds whether the pages remain as single files or are later split into separate HTML, CSS, and JavaScript files per ADR 002. Separate plain files are still served directly with no build step. Both pages are written in standards-based HTML, modern CSS, and modern JavaScript, all of which a current browser runs directly. `brand.html` has about 680 lines of JavaScript, but they are plain browser JavaScript with no package imports and nothing that needs transforming.

A build step would be needed only if the project took on something that must be transformed before a browser can use it: a JavaScript package installed from a package registry, a CSS pre-processor, a framework, or a module bundler made necessary by many source modules. The named trigger for revisiting this decision is any of those. The expected choice, if a build step is ever needed, is a light bundler such as Vite.

## Alternatives considered

**Add a light bundler such as Vite now.** Rejected. A bundler earns its place when a project has many source modules to combine, third-party packages to resolve, or assets to transform. LLBS has none of these today. Even after the file split in ADR 002, it is two pages each with one HTML, one CSS, and one JavaScript file, and no packages from a registry. Adding a bundler would add a `node_modules` folder, a lockfile, and a build command to keep updated and secure, for no gain the project can use today.

**Add a build step only to minify the output.** Rejected. Minifying would save a few kilobytes from two pages that together are under 100 kilobytes of source. The saving is small, and it comes at the cost of a gap between the source the team reviews and the file the browser runs. For pages this size the cost is not repaid.

## Consequences

- No build step means no build to break, no build dependencies to patch, and nothing between the repository and the browser. What the team reviews is exactly what is served.
- The continuous integration pipeline still runs lint and accessibility checks, as the stack standard requires, but it has nothing to compile.
- GitHub Pages serves the repository content directly, with no GitHub Actions build job between the repository and the live site. See ADR 004.
- This decision is tied to the dependency posture in ADR 005. If LLBS ever adopts a dependency that must be installed and bundled, this no-build-step decision must be revisited at the same time.
