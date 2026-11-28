#!/usr/bin/env bash
# cleanup-verified-branches.sh: delete the six local branches Sonja checked
# by hand and confirmed are already fully merged into main via squash merge
# (git's --merged check misses these because a squash merge produces a new
# commit SHA, so the branch's own commits never show as ancestors of main).
#
# Verified before this script was written:
#   chore/project-setup        -> merged as PR #4
#   chore/sync-template-v1.4.5 -> superseded, main is past v1.8.1
#   chore/sync-template-v1.5.3 -> superseded, its one distinguishing file
#                                  (scripts/record-backport.sh) is on main
#   chore/sync-template-v1.6.2 -> superseded, main is past v1.8.1
#   fix/accessibility-ci-chrome -> merged as PR #9 (Chrome version drift fix)
#   fix/analytics-backfill     -> merged as PR #7 (GoatCounter analytics,
#                                  confirmed present in index.html/brand.html)
#
# Branch deletion is on Sonja's hard deny-list, so this is for Tim to run by
# hand, not something an agent executes.
#
# Usage:
#   bash scripts/cleanup-verified-branches.sh          # dry run
#   bash scripts/cleanup-verified-branches.sh --apply  # actually deletes

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

APPLY=0
if [[ "${1:-}" == "--apply" ]]; then
  APPLY=1
fi

branches=(
  chore/project-setup
  chore/sync-template-v1.4.5
  chore/sync-template-v1.5.3
  chore/sync-template-v1.6.2
  fix/accessibility-ci-chrome
  fix/analytics-backfill
)

echo "== LLBS verified-branch cleanup =="
echo "Mode: $([[ $APPLY -eq 1 ]] && echo APPLY || echo "DRY RUN (pass --apply to actually delete)")"
echo

for branch in "${branches[@]}"; do
  if ! git show-ref --verify --quiet "refs/heads/$branch"; then
    echo "  skip (not found locally): $branch"
    continue
  fi
  if [[ $APPLY -eq 1 ]]; then
    git branch -D "$branch" && echo "  deleted: $branch"
  else
    echo "  would delete: $branch"
  fi
done

echo
echo "Done."
