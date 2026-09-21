# TODO: Team Utah Commercial

**Last audited:** 2026-07-16  
**Status:** Live & deployed · 23 FOR SALE + 6 FOR LEASE + 5 PAST PROJECTS (34 total) · Cloudflare Pages auto-deploys from main  
**Path:** cre-sites/teamutahcommercial (+ teamutahcommercial-data)

## Listing Sync Pipeline (NEW 2026-06-02)

Real-time pipeline at `cre-sites/teamutahcommercial-data/`. Watches properties.xlsx, diffs changes, stages real-listings.json + photos, optionally auto-deploys.

**Status:** Operational. Schema verified. 33 listings parsed, 31 with photos.

- [x] Build 8 pipeline modules (config, db, differ, updater, deploy, notify, watcher, server)
- [x] Initial sync — 33 listings parsed, snapshots saved in sync.db
- [x] Fix schema mismatches (wfrmls field, acresDisplay, status detection)
- [x] Fix photo path mapping to use website's existing folder names
- [x] Fix worksheet parser (PAST PROJECTS section, junk row filtering, placeholder cleanup)
- [x] Verify staging output matches website schema (31/33 photos valid, 0 missing)
- [x] Test deploy dry-run — correct commit message, no junk files
- [x] Create startup scripts (start-watcher.bat, start-dashboard.bat)
- [ ] **Set up Discord webhook** — env var `TUC_DISCORD_WEBHOOK` or config.json `discord_webhook`. No webhook URL exists yet in infra configs; needs to be created in the TUC Discord server (or a channel in claw-empire Discord)
- [ ] **Enable AUTO_DEPLOY** — set `auto_deploy: true` in config.json once webhook + git push are confirmed working
- [ ] **Register in Task Scheduler** — add start-watcher.bat as "At log on" trigger for persistent background sync
- [ ] **Git push test** — do one real `deploy.py` run (not dry-run) to confirm git commit+push works with the farnsworthstockton-arch credential workaround

## 🚧 BOTTLENECKS — Need from Stockton

- [ ] **xlsx ↔ JSON price/acreage discrepancies** — Stefanoff Farms ($75M in xlsx, null in JSON), 1213/1239/1267 Belladonna (distinct prices in xlsx, identical in JSON), 1290 Belladonna (4.21 vs 2.49 acres). Pipeline now uses xlsx as source of truth; verify xlsx values are correct.
- [ ] **Eagle Mountain individual detail pages** — 16 listings share one OM; OM page 7 has per-parcel data but is image-only. Needs manual parcel coordinates + data from Stockton to build individual listing.html?address= pages.

## 👤 Stockton's tasks

- [ ] **Push git credentials fix** — bare `git push origin main` fails (BadImageFormatException or wrong GitHub account). Use qualified URL: `git -c credential.helper=wincred push https://farnsworthstockton-arch@github.com/farnsworthstockton-arch/teamutahcommercial.git main`
- [ ] **Create Discord webhook** — create a webhook in the appropriate Discord server/channel for listing sync notifications
- [ ] **Update marketing worksheet** — keep xlsx in sync when adding/updating listings; pipeline will auto-detect changes
- [ ] **Confirm map pins for the two unnamed EM assemblages** — "EM Commercial Corridor" (90.81 ac) and "Eagle Mountain Commercial" (77.36 ac) have no parcel numbers on file, so their map.html pins are approximate corridor positions (all other 32 pins are now exact UGRC parcel centroids). Reply with their parcel #s (or point at them on the OM's page-7 map) and the pins can be made exact.

## 🤖 Claude's tasks

- [x] **Create an `ELI5.md` for this project** — plain-English overview (what it is, why it exists, how it works, current status). _(Added 2026-06-21; done 2026-07-09.)_
- [ ] **Add Southgate to pipeline `properties.xlsx`** — Southgate Office Park was added manually to `real-listings.json` (+ `listing.html` detail content + `map.html` pin). The Excel→JSON sync is currently dormant (AUTO_DEPLOY off, not in Task Scheduler), so no immediate clobber risk. But if the pipeline is ever activated, add this listing to `teamutahcommercial-data/properties.xlsx` (or a re-sync may drop it). Its OM is a locally-hosted PDF and its detail content is hand-curated, so preserve the manual entry rather than letting the pipeline overwrite it.
- [ ] **Wire up Task Scheduler** — register start-watcher.bat for auto-start on boot
- [ ] **Test full deploy end-to-end** — run deploy.py without --dry-run, verify git commit+push+Cloudflare auto-deploy
- [ ] **Reconcile xlsx↔JSON prices/acreage** — once Stockton confirms, update xlsx or JSON to match
- [ ] **Sold lots say "Call for Price"** — a sold lot has `price: null`, so `eagle-mountain.html` and the `map.html` cards still print "Call for Price" for it (the detail page prints "Contact for Price"). Seen on Lots 303, 305 and 306. Small display fix, but it needs Stockton's OK first because the site copy is team-approved.
- [ ] **Southgate detail pages lost their write-up in the 9/10 suite split** — `listing.html` looks up `PROPERTY_CONTENT[p.address]` by exact address, but the hand-written overview / highlights / specs are still keyed `"Southgate Office Park — 11576 State Street, Draper"` (no suite suffix). So both suite pages show only the stats and the generic "Contact Team Utah Commercial for full details…" line. It is the only orphaned key (checked all 16 on 2026-09-21). Not urgent while both suites are Pending, and the old copy says "Two individual suites are available", so it needs rewording (team-approved copy → Stockton's OK) before it comes back. If a suite returns to the market: fall back to the address minus its `" - Suite …"` suffix (same idea as the listing fallback in `load()`) and reword the availability line.

## ✅ Recently shipped

- **2026-09-21** **Request Info forms now save every inquiry and ping the team: on branch `inquiry-forms`, NOT live until the inquiry service is turned on and the branch is merged.** Before: the listing, glossary and blog forms only opened the visitor's email app (the lead was lost if they had none), and the 14 lead forms on the tool pages linked from `cre-tools.html` (`test4`, `test7` to `test13`, `test15`, `test16`, `test18`, `test19`) threw every lead away, several behind a fake "Thank you". Now all 21 lead forms (those 17, plus 4 on unlinked mockups: `test3`, `test5`, `test6`, `test20`) send through one shared `inquiry.js`. It posts to the team's inquiry service (saved to a database, the team's phones are pinged, private inbox page), shows each page's own thank-you only after a real save, and if anything fails it falls back to the old behaviour: the visitor's email app, addressed to Robert and filled in, plus a note with Robert's email and phone. Every field the visitor fills in reaches the team as "Question: answer" lines, and the listing or page name is added automatically. The look is unchanged apart from that small note under the button (and the listing page's form note no longer says it opens your email app). Checked in a local browser on every form, both ways (service up: saved and alerted; service down: email fallback, no fake thank-you), plus an alert-server outage (saved, email fallback, alert retried), the rate limit and the bot timing check. The service lives in the private `teamutahcommercial-data` repo (`inquiry-service/`).
- **2026-09-21** **Southgate Office Park, Draper — Suite 1202 A moved to Pending** (Stockton's call). Suite 1202 B has been Pending since 9/10, so both Southgate suites are now pending. One line in `real-listings.json`: `status: "Pending"` (commit `4d99ef4`). Checked locally on the home page (both suites in the Pending grid with PENDING badges), the detail page (Status Pending) and the map (Pending on both cards), then on the live site after the push (both cards PENDING, in the Pending grid). Site now counts 22 for sale · 7 for lease · 11 sold/leased (40 total), 8 of them pending; 5 lease listings still available.
- **2026-09-14** **Lot 305 — 1267 E Belladonna Dr moved from Pending to Sold** (the sale closed). Same shape as Lots 303 and 306: `section` → `PAST PROJECTS`, `status` → `Closed` (renders SOLD), `price` → null, and `parcel_id` / `crexi` / `wfrmls` removed. Dropping `wfrmls` matters: `listing.html` and `eagle-mountain.html` show an MLS/WFRMLS button whenever that field is set, even on a sold lot. Checked locally on the home page (Sold grid, SOLD badge, no price, OM button only), the Eagle Mountain page (Status Sold), the map (grey past pin) and the detail page (Status SOLD, OM link only). Site now counts 22 for sale · 7 for lease · 11 sold/leased (40 total), 7 of them pending.
- **2026-07-16** **Fixed map pin locations** — the `map.html` `COORDS` table was hand-estimated and had the entire Eagle Mountain / Monte Vista Ranch cluster ~5–6 miles east of the real corridor (plus smaller errors elsewhere: 2608 Bridger 3.4 mi, Delta 2.2 mi, 9489 S 6400 W 1.8 mi). Re-geocoded all 34 listings against UGRC statewide parcel centroids using each listing's parcel number (incl. parcel #s found embedded in the worksheet address cells for Piper Ln → 59:056:0043 and Lake Mountain Rd → 59:019:0021; 1344 E Jasmine identified as parcel 71:025:0309), Census geocoder for non-parcel addresses. 32/34 pins now parcel-exact; EM Commercial Corridor + Eagle Mountain Commercial approximate pending parcel #s from Stockton (see Stockton's tasks). Committed + pushed (7c11f11).
- **2026-07-16** **Fixed broken map page** — `map.html` map pane was collapsing to a ~14px sliver on desktop: `body{overflow:hidden}` kept the 451px footer inside the 100vh flex column, starving the `flex:1` map container. Replaced with a definite height (`calc(100vh - 210px)`, min 480px) and let the footer scroll below the fold; mobile layout untouched. Verified locally (885×510 map, 34 markers, filters toggle 22/34, footer reachable) and live post-deploy. Committed + pushed (34bc12f).
- **2026-07-16** **Accessibility / SEO / robustness / page-weight pass** — offline improvement sweep across index.html, listing.html, map.html, and the other static pages:
  - **Accessibility:** skip-to-content links + `<main>` landmarks on every page, `aria-label="Primary"` on nav bars, visible `:focus-visible` outlines (previously `outline: none` with no replacement on nav buttons and form fields), keyboard support (Enter/Space + `role="link"`/`tabindex`) for the JS-driven clickable property cards in `script.js`, `aria-pressed` state on the map's filter buttons, `aria-hidden` on decorative icons.
  - **SEO:** dynamic `RealEstateListing` JSON-LD injected per-property in `listing.html`'s `render()`, a site-wide `ItemList` JSON-LD injected in `script.js` after listings load on the homepage, added the missing `<link rel="canonical">` to `listing.html`.
  - **Listing-sync robustness:** `real-listings.json` fetches now retry 3x with exponential backoff (`script.js`, `listing.html`, `map.html`) instead of failing silently on the first network blip; added distinct "couldn't load" error states (with a Try Again button) on all three pages, separate from the existing empty-results / not-found states.
  - **Page-weight:** `loading="lazy" decoding="async"` on all below-the-fold `<img>` tags (~85 images total, mostly the 39 client logos on Clients Served) while keeping header logos eager; added `<link rel="preconnect">` for the Font Awesome CDN across every page.
  - Offline only — no live API calls, no deploys touched, nothing in `.env`/credentials touched. Verified: `node --check` on all inline `<script>` blocks and `script.js`, balanced `<head>/<main>` tags across all HTML files, and a local static-file server smoke test (200s on index/listing/map/clients-served, valid `real-listings.json`).
- **2026-07-13** **Added E.M. Founders Group to Clients Served page** — downloaded their official logo from emfoundersgroup.com → `logos/EM Founders Group.png` (603×593 transparent PNG), added a client card to `clients-served.html` (alphabetized between DR Horton and Fieldpiece), and bumped the header count 38 → 39. Verified in-browser: 39 cards, logo loads, zero broken images. Homepage only links to this page (no separate logo strip to sync). Committed + pushed (f199938).
- **2026-06-19** **Added Southgate Office Park listing** — 11576 State Street, Draper UT 84020 (Office · For Lease · $26.00/SF/yr Modified Gross · two 1,325 SF suites = 2,650 SF combined, divisible). New `photos/lease-southgate-draper/` (brick-exterior hero `1-exterior.jpg` + 2 alternates), self-hosted OM `Southgate-Office-Park-OM.pdf`, JSON record, `listing.html` detail content (2-para overview, 12 highlights, 12 specs), and `map.html` pin `[40.5408, -111.8919]` (Nominatim-geocoded). Crexi linked (property 1195915). Verified render on index/detail/map with zero console errors. **Note:** added manually (not via xlsx pipeline) — see Claude's tasks.
- **2026-06-02** **Listing sync pipeline operational** — 8 Python modules (config, db, differ, updater, deploy, notify, watcher, server). Real-time Excel → JSON sync with photo mapping, diff engine, social/email draft generation, rollback support, and web dashboard on port 3499.
- **2026-06-02** **Schema fixes** — added wfrmls field, acresDisplay logic, improved status detection (sold/leased/withdrawn), fuzzy photo path matching to preserve website's existing folder structure.
- **2026-06-02** **Data cleaning** — PAST PROJECTS section detection, junk row filtering (numeric parcel IDs, section headers), "Put link here" placeholder cleanup.
- **2026-05-28** Marked CREN and CBDA completed. Tracker: 27/40 completed, 12 remaining.
- **2026-05-28** Live-readiness pass complete — renamed drafts, removed noindex, added nav links, updated sitemap.
- **2026-05-28** Issue 6 (RE/MAX Exec Club content) — wrote tagline/overview for 8 missing award pages.
- **2026-05-28** Issue 8 (missing badges) — added kind-based fallback icons for all credential types.
- **2026-05-21** Fix 9 medium issues found in CRE tools audit
- **2026-05-21** Replace Investment Analyzer with Blog in footer
- **2026-05-21** Publish glossary + CRE Tools hub, update footer
- **2026-05-20** Add SEO blog: 10 Utah commercial real estate articles

## 🧑 Human / Blockers
<!-- Auto-managed by CrewDeck (https://crew.146-190-119-77.sslip.io). These boxes stay in sync with the project's board: approve a task in CrewDeck and its box is ticked here; tick a box here and CrewDeck shows it done. Only these exact lines are auto-managed — edit anything else freely. -->
- [ ] Create a Discord webhook in the TUC/claw-empire Discord channel for listing-sync notifications (set TUC_DISCORD_WEBHOOK).
- [ ] Run the git-credentials-fix push for teamutahcommercial (use qualified farnsworthstockton-arch URL; bare git push fails).
- [ ] Keep the marketing properties.xlsx in sync when adding/updating listings so the pipeline can auto-detect changes.
- [ ] Verify xlsx price/acreage values are correct (Stefanoff Farms $75M, 1213/1239/1267 & 1290 Belladonna) to resolve xlsx-vs-JSON discrepancies.
- [ ] Provide Eagle Mountain per-parcel coordinates/data so individual detail pages can be built for the 16 shared-OM listings.
- [ ] Set up site analytics (Cloudflare Web Analytics or GA4) on teamutahcommercial.com so listing traffic and form leads are tracked.
- [ ] Provide RealNex ePublish links for 1145 S Washington Blvd and 62 N Country Way if you want them to replace the OM PDFs hosted in this repo (`oms/`) — Crexi links are now live on both.
- [ ] Add the tax parcel number for Lot 401 (1296 E Jasmine St) once Utah County assigns one — the signed MLS input leaves it blank and the new plat has not been assessed yet.
- [ ] Confirm the Lot 401 listing photo — currently a crop of the Plat 4 survey drawing; an aerial or highlighted site plan would match the other Sweetwater lots better.
- [ ] Reconcile 1145 Washington Blvd figures — the OM says 3,980 SF on .23 acre (and its own suite math adds to 3,980), Crexi says 4,070 SF on 0.490 acre. The site uses the OM numbers.
- [ ] Fix the "1145 S. Washington Boulevard" line on page 2+ of the Ogden OM — the address has no "S". CONFIRMED 2026-08-25 against the authoritative Weber County parcel record via UGRC: parcel 121100058 = "1145 WASHINGTON BLVD", Ogden 84404. Crexi and the OM cover header agree. Left unpatched in the published PDF on purpose — removing "S. " shortens a right-aligned header line and would need the text origin recomputed, unlike the same-width digit swap used for the cap rate. Do it in the same RealNex re-export as the cap rate.
- [ ] 1145 Washington Blvd Ogden — RE-EXPORT THE OM FROM REALNEX so the source matches what is published. RealNex's 2026-08-25 export dropped the price to $1,550,000 but left the page 3 cap rate at 6.22%, which is the OLD price's math ($105,136 / $1,690,000). The published PDF was patched by hand to the correct 6.78% ($105,136 / $1,550,000) in commit 46aacd3 and is live, but the next RealNex export will bring 6.22% back unless the narrative field is fixed in the Investment Analysis module. That narrative is NOT in the CRM API (property 38987EFC has no listingforsale record), so it is a UI fix.
- [x] ~~⛔ DECISION — internal marketing worksheet in this public repo~~ — **DONE 2026-09-21 (Stockton said yes):** moved to the private repo `teamutahcommercial-data/moved-from-public-site/` (hash-checked copy), removed here, `*.xlsx` now git-ignored. Old copies still exist in this public repo's git history — see the repo-visibility decision below.
- [ ] ⛔ DECISION — repo visibility: decide between flipping this repo private (check hosting first — GitHub Pages needs a paid plan for private-repo Pages) or scrubbing old history with git filter-repo. Discussed offline; details intentionally not written here.
- [ ] DECISION — cre-tools.html sends clients to pages literally named test4.html…test19.html (they ARE the production calculators). Recommend renaming to real URLs (e.g. lease-calculator.html) with redirects; needs your OK since it changes public URLs.
- [ ] Lead forms were silently discarding every inquiry behind a fake "Message Sent!" (listing, glossary, blog). They now honestly open the visitor's email app addressed to Robert. Proper fix: wire them to a real endpoint like rsvp.html already uses.
- [ ] ⛔ Turn on the website inquiry service, then merge branch `inquiry-forms` into `main`. Exact steps: `inquiry-service/DEPLOY.md` in the private `teamutahcommercial-data` repo. Merging first would not lose leads (every form falls back to email) but nothing would be saved or pinged.
- [ ] DECISION: now that the tool-page forms really send, their existing thank-you messages are real promises: "within 24 hours" (test8, test11 CMA, test12), "within 2 business hours" (test10), "within 1-2 business days" (test13). test11's "Email Your Estimate" still says "Estimate sent! Check your inbox." Nothing emails the visitor automatically; the team gets the request and has to send the estimate. Keep, soften or reword? (Copy is team-approved, so it was left as is.)
- [ ] DECISION: `analyzer.html` "Request Underwriting" is only an email button to Stockton (no name or email boxes), so it cannot save anything. Leave it, or add a small form?
- [ ] DECISION: the bell buttons on `test9.html` say "You'll be notified when ... updates" but collect nothing. Remove them, or point them at the Request Info form?
- [ ] Confirm 851/855 McCormick package pricing — page prose claimed $5,250,000 / $3,950,000 / $9,200,000 combined while the worksheet+JSON say $5,115,000 / $3,825,000. Stale figures were removed from the site; re-add the combined-package price once confirmed.
- [ ] Worksheet says 2955 E 3500 S Delta (Stefanoff) "Sold with water rights" at $75M, but the site lists it FOR SALE at "Call for pricing" — confirm actual status.

