# Handoff Prompt — Team Utah Commercial Site

Copy everything below the line into a new Claude Code session.

---

I'm Stockton Farnsworth, commercial real estate broker, RE/MAX Associates. I work maximum hands-off — describe what I want, you execute everything including git commits and pushes. Don't ask permission for routine file edits, just do them and push. No emojis in files unless I ask.

## Project

**Local:** `D:\Claw empire\teamutahcommercial\`
**GitHub:** `farnsworthstockton-arch/teamutahcommercial`
**Live:** `https://teamutahcommercial.com` (GitHub Pages, auto-deploys from `main` ~2 min)
**Stack:** Plain static — HTML / CSS / JS / JSON. No build step. No framework.

## Key files
- `index.html` — main page
- `listing.html` — dynamic detail page (reads `?address=` URL param, fetches `real-listings.json`, renders full property page)
- `clients-served.html` — client logo wall
- `style.css` — all styles
- `script.js` — listings rendering, filtering, clickable photo, etc.
- `real-listings.json` — single source of truth for all listings (broker-verified prices/data)
- `Team Utah Commercial Listings.xlsx` — Excel mirror, kept in sync via `excel-to-json.py`
- Test pages: `test.html`, `test2.html`, `test3.html`, `test4.html`, `test5.html`, `test6.html` (all `noindex,nofollow`)
- Listing photos in `photos/<listing-folder>/`, brand logos in `logos/`

## Workflow
- Edit locally → `git add -A && git commit -m "..." && git push` → GitHub Pages deploys
- Git push must use `git -c credential.helper=wincred push origin main` from PowerShell — the default `manager` helper throws BadImageFormatException but wincred falls back and pushes successfully
- Before large changes, create a backup tag: `git tag -a "backup-YYYYMMDD-HHMM" -m "..." && git push origin <tagname>`

## Compliance / immovable facts
- Brokerage: RE/MAX Associates · 6955 S Union Park Center, Suite 140, Cottonwood Heights, UT 84047
- Equal Housing Opportunity logo stays in footer
- "#1 in Utah 2025" claim is legitimate — keep the year
- Robert: 801.898.8810 · Stockton: 801.664.3370

## What's already built and live

1. **Pending Sales above Past Projects** on the main page
2. **Photo on each property card is clickable** — links to `listing.html?address=<encoded address>` for any listing with a unique OM (Eagle Mountain shared-OM listings and no-OM listings excluded). The whole card outside the OM/Crexi buttons also navigates.
3. **`listing.html` dynamic detail page** — for every listing with a unique OM, populated with real OM-extracted content:
   - Hero image, property-type badge, address, section
   - Stats bar: price / size / type / status / brokered by
   - Property Overview (real OM marketing copy)
   - Property Specifications (auto-generated, OR `specOverrides` per-property when data is richer — McCormick Way uses overrides for full industrial specs)
   - Property Highlights (real OM bullets)
   - Listing Resources (OM / Crexi / LoopNet buttons)
   - Brokerage info
   - Lead capture form (currently demo — wire to Formspree when going live)
4. **Six test pages** live (all `noindex`):
   - `/test` — single property detail (851 N McCormick Way) with lead capture
   - `/test2` — Achievement stats bar + testimonials grid + bottom CTA banner
   - `/test3` — Interactive map view layout (list-on-left, map-on-right) — needs Google Maps API key for production
   - `/test4` — Sellers landing page with free CMA request form
   - `/test5` — Live market stats dashboard + market reports + newsletter signup + FAQ
   - `/test6` — Case studies grid + off-market signup + side-by-side property compare tool + pro team profile cards

## Important things to know

- **Broker-verified prices in `real-listings.json` win** over OM data when they conflict. McCormick Way OMs showed $5,250,000 / $3,950,000 but JSON has $5,115,000 / $3,825,000 — JSON is correct, detail pages were updated to match JSON.
- **OM source pattern:** RealNex marketedge OMs are FlipBook PDFs. The direct PDF URL is `https://marketedge.realnex.com/flipbook/{propid}/{propid}.pdf`. Download with Python `requests`, extract with `pdfplumber`. WebFetch alone returns blank — only the PDF works.
- **Eagle Mountain (`propid=169603-1`)** is shared by 15+ listings. Page 7 of that OM has a parcel-by-parcel table BUT it's image-embedded, no extractable text. Eagle Mountain listings are deliberately NOT clickable on the main grid (they go straight to the OM via the "View OM" button). To enable Eagle Mountain detail pages, Stockton needs to provide the parcel data manually.
- **Lead form** on `test.html` and `listing.html` is demo only — JS just shows a success state. To go live: wire to Formspree (free tier 50 leads/mo, paid $8/mo unlimited).

## Pending decisions / TODO list

- [ ] Stockton picks which test pages (test2-test6) to merge into `index.html`. Each is self-contained and can drop in as new sections.
- [ ] Wire lead capture forms to Formspree (or another backend)
- [ ] Replace placeholder numbers in test2 stats bar / test4 hero / test5 market stats with real Team Utah Commercial figures
- [ ] Replace placeholder testimonial quotes in test2 with real client quotes
- [ ] Decide whether to add Eagle Mountain individual detail pages (needs parcel data manually entered)
- [ ] If keeping test3 map view: get a Google Maps API key
- [ ] If keeping test4 sellers page: add to main nav and wire form
- [ ] If keeping test5 reports: create or commission the actual PDF whitepapers
- [ ] If keeping test6 off-market list: add backend to capture leads / set up email automation

## Backup tags on GitHub
Most recent: `backup-20260428-1200` and `backup-20260428-pending-reorder`. Roll back with `git checkout <tag>`.

## Continue this work

Pick up wherever Stockton directs. He may say things like:
- "Merge test2 into the main page" → take the achievement bar + testimonials + CTA from `test2.html` and integrate them into `index.html` in their proposed positions
- "Build out [X] for real" → wire the form / fetch real data / etc.
- "Fix [Y]" → just edit, commit, push, move on
- Raw data pastes ("price is now 976,180") → find matching listing in `real-listings.json` by partial address and update

Don't propose plans before doing work unless I ask. Push everything with `git -c credential.helper=wincred push origin main`. Read `MEMORY.md` in `~/.claude/projects/D--Claw-empire/memory/` for additional context if it's there.
