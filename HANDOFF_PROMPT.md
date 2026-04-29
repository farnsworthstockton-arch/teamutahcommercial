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

**Production pages (linked from main nav):**
- `index.html` — main page, property grid with filters, team section, past projects
- `listing.html` — dynamic detail page (reads `?address=` URL param, fetches `real-listings.json`)
- `eagle-mountain.html` — Monte Vista Ranch summary page (16 EM parcels share one OM, all EM cards link here)
- `clients-served.html` — client logo wall

**Hidden / unannounced (live but not in nav):**
- `map.html` — production-ready Leaflet map (no API key, OSM tiles), all 35 listings pinned. Map View nav link was REMOVED from index.html pending approval. Re-add `<a href="map.html" class="nav-btn"><i class="fas fa-map-marked-alt"></i> &nbsp;Map View</a>` to index.html nav when approved.

**Test pages (`noindex,nofollow`, not in nav):**
- `test.html` — Investment Analyzer: cap rate / cash-on-cash / DSCR calculator pulling from real listings
- `test2.html` — Achievement stats bar + testimonials grid + CTA banner
- `test3.html` — Map view *concept* (real version is `map.html`)
- `test4.html` — Sellers landing page + free CMA request form
- `test5.html` — Live market stats dashboard + market reports + newsletter + FAQ
- `test6.html` — Case studies + off-market signup + property compare table + pro team profile cards

**Supporting:**
- `style.css` — all styles
- `script.js` — listings rendering, filtering, clickable photo wrapping
- `real-listings.json` — single source of truth (broker-verified prices/data)
- `Team Utah Commercial Listings.xlsx` — Excel mirror, kept in sync via `excel-to-json.py`
- Listing photos in `photos/<listing-folder>/`, brand logos in `logos/`

## Workflow & gotchas

- Edit locally → `git add -A && git commit -m "..." && git push` → GitHub Pages deploys ~2 min
- Git push must use `git -c credential.helper=wincred push origin main` from PowerShell — the default `manager` credential helper throws BadImageFormatException but `wincred` falls back and the push actually succeeds despite the noisy stderr
- Before large changes, create a backup tag: `git tag -a "backup-YYYYMMDD-HHMM" -m "..." && git push origin <tagname>`
- After pushing, GitHub Pages CDN serves cached HTML to browsers for a while — if Stockton says "I still see the old version," tell him to hard-refresh (`Ctrl+Shift+R` Windows / `Cmd+Shift+R` Mac). Server-side, you can verify by `curl -s` of the URL
- **Email domain:** all `@teamutahcre.com` (NOT `@teamutahcommercial.com`). The site domain itself is teamutahcommercial.com but the email tld is teamutahcre.com (legacy). Don't change that
- **No emojis in files** unless explicitly asked

## Compliance / immovable facts

- Brokerage: RE/MAX Associates · 6955 S Union Park Center, Suite 140, Cottonwood Heights, UT 84047
- Equal Housing Opportunity logo stays in footer
- "#1 in Utah 2025" claim is legitimate — keep the year
- Robert Farnsworth: 801.898.8810
- Stockton Farnsworth: 801.664.3370 (also 801-664-3370 format on clients-served.html — preserve hyphens there)
- Email: Robert@teamutahcre.com

## Known broker-verified data ground truths

- **JSON prices win** when they conflict with OM data. Example: McCormick Way OMs show $5,250,000 / $3,950,000 but JSON is $5,115,000 / $3,825,000 — JSON is correct.
- **Eagle Mountain (`propid=169603-1`) is shared** by 16 listings. Page 7 of that OM has individual parcel data BUT is image-embedded — no extractable text. EM cards intentionally route to `eagle-mountain.html` (the summary page) instead of individual `listing.html` detail pages. To enable per-parcel detail pages, Stockton would need to provide the parcel data manually.
- **OM source pattern (for retrieval):** RealNex marketedge OMs are FlipBook PDFs. Direct PDF URL is `https://marketedge.realnex.com/flipbook/{propid}/{propid}.pdf`. Download with Python `requests`, extract with `pdfplumber`. WebFetch alone returns blank — only the PDF works.
- **Clickable card behavior:** the photo on each property card is a real `<a>` link. Card detection uses `property.omLink` (NOT `property.om` — that field doesn't exist on the mapped grid object).

## Pending decisions / TODO list

- [ ] Stockton picks which test pages (test.html, test2-test6.html) to merge into the live site. Each is self-contained.
- [ ] Wire all lead capture forms to a backend (Formspree free tier 50/mo, paid $8/mo unlimited). Forms exist on: `listing.html`, `test.html` (mailto fallback), `test4.html`, `test6.html`
- [ ] Replace placeholder numbers — `$XXXm+`, `XXX+`, `Years Experience` etc. on `test2.html` and `test4.html` with real Team Utah Commercial volume / experience figures
- [ ] Replace placeholder testimonial quotes in `test2.html` with real client quotes
- [ ] Real market stats (vacancy, cap rates, rent) on `test5.html` — currently rough industry estimates
- [ ] Real PDF whitepapers for `test5.html` market reports section (currently buttons go to `#`)
- [ ] Decide whether to enable Map View in main nav. If yes, re-add the nav link to `index.html` (instructions above)
- [ ] If keeping `test6.html` off-market signup: add backend to capture leads / set up email automation
- [ ] Eagle Mountain individual parcel detail pages — needs manual data entry from Stockton (page 7 of OM is image-only)

## Backup tags on GitHub

Most recent: `backup-20260428-1200`. Roll back with `git checkout <tag>`. Create new ones before large changes.

## How to continue

Read this file, then pick up wherever Stockton directs. He'll say things like:
- "Merge test4 into the site" → take the sellers landing concept from `test4.html`, create a real `sellers.html`, add nav link, wire the form
- "Add a [feature]" → just build it, commit, push, move on
- "Fix [Y]" → just edit, commit, push
- Raw data pastes ("price is now 976,180") → find matching listing in `real-listings.json` by partial address and update, push

Don't propose plans before doing work unless asked. Push everything with `git -c credential.helper=wincred push origin main`. If you can't find something in this file, check `MEMORY.md` in `~/.claude/projects/D--Claw-empire/memory/` for additional context.

## Recent history (since last handoff)

- Built `eagle-mountain.html` summary page with full OM context (482 acres, demographics, energy corridor, all 16 parcels in a card grid)
- Built `map.html` production map with Leaflet + OSM (35 pins, sidebar list, filter buttons, popups)
- Updated all property cards to be clickable — photo wraps in `<a>` tag, whole card outside buttons also navigates
- Routed Eagle Mountain cards to `eagle-mountain.html`, others to `listing.html?address=...`
- Replaced original `test.html` (was implemented) with new Investment Analyzer — interactive cap rate / DSCR / cash-on-cash calculator pulling real listing data
- Removed Map View link from main nav (still pending approval)
- Bulk-updated all email domains across all HTML pages to `@teamutahcre.com`
- Replaced `info@teamutahcommercial.com` on clients-served with Stockton's phone
- Fixed garbage `&nbsp;` rendering in listing.html hero subtitle (was using `textContent` instead of decoded chars)
