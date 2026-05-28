# TODO: Team Utah Commercial

**Last audited:** 2026-05-24  
**Status:** Live & deployed · 25 FOR SALE + 5 FOR LEASE + 5 PAST PROJECTS · GitHub Pages auto-deploys from main  
**Path:** cre-sites/teamutahcommercial (+ teamutahcommercial-data)

## 🚧 BOTTLENECKS — Need from Stockton

- [ ] **Wellsville Recovery Center** — in broker's xlsx but NOT in real-listings.json yet. $8.5M, 23.12 acres, FRE auction 3/18/26, Retail. RealNex propid 167851-1. (HANDOFF_PROMPT.md:60)
- [ ] **xlsx ↔ JSON price/acreage discrepancies** — Stefanoff Farms ($75M in xlsx, null in JSON), 1213/1239/1267 Belladonna (distinct prices in xlsx, identical in JSON), 1290 Belladonna (4.21 vs 2.49 acres). Clarify which source is current for each. (HANDOFF_PROMPT.md:61)
- [ ] **Eagle Mountain individual detail pages** — 16 listings share one OM; OM page 7 has per-parcel data but is image-only. Needs manual parcel coordinates + data from Stockton to build individual listing.html?address= pages. (HANDOFF_PROMPT.md:33)

## 👤 Stockton's tasks

- [ ] **Push git credentials fix** — Handoff doc notes bare `git push origin main` fails (BadImageFormatException or wrong GitHub account "Aettam"). Use qualified URL: `git -c credential.helper=wincred push https://farnsworthstockton-arch@github.com/farnsworthstockton-arch/teamutahcommercial.git main` (HANDOFF_PROMPT.md:13-17)
- [ ] **Verify live site deployment** — DEPLOY.md and README.md reference `https://teamutahcommercial.pages.dev` (Cloudflare), but CNAME and memory claim `teamutahcommercial.com` (GitHub Pages). Confirm which platform is actually serving the live site.
- [ ] **Update marketing worksheet** — Team Utah Commercial Listings.xlsx has more columns than real-listings.json (RealNex, Facebook, X, Instagram, KSL, WFRMLS, YouTube, Gold Connect). Keep xlsx in sync when adding/updating listings.

## 🤖 Claude's tasks

- [ ] **Add Wellsville Recovery Center to JSON** — Once Stockton provides confirmation. Extract OM content from RealNex propid 167851-1 (FlipBook at `https://marketedge.realnex.com/flipbook/167851-1/167851-1.pdf`), create photos/wellsville/ folder, add to real-listings.json, add PROPERTY_CONTENT to listing.html, add coordinates to map.html. — S
- [ ] **Reconcile xlsx↔JSON prices/acreage** — Pull authoritative values from xlsx or Stockton, update real-listings.json to match. — S
- [ ] **Audit data pipeline stale state** — teamutahcommercial-data repo: last commit 2026-04-17 (one month old). Crexi/LoopNet scrapers, photo indexer, enrichment scripts are untouched. Confirm if pipeline is still needed or can be archived. — S

## ✅ Recently shipped

- **2026-05-28** Marked CREN (Certified Real Estate Negotiator) and CBDA (Certified Business Development Agent) completed. Auto-cropped CREN badge from standard bottom-middle layout; manually targeted CBDA's unusual top-center badge with green-color filter. Both certs filed + inline previews rendered. Tracker now: **27/40 completed, 12 remaining**.
- **2026-05-28** **Live-readiness pass complete** — all hard blockers cleared:
  - Renamed `stockton-draft.html` → `stockton.html`; updated the back-link in `designation.html`.
  - Removed `<meta robots="noindex,nofollow">` from `stockton.html` + `designation.html`.
  - Removed orange `DRAFT PREVIEW` banner from both pages; removed "— DRAFT —" from page titles.
  - Added "About Stockton" link to `index.html` site-nav (between Our Team and Sold Listings).
  - Added `/stockton.html` entry to `sitemap.xml` (priority 0.8, lastmod 2026-05-28).
  - Added explanatory description meta on `stockton.html`.
- **2026-05-28** **Issue 6 (RE/MAX Exec Club content)** — wrote tagline/overview/applies_to_business for all 8 missing award pages: EXEC-2017, EXEC-2019, TEAM-EXEC-2016, TEAM-EXEC-2020/21/22/24/25. Honest framing: production-tier recognition with verifiable RE/MAX International benchmark.
- **2026-05-28** **Issue 8 (missing badges)** — added kind-based fallback icons (`fa-trophy` for awards, `fa-award` for designations, `fa-graduation-cap` for courses, `fa-id-badge` for memberships) on the hero of `designation.html` and the card thumbnails on `stockton.html`. Clearly NOT mimicking official credentials. Affects CCIM-101, AIM, DSA-2019/20/21, all 17 planned items, and CCIM-CAND.
- **2026-05-28** Marked CBA (Certified Buyers Agent, Agent Certifications) completed; moved to sort_order 11. Tracker: **24/40 completed, 15 remaining**. Cert/badge files pending.
- **2026-05-28** Added optional "Note" section to designation pages — renders when the DB `notes` field is populated. Used to explain that AIM (AI Masterclass) does not issue a downloadable certificate so visitors don't expect one.
- **2026-05-28** Marked AIM (AI Masterclass, Agent Certifications) as completed and moved up to sort_order 10, behind CSE and ahead of CCIM-102. Tracker: **23/40 completed**. AIM does not issue a certificate (per Stockton); explained on the page via the new Note section.
- **2026-05-28** **Tracker is now 40 items** — added CCIM-102 (CCIM CI 102: Market Analysis for CIRE), planned for June 2026. Reordered: completed CSE now sits at sort_order 10 immediately after CCIM-101, ahead of all planned credentials.
- **2026-05-28** **Year-only earned dates** — bio cards and designation pages now show "Earned 2026" instead of "Earned 2026-05-28". Planned items with an enrolled_date now show "Planned for June 2026" style; planned items without a date still say "Not started". Full ISO dates stay in the DB; only display changed.
- **2026-05-28** **Removed all placeholder file cards + admin upload note** from designation pages — "drop files in items/X/notes/" etc. and the "Where to upload" footer are gone. Files section now only renders when there's a real link to show (and is normally hidden once a cert preview is inline).
- **2026-05-28** **Inline certificate display** — designation pages now show the actual cert image right on the page (click to view full PDF/JPG). `tracker.py export` auto-renders any PDF cert's first page to PNG via PyMuPDF. Generated 8 previews (EPRO, CCIM-101, CSE, DSA-2019/20/21, REMAX-5YR/10YR). Affects all 22 completed credentials with cert files.
- **2026-05-28** Marked CSE (Commercial Sales Expert) designation completed — 22/39. Personalized PDF cert filed, badge auto-cropped from cert, 10 course materials filed in items/CSE/documents/.
- **2026-05-28** Designation template bug fix: cert link no longer hardcodes "(PDF)" — derives label from file extension. Logo card now shows real "View Badge / Logo" link when badge_path is set instead of "drop files" placeholder.
- **2026-05-21** `c118632` Fix 9 medium issues found in CRE tools audit
- **2026-05-21** `0ead2fd` Replace Investment Analyzer with Blog in footer
- **2026-05-21** `6dd4b21` Publish glossary + CRE Tools hub, update footer
- **2026-05-20** `78ff6e7` Add SEO blog: 10 Utah commercial real estate articles
- **2026-05-04** `c086ef4` Iteration 3 final polish on test pages 11-20

## ⚠️ Memory mismatch detected

**Deployment platform unclear:** CLAUDE_NOTES.md says "GitHub Pages" but DEPLOY.md says "Cloudflare Pages" + CNAME. Confirm single source of truth.

**Data pipeline abandoned?** Memory doesn't mention crexi-photos.json, loopnet_scrape.py, etc. are 1+ month stale. No commits since 2026-04-17. Unclear if still maintained.
