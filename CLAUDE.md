# CLAUDE.md

<!-- PUBLIC-REPO-RULE -->
## 🌐 THIS REPO IS PUBLIC — read this before writing anything

This repo is **world-readable** — it serves the live site through GitHub Pages. Everything committed
here is public forever, and so is the git history. Private notes do not exist in this repo.

**Never write any other GitHub account name, handle, brand, or project name from this workspace into
this repo** — not in docs, not in `TODO.md`, not in a handoff prompt, not in a commit message. If a
push fails and the error text names a different account, describe it generically ("the push picked up
the wrong GitHub account") and never quote the handle.

This is not hypothetical: a cross-account handle was committed here, removed once, and reintroduced by
a later session documenting the same push error. Do not be the third time. Only this project's own
real-estate content belongs in this repo.
<!-- /PUBLIC-REPO-RULE -->

<!-- CREWDECK-RULE -->
## 🧰 CrewDeck rule — route human work to the master hub

Going forward, **every human task or blocker for this project goes to CrewDeck**, the master hub
at https://crew.146-190-119-77.sslip.io. Add it as a `- [ ]` line under the
`## 🧑 Human / Blockers` section of this project's `TODO.md` (prefix hard blockers with ⛔). The
CrewDeck sync (`infra/crewdeck/sync`) picks it up automatically (~every 45 min) and shows it on this
project's board under the right tab and in the global ⛔ BLOCKERS view; approving it in CrewDeck ticks
the box back here. Don't leave human/blocker work only in chat or in your head — put it on the board so
Stockton and the assistants can see and action it.
<!-- /CREWDECK-RULE -->
