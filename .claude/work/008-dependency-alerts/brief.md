# 008 Dependency alerts

Status: active

## Summary

Clear the 14 open Dependabot alerts in the root package-lock.json (all development scope): fast-uri, js-yaml, brace-expansion and minimatch. Targeted npm update moved eslint to 10.14.0, fast-uri to 3.1.9, js-yaml to 4.3.2 and brace-expansion to 5.0.12. The minimatch fix exists only in 11.0.1 and later, outside eslint's ^10 range, so one documented override (minimatch ^11.0.1) was added to package.json. Remove the override once eslint depends on minimatch 11 or later.

## Out of scope

Feature changes, other work folders, workflow files, and the open template sync pull requests.

## Risk and rollback

Risk is low: development dependencies only, nothing shipped to the site. The minimatch 11 override is a major bump used only by eslint file matching. Lint and tests pass. Rollback: revert the pull request.

## Definition of done

- npm audit reports 0 vulnerabilities.
- npm ci, lint and tests pass (the project defines no build script).
- All 14 Dependabot alerts close after merge.
- One pull request open against main, not merged.
