# Handoff Prompt — Team Utah Commercial Site

Copy everything below the line into a new Claude Code session.

---

I'm Stockton Farnsworth, commercial real estate broker, RE/MAX Associates. Maximum hands-off: describe what I want, you execute everything including git commits and pushes. Don't ask permission for routine file edits, just do them and push. No emojis in files unless I ask. Don't propose plans before doing work unless I ask.

## Project

**Local:** `D:\Claw empire\teamutahcommercial\`
**GitHub:** `farnsworthstockton-arch/teamutahcommercial`
**Live:** `https://teamutahcommercial.com` (GitHub Pages, auto-deploys from `main` ~2 min)
**Stack:** Plain static — HTML / CSS / JS / JSON. No build step. No framework.

## Files

**Production (linked from main nav):**
- `index.html` — main page, property grid with filters, team, past projects
- `listing.html` — dynamic detail page (reads `?address=` URL param)
- `eagle-mountain.html` — Monte Vista Ranch summary (all 16 EM cards route here)
- `clients-served.html` — client logo wall

**Hidden / unannounced:**
- `map.html` — production Leaflet map with all 35 listings pinned. Nav link was removed pending approval — re-add `<a href="map.html" class="nav-btn"><i class="fas fa-map-marked-alt"></i> &nbsp;Map View</a>` to index.html nav when approved.

**Test pages (`noindex,nofollow`, not in nav):**
- `test.html` — Investment Analyzer (cap rate / DSCR / cash-on-cash calculator)
- `test2.html` — Achievement stats + testimonials + CTA
- `test3.html` — Map view concept (real version is `map.html`)
- `test4.html` — Sellers landing + free CMA form
- `test5.html` — Market stats + market reports + newsletter + FAQ
- `test6.html` — Case studies + off-market signup + property compare + pro team cards

**Supporting:**
- `style.css` — all styles
- `script.js` — listings rendering + clickable card photo wrapping
- `real-listings.json` — source of truth for what the WEBSITE displays
- `Team Utah Commercial Listings.xlsx` — broker's master Marketing Worksheet (more complete than JSON; has all marketing channel links: RealNex, Crexi, LoopNet, WFRMLS, KSL, Facebook, X, Instagram, YouTube). This was rebuilt from `D:\downloads data\Marketing_Worksheet Updated(Sheet1).csv`
- `excel-to-json.py` — Excel → JSON helper (legacy direction)
- Photos in `photos/<listing-folder>/`, brand logos in `logos/`

## Workflow & gotchas

- Edit locally → `git add -A && git commit -m "..." && git push origin main` → Pages deploys ~2 min
- **Git push workaround:** the default `manager` credential helper throws `BadImageFormatException`. Use `git -c credential.helper=wincred push origin main` from PowerShell — the push actually succeeds despite the noisy stderr
- Before large changes, create a backup tag: `git tag -a "backup-YYYYMMDD-HHMM" -m "..." && git push origin <tagname>`
- After pushing, GitHub Pages CDN serves cached HTML to browsers — if Stockton says "I still see the old version," tell him to hard-refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`). Server-side verify with `curl -s` of the URL
- **Email domain is `@teamutahcre.com`** (NOT `@teamutahcommercial.com`). The website domain is teamutahcommercial.com but the email TLD is teamutahcre.com. Don't change that
- **No emojis in files** unless asked

## Compliance / immovable facts

- Brokerage: RE/MAX Associates · 6955 S Union Park Center, Suite 140, Cottonwood Heights, UT 84047
- Equal Housing Opportunity logo stays in footer
- "#1 in Utah 2025" claim is legitimate — keep the year
- Robert Farnsworth: 801.898.8810 · Stockton Farnsworth: 801.664.3370 (also 801-664-3370 with hyphens on clients-served.html — preserve that format there)
- Robert@teamutahcre.com

## Data ground truths

- **Broker-verified JSON prices win** over OM-extracted prices (McCormick Way example: JSON $5,115,000 / $3,825,000, OM showed different numbers — JSON correct)
- **HOWEVER**, the new `Team Utah Commercial Listings.xlsx` (broker's master Marketing Worksheet) has corrections that aren't yet in `real-listings.json`. Examples:
  - Stefanoff Farms ($75,000,000 in xlsx; null in JSON)
  - 1213/1239/1267/1295 Belladonna and 1394/1448 Jasmine — several distinct prices in xlsx ($329k–$1.3M each) that JSON has flattened to identical $341,075 each
  - 1290 Belladonna acres = 4.21 in xlsx, 2.49 in JSON
  - 1232 Belladonna acres = 77.36 in xlsx, 4.19 in JSON
  - **New Wellsville Recovery Center listing** ($8,500,000, 23.12 acres, FRE auction 3/18/26) — in xlsx, NOT in JSON or website yet
- **When in doubt, the xlsx Marketing Worksheet is the more current source.** Ask before bulk-syncing JSON to match xlsx — Stockton may have intentional reasons for some JSON values
- **Eagle Mountain (`propid=169603-1`) is shared** by 16 listings. Page 7 of the OM has individual parcel data but is image-embedded — no extractable text. EM cards route to `eagle-mountain.html`, not per-listing pages. For per-parcel pages, need manual data entry
- **OM source pattern:** RealNex marketedge OMs are FlipBook PDFs at `https://marketedge.realnex.com/flipbook/{propid}/{propid}.pdf`. Download via `requests`, extract with `pdfplumber`. WebFetch alone gets blank pages — only the PDF works
- **Clickable card detection** uses `property.omLink` (NOT `property.om` — that field doesn't exist on the mapped grid object)
- **`textContent` doesn't decode HTML entities** — use direct chars or `innerHTML`. Past bug: `Utah &nbsp;·&nbsp;` rendered as literal text

## Pending TODO

- [ ] Decide whether to sync `real-listings.json` (and live website) to match the corrected `Team Utah Commercial Listings.xlsx` Marketing Worksheet
- [ ] Add **Wellsville Recovery Center** listing to JSON + photos folder + Eagle/site
- [ ] Pick which test pages (test, test2-test6) to merge into the live site
- [ ] Wire all lead capture forms to a backend (Formspree free 50/mo or $8/mo unlimited). Forms exist on `listing.html`, `test.html` (mailto fallback), `test4.html`, `test6.html`
- [ ] Replace `$XXXm+` / `XX+` placeholders on test2.html / test4.html with real volume + experience numbers
- [ ] Real testimonial quotes on test2.html
- [ ] Real market stats on test5.html (currently rough industry estimates)
- [ ] Real PDF whitepapers for test5.html reports section (buttons go to `#`)
- [ ] Decide whether to re-enable Map View in main nav
- [ ] Eagle Mountain per-parcel detail pages — needs manual data entry (OM page 7 is image-only)

## Useful links

- Live site: https://teamutahcommercial.com
- Repo: https://github.com/farnsworthstockton-arch/teamutahcommercial
- Spreadsheet (raw download): https://github.com/farnsworthstockton-arch/teamutahcommercial/raw/main/Team%20Utah%20Commercial%20Listings.xlsx
- Backups: most recent `backup-20260428-1200`. Roll back with `git checkout <tag>`

## How to continue

Pick up wherever Stockton directs. Typical instructions:
- "Add a listing: [address] [details]" → update `real-listings.json` AND the xlsx, drop photos in `photos/<slug>/`, push
- "Price is now [X] on [address]" → find by partial-address match in JSON, update, push
- "Merge testN into the site" → take that concept, integrate into live page(s), add nav link, wire form
- "Build a [feature]" → just build it, commit, push
- "Fix [Y]" → just edit, commit, push

If unclear about something not covered here, check `MEMORY.md` in `~/.claude/projects/D--Claw-empire/memory/` for additional context.

## Recent history

- Replaced original `test.html` (was implemented as `listing.html`) with new Investment Analyzer
- Removed Map View nav link from main page (still pending approval)
- Bulk-updated all email domains site-wide to `@teamutahcre.com`
- Replaced `info@teamutahcommercial.com` on clients-served with Stockton's phone
- Fixed `&nbsp;` garbage text on listing pages (was using `textContent` with HTML entities)
- Rebuilt `Team Utah Commercial Listings.xlsx` from the broker's master Marketing Worksheet CSV — now includes all marketing channel links and section structure (FOR SALE / FOR LEASE / PAST PROJECTS / Listing Prospects)
- Identified JSON ↔ xlsx pricing/acreage discrepancies and a missing Wellsville listing — pending Stockton decision on which to sync
