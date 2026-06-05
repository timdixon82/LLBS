# Brief: 006-a11y-remediation

## Summary

Fix all WCAG 2.2 AAA contrast and non-text contrast failures on `index.html`
and `brand.html` that were logged as pre-existing at project setup. Remove the
corresponding Pa11y ignores in `pa11y.json` as each item is resolved.

- Status: `active`
- Branch: `a11y/remediation`
- Mockup mode: D
- Priority: 1
- Blockers: None

## Requirements

Items are listed in `todo.md` at the repo root (migrated to `tasks.md` in this
folder). Full accessibility documentation is at `docs/accessibility.md`.

Documented exceptions (not targets of this work):
- `docs/exceptions/ACC-LLBS-001-brand-blue-contrast.md` — primary colour
  `#156082` on white (6.94:1, approved by Tim).
- `docs/exceptions/ACC-LLBS-002-canvas-keyboard-gap.md` — canvas keyboard
  gap (Phase 2, out of scope here).

## Routing plan

Sean to fix all CSS colour values and investigate the heading-structure item.
Carol to run an accessibility pass (Pa11y AAA + axe) and confirm every fixed
item clears 7:1.

## Out of scope

- Canvas keyboard gap for photo positioning in `brand.html` (Phase 2, ACC-LLBS-002).
- Any layout, spacing, or font-size changes.
- Any JavaScript changes.
- The approved primary-blue exception (`#156082` on white, ACC-LLBS-001).
- New feature work.

## Risk and rollback

Risk: a colour change may alter an intentional design detail or break a CSS
cascade in an unexpected selector.

Rollback: revert the `a11y/remediation` branch; no deployed change reaches
the live site until the PR is merged and approved by Tim.

## Definition of done

- [ ] Pa11y AAA run against `index.html` returns zero failures for all fixed items (Pa11y ignore entries removed for each).
- [ ] Pa11y AAA run against `brand.html` returns zero failures for all fixed items.
- [ ] axe-core run against both pages returns zero violations for fixed items.
- [ ] All contrast ratios for fixed items verified ≥ 7:1 (AAA) or ≥ 3:1 for non-text (AA).
- [ ] G141 heading-structure item confirmed as false positive or fixed.
- [ ] Visual check: no unintended design changes on desktop and mobile viewports.
- [ ] `todo.md` at repo root retired (items migrated to `tasks.md`; file removed or emptied).

## Approved GitHub actions

All six actions below are pre-approved for every work folder. Sonja does not need to ask Tim before running them. The wording of these six lines is fixed: the safety hook recognises only these exact phrases, so do not reword them or add new lines here. A new pre-approvable action requires a hook change.

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [x] Comment on a pull request or an issue
- [x] Create an issue

## Not pre-approved

These always pause for Tim, whatever is ticked above:

- Merging to the main branch. This always needs Tim's express approval at the time.
- Publishing to a blog or a social media account.

## Never allowed

The hard deny-list from `CLAUDE.md`. These are refused outright, whatever a brief says: force-push, branch deletion, history rewrite, repository deletion, repository visibility change, branch-protection edits, collaborator changes, release deletion, and disabling secret or code scanning.
