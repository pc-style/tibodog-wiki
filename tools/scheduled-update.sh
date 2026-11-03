#!/usr/bin/env bash
# Run by the tibodog-wiki-update systemd user timer on pcstyle.
# Checks tibo.dog for a new game build and applies it to this checkout.
#   clean         deploys to production if AUTO_DEPLOY=1 (set in the service unit), else leaves a card
#   needs-review  leaves a Kanban card pointing at the report; nothing is deployed
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.bun/bin:$HOME/.local/bin:$PATH"
# pnpm runs through corepack, which sits next to the real node binary.
PATH="$(dirname "$(readlink -f "$(command -v node)")"):$PATH"

log() { printf '%s %s\n' "$(date -u +%FT%TZ)" "$*"; }

out=$(node tools/update.mjs --apply 2>&1) || { log "update failed"; printf '%s\n' "$out"; status=failed; }
status=${status:-$(printf '%s\n' "$out" | sed -n 's/^status: //p' | tail -1)}
report=$(printf '%s\n' "$out" | sed -n 's/^report: //p' | tail -1)
main=$(node -e 'console.log(require("./data/build.json").main)')
log "status=$status build=$main"

card() {
  bb kanban add "$1" --status todo --project tibodog-wiki \
    --desc "$2 Checkout: $PWD on pcstyle. Report: ${report:-none}." >/dev/null || log "kanban card failed"
}

case "$status" in
  up-to-date) ;;
  clean)
    if [ "${AUTO_DEPLOY:-0}" = 1 ]; then
      deploy() { vcx exec -p pc-style -- deploy --prod --yes >/dev/null 2>&1; }
      if deploy || { sleep 30; deploy; }; then
        log "deployed $main"
      else
        card "tibo.dog wiki: deploy of $main failed" "New game build $main had no content or logic changes and was applied, but the production deploy failed."
      fi
    else
      card "tibo.dog wiki: deploy build $main" "New game build $main had no content or logic changes and was applied. Deploy with vcx deploy --prod."
    fi
    ;;
  needs-review)
    card "tibo.dog wiki: review game build $main" "New game build $main changed data, logic or quoted code. Update the affected pages, write the summary and set status reviewed in data/builds.json, then deploy."
    ;;
  *)
    card "tibo.dog wiki: update check failed" "tools/update.mjs failed; see journalctl --user -u tibodog-wiki-update."
    exit 1
    ;;
esac
