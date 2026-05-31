# Release process: LLBS

LLBS follows the team's global release process documented in the AgentTeam wiki at `docs/release-process.md`. This page records only the project-specific details.

## Branching model

`main` is the production branch. Feature work and fixes happen on short-lived branches following the conventional-commits prefix convention (`feat/`, `fix/`, `chore/`, `refactor/`, `docs/`, `a11y/`). No long-lived development branches.

## Pull-request flow

1. Open a pull request from a feature branch to `main`.
2. CI checks pass: linting (html-validate, Stylelint, ESLint), accessibility (Pa11y and axe-core at WCAG 2.2 AAA), security (CodeQL, Trivy, dependency-review, Semgrep), and deploy dry-run.
3. Carol signs off functional, accessibility, and visual testing.
4. Sonja reviews for architecture and security conformance.
5. Tim gives express approval to merge.
6. Sonja merges.

## Merge gate

- All required CI checks pass.
- Carol has signed off.
- Architecture-and-security conformance check passed.
- Tim has given express approval.

## Release steps

LLBS uses release-please for automated changelog and version management. On merge to `main`:

1. release-please opens (or updates) a release pull request bumping the VERSION file and CHANGELOG.md.
2. The `deploy.yml` workflow assembles the site from runtime files only (excluding docs, node_modules, and config) and deploys to `timdixon82.github.io/LLBS` via GitHub Pages.
3. On Tim's approval, Sonja merges the release pull request; release-please tags the release.

## Post-merge verification

After deployment, verify the live site at `https://timdixon82.github.io/LLBS`:
- `index.html` loads and the navigation, tabs, and timeline render correctly.
- `brand.html` loads and photo upload, branding, and download complete successfully.
- No browser console errors on either page.
- Both pages pass a spot check for CSP violations (browser devtools → Console).
