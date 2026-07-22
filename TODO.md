# TODO: Team Utah Commercial

**Last audited:** 2026-07-22
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

- [ ] **Push git credentials fix** — bare `git push origin main` fails (BadImageFormatException or wrong GitHub account "[redacted]"). Use qualified URL: `git -c credential.helper=wincred push https://farnsworthstockton-arch@github.com/farnsworthstockton-arch/teamutahcommercial.git main`
- [ ] **Create Discord webhook** — create a webhook in the appropriate Discord server/channel for listing sync notifications
- [ ] **Update marketing worksheet** — keep xlsx in sync when adding/updating listings; pipeline will auto-detect changes
- [ ] **Confirm map pins for the two unnamed EM assemblages** — "EM Commercial Corridor" (90.81 ac) and "Eagle Mountain Commercial" (77.36 ac) have no parcel numbers on file, so their map.html pins are approximate corridor positions (all other 32 pins are now exact UGRC parcel centroids). Reply with their parcel #s (or point at them on the OM's page-7 map) and the pins can be made exact.

## 🤖 Claude's tasks

- [x] **Create an `ELI5.md` for this project** — plain-English overview (what it is, why it exists, how it works, current status). _(Added 2026-06-21; done 2026-07-09.)_
- [ ] **Add Southgate to pipeline `properties.xlsx`** — Southgate Office Park was added manually to `real-listings.json` (+ `listing.html` detail content + `map.html` pin). The Excel→JSON sync is currently dormant (AUTO_DEPLOY off, not in Task Scheduler), so no immediate clobber risk. But if the pipeline is ever activated, add this listing to `teamutahcommercial-data/properties.xlsx` (or a re-sync may drop it). Its OM is a locally-hosted PDF and its detail content is hand-curated, so preserve the manual entry rather than letting the pipeline overwrite it.
- [ ] **Wire up Task Scheduler** — register start-watcher.bat for auto-start on boot
- [ ] **Test full deploy end-to-end** — run deploy.py without --dry-run, verify git commit+push+Cloudflare auto-deploy
- [ ] **Reconcile xlsx↔JSON prices/acreage** — once Stockton confirms, update xlsx or JSON to match

## ✅ Recently shipped

- **2026-07-22** **Added "Clear Filters" button to the no-results empty state** — previously a visitor whose type/price/search/sort combo matched nothing had to manually reset each filter control to recover. The empty state now has a one-click button that resets all four filters and re-renders the grid. Regenerated `script.min.js`.
- **2026-07-22** **Fixed low-contrast muted-gray text sitewide** — `#718096` (used for meta text, loading/error/empty-state copy, captions) measures 4.0:1 against white, below the 4.5:1 WCAG AA threshold for normal text. Swapped every text-color usage (`style.css` + all `.html` pages, 19 files) to `#5f6b7a` (5.4:1), same muted blue-gray hue. Left the two decorative uses (map.html legend dot swatch + marker color map) untouched since those aren't text-contrast cases.
- **2026-07-22** **Fixed misleading price filters and sorting** — choosing a maximum price no longer includes “Call for pricing” listings as though their unknown price were under the limit, and unknown-price listings now stay after priced listings in both sort directions instead of appearing as $0 in “Low to High.” Added regression checks and regenerated the minified production bundle.
- **2026-07-22** **Fixed listing inquiry lead loss** — the property-detail form previously discarded every submission in JavaScript and displayed a false “Message Sent” state. It now opens a prefilled email to Robert with the property and all visitor-entered details, then clearly tells the visitor to review and send it; a visible email/phone fallback remains if no mail app opens. The repo check now guards against restoring the fake demo handler.
- **2026-07-22** **Fixed CRE Tools page JavaScript crash** — removed the homepage-only listings bundle from `cre-tools.html`; that page has none of the listing DOM the bundle requires, so it threw on every visit. Added `scripts/check-script-usage.mjs` to prevent the incompatible bundle from being attached to pages without its required elements.
- **2026-07-16** **SEO/social/perf pass, branch `seo-pass-2026q3` (not yet merged)** — fills gaps left by the accessibility/SEO pass below: meta description + canonical + OG/Twitter tags on `designation.html` (was missing all three; now set dynamically per designation) and `stockton.html`/`glossary.html` (canonical/OG only); `sitemap.xml` rebuilt from 3 stale URLs to all 9 static pages + 10 blog posts + 16 listing detail pages (35 total, `test*.html` excluded); new `scripts/generate-og.mjs` regenerates `og/listings.json` (per-listing OG title/description/image) and `sitemap.xml` together from `real-listings.json` so both stay in sync after listing changes; new dependency-free `scripts/minify.mjs` produces `script.min.js` (33% smaller, string/regex-safe whitespace+comment strip, `node --check` verified) loaded with `defer` on `index.html` (it was removed from the incompatible CRE Tools page in the 2026-07-22 fix above). Alt text and per-listing JSON-LD `Offer` schema were already complete from the prior pass — verified, not touched. See `DEPLOY-REVIEW.md` on the branch. Awaiting Stockton's merge review (see Human/Blockers).
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
- [ ] ⛔ Merge `seo-pass-2026q3` to `main` (public Cloudflare Pages deploy) — needs Stockton's review. See `DEPLOY-REVIEW.md` on that branch for the 5-minute summary.
- [ ] Finish Ashlee Bonham platform-admin offboarding.
