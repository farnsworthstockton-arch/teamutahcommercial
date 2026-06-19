# TODO: Team Utah Commercial

**Last audited:** 2026-06-19  
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

- [ ] **Push git credentials fix** — bare `git push origin main` fails (BadImageFormatException or wrong GitHub account "Aettam"). Use qualified URL: `git -c credential.helper=wincred push https://farnsworthstockton-arch@github.com/farnsworthstockton-arch/teamutahcommercial.git main`
- [ ] **Create Discord webhook** — create a webhook in the appropriate Discord server/channel for listing sync notifications
- [ ] **Update marketing worksheet** — keep xlsx in sync when adding/updating listings; pipeline will auto-detect changes

## 🤖 Claude's tasks

- [ ] **Add Southgate to pipeline `properties.xlsx`** — Southgate Office Park was added manually to `real-listings.json` (+ `listing.html` detail content + `map.html` pin). The Excel→JSON sync is currently dormant (AUTO_DEPLOY off, not in Task Scheduler), so no immediate clobber risk. But if the pipeline is ever activated, add this listing to `teamutahcommercial-data/properties.xlsx` (or a re-sync may drop it). Its OM is a locally-hosted PDF and its detail content is hand-curated, so preserve the manual entry rather than letting the pipeline overwrite it.
- [ ] **Wire up Task Scheduler** — register start-watcher.bat for auto-start on boot
- [ ] **Test full deploy end-to-end** — run deploy.py without --dry-run, verify git commit+push+Cloudflare auto-deploy
- [ ] **Reconcile xlsx↔JSON prices/acreage** — once Stockton confirms, update xlsx or JSON to match

## ✅ Recently shipped

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
