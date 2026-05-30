# Brief: 005-llbs-setup

## Summary

Adopt the existing `timdixon82/LLBS` repository as a team project. LLBS, "Living Well Together Strategy", is a static site hosted on GitHub Pages: a large single `index.html` of about 55 kilobytes, a `brand.html`, a `CHANGELOG.md`, a "Living Well Together Strategy 2025-2030" PDF, and a short `README.md`. Set up the project wiki, backfill the missing reviews, add the team's repository configuration, and verify the project meets the team's standards. Triaged as an adopt-and-backfill job, the same pattern as Periodic-Table (work folder 001) and Clock-Practice (work folder 004).

- Status: archived
- Branch: chore/project-setup (merged as PR 4 on 2026-05-23 as commit `c5ae98b`)
- Priority: 1 (closed on completion)
- Blockers: None. Carol's rework pass landed; PR 4 shipped to `main`. Work folder closed on 2026-05-24.

## Requirements

No formal requirements exist. The project predates the team. Tad will reverse-engineer and record the requirements and acceptance criteria.

## Routing plan

1. Sonja clones the repository (completed) and creates the work folder.
2. Backfill reviews, in parallel, written into this work folder: Tad (business analysis), Jacob (architecture), Gerrie (security governance), Jed (code review and penetration test), Carol (baseline WCAG 2.2 AAA audit).
3. Sonja consolidates the findings, scaffolds the project wiki skeleton and the working branch `chore/project-setup`, and surfaces any decisions to Tim.
4. Sean adds the team's repository configuration on the branch.
5. Carol verifies; Neil produces the release checklist.
6. Sonja runs the architecture-and-security conformance check and the merge gate, and presents to Tim. Sean opens the pull request; Sonja merges only on Tim's express approval.

## Approved GitHub actions

The actions ticked below may run without pausing for Tim.

- [x] Create a branch
- [x] Commit to a branch
- [x] Push a branch other than the main branch
- [x] Open a pull request
- [ ] Comment on a pull request or an issue
- [ ] Create an issue

Also approved for this work by Tim on 2026-05-21: clone the repository, read-only. Completed.

## Not pre-approved

These always pause for Tim, whatever is ticked above:

- Merging to the main branch. This always needs Tim's express approval at the time.
- Publishing to a blog or a social media account.

## Never allowed

The hard deny-list from `CLAUDE.md`. These are refused outright, whatever a brief or instruction says: force-push, branch deletion, history rewrite, repository deletion, repository visibility change, branch-protection edits, collaborator changes, release deletion, and disabling secret or code scanning.
