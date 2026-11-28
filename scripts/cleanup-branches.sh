#!/usr/bin/env bash
# cleanup-branches.sh: tidy up local branches in the LLBS repo.
#
# Branch deletion is on Sonja's hard deny-list, so this script is for Tim to
# run by hand from a terminal, not something an agent executes.
#
# What it does, in order:
#   1. Prunes local tracking refs for remote branches that no longer exist
#      (already merged/closed on GitHub, e.g. via squash merge).
#   2. Deletes local branches that are fully merged into main (safe delete,
#      git refuses with `-d` if a branch is NOT fully merged, so this step
#      cannot lose unmerged work).
#   3. Reports branches that are NOT merged into main but still have a
#      remote counterpart. These are left alone — they may be abandoned or
#      may be real unfinished work, and only Tim can tell the difference.
#
# Usage:
#   bash scripts/cleanup-branches.sh          # dry run, shows what would happen
#   bash scripts/cleanup-branches.sh --apply  # actually deletes

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

APPLY=0
if [[ "${1:-}" == "--apply" ]]; then
  APPLY=1
fi

echo "== LLBS branch cleanup =="
echo "Mode: $([[ $APPLY -eq 1 ]] && echo APPLY || echo "DRY RUN (pass --apply to actually delete)")"
echo

echo "-- Step 1: fetch and prune stale remote-tracking refs --"
git fetch origin --prune
echo

echo "-- Step 2: local branches fully merged into main --"
current_branch="$(git branch --show-current)"
merged_branches=$(git branch --merged main --format='%(refname:short)' | grep -vx -e main -e "$current_branch" || true)

if [[ -z "$merged_branches" ]]; then
  echo "  (none found)"
else
  while IFS= read -r branch; do
    [[ -z "$branch" ]] && continue
    if [[ $APPLY -eq 1 ]]; then
      git branch -d "$branch" && echo "  deleted: $branch"
    else
      echo "  would delete: $branch"
    fi
  done <<< "$merged_branches"
fi
echo

echo "-- Step 3: local branches with no remaining remote branch (already merged/closed on GitHub) --"
all_gone_branches=$(git branch -vv | grep ': gone]' | awk '{print $1}' | grep -vx -e main -e "$current_branch" || true)
# Exclude anything already handled (and possibly already deleted) in step 2.
gone_branches=$(comm -23 <(printf '%s\n' "$all_gone_branches" | sort) <(printf '%s\n' "$merged_branches" | sort) || true)

if [[ -z "$gone_branches" ]]; then
  echo "  (none found)"
else
  while IFS= read -r branch; do
    [[ -z "$branch" ]] && continue
    if ! git show-ref --verify --quiet "refs/heads/$branch"; then
      continue
    fi
    if [[ $APPLY -eq 1 ]]; then
      git branch -D "$branch" && echo "  deleted: $branch"
    else
      echo "  would delete: $branch"
    fi
  done <<< "$gone_branches"
fi
echo

echo "-- Step 4: branches NOT merged into main that still have a live remote (left untouched) --"
echo "   Review these yourself; they may be abandoned work or real unfinished features."
still_unmerged=$(comm -23 <(git branch --no-merged main --format='%(refname:short)' | sort) <(printf '%s\n' "$all_gone_branches" | sort) | grep -vx "$current_branch" || true)
if [[ -z "$still_unmerged" ]]; then
  echo "  (none found)"
else
  printf '%s\n' "$still_unmerged"
fi
echo

echo "Done."
