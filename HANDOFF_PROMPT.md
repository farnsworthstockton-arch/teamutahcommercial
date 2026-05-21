# Handoff Prompt — Team Utah Commercial Site (Listings Focus)

Copy everything below the line into a new Claude Code session.

---

I'm Stockton Farnsworth (broker at RE/MAX Associates, Team Utah Commercial). Maximum hands-off: describe what I want, you execute everything including git commits and pushes. Don't ask permission for routine edits, just do them and push. No emojis in files unless I ask. Don't propose plans before doing work unless I ask.

**Project:** `D:\Claw empire\cre-sites\teamutahcommercial\` · GitHub `farnsworthstockton-arch/teamutahcommercial` · Live `https://teamutahcommercial.com` (Pages auto-deploys from `main` ~2 min). Plain static HTML/CSS/JS/JSON.

## Push command (memorize this — the default credential helper fails)

```powershell
git -c credential.helper=wincred push https://farnsworthstockton-arch@github.com/farnsworthstockton-arch/teamutahcommercial.git main
```

The bare `git push origin main` either errors out (BadImageFormatException) or grabs the wrong GitHub account ("Aettam") and 403s. The username-qualified URL above always works.

If I say "I still see the old version" → tell me to hard-refresh (Ctrl+Shift+R / Cmd+Shift+R). GitHub Pages CDN caches HTML.

## My focus for this session: LISTINGS

I'm not touching design consistency, branding tweaks, or the test pages right now. I want to work on **the listings themselves** — adding new ones, updating prices/status, fixing data, photos, OM links, anything listing-related.

## The data flow you MUST understand

1. **`real-listings.json`** — source of truth for what the website displays. The website's grid, map pins, listing.html detail pages, eagle-mountain.html parcel grid, and analyzer.html all read from this file. Edit this and the whole site updates.

2. **`Team Utah Commercial Listings.xlsx`** — broker's master Marketing Worksheet. Has more columns than the JSON (RealNex link, Facebook post, X post, Instagram post, KSL, WFRMLS, YouTube, Gold Connect, etc). The xlsx may have NEWER data than the JSON — when in doubt, ask me which one is current.

3. **Photos** live in `photos/<listing-slug>/`. Reference them in JSON like `"photo": "photos/mccormick-851/1-auto-from-realnex.jpg"`.

4. **Eagle Mountain (16 listings)** share one OM (`propid=169603-1`). Their cards all route to `eagle-mountain.html` (a Monte Vista Ranch summary page), NOT to individual `listing.html` detail pages. Page 7 of that OM has per-parcel data but is image-embedded — not extractable. To enable individual EM detail pages, I'd need to provide the parcel data manually.

5. **All other listings** with an OM get their own `listing.html?address=<address>` detail page, populated from JSON + per-property OM-extracted content in the `PROPERTY_CONTENT` object in `listing.html`.

## Listing JSON shape

```json
{
  "address": "851 N McCormick Way",
  "type": "Industrial",
  "section": "FOR SALE",       // or "FOR LEASE" or "PAST PROJECTS"
  "status": "Under Contract",  // optional — appears as a status pill
  "acres": 1.5,                // optional
  "acresDisplay": "2,776 W/water",  // optional override for display
  "sf": null,                  // optional
  "price": 5115000,            // for FOR LEASE this is $/SF/yr
  "photo": "photos/mccormick-851/1-auto-from-realnex.jpg",
  "om": "https://marketedge.realnex.com/ePublish.aspx?propid=169863-1",
  "crexi": "https://www.crexi.com/properties/...",
  "loopnet": "https://www.loopnet.com/Listing/..."
}
```

## Known pending listings work

Tell me which of these you want to tackle:

- **NEW: Wellsville Recovery Center** — in the xlsx but NOT in JSON yet. $8,500,000, 23.12 acres, FRE auction 3/18/26, Retail. URLs: RealNex `4104821`, Crexi `2167364`, LoopNet `37399865`, OM propid `167851-1`. Featured on `test3.html` (Auction Center test page).
- **xlsx ↔ JSON discrepancies** — several pricing/acreage differences. Examples: Stefanoff Farms ($75M in xlsx, null in JSON), 1213/1239/1267 Belladonna distinct prices in xlsx vs JSON flattening to identical $341,075, 1290 Belladonna acres 4.21 vs 2.49, 1232 Belladonna acres 77.36 vs 4.19. I'll tell you which to sync.
- **Eagle Mountain individual detail pages** — need parcel data manually (OM page 7 is image-only).

## How to add a new listing (the recipe)

1. Add the object to `real-listings.json`. Match the existing field shapes exactly.
2. Drop photos into `photos/<slug>/`.
3. If it has a unique OM, add a content entry to `PROPERTY_CONTENT` in `listing.html` with `overview` paragraphs and `highlights` bullets (extract from the OM PDF — see below).
4. If it has unique coordinates, add to the `COORDS` object in `map.html`.
5. Also update `Team Utah Commercial Listings.xlsx` to keep the broker worksheet in sync.
6. Commit and push.

## How to extract OM content from RealNex

RealNex marketedge OMs are FlipBook PDFs at:
```
https://marketedge.realnex.com/flipbook/{propid}/{propid}.pdf
```

Download with Python `requests`, extract text with `pdfplumber`. WebFetch alone returns blank — only the PDF endpoint works.

## How to update an existing listing

I'll usually paste the change like:
- "Price is now 976,180 on 1290 Belladonna" — find by partial address in JSON, update, push.
- "Mark 855 McCormick as Under Contract" — set `"status": "Under Contract"` in JSON, push.
- "Add LoopNet link to Wellsville" — update the field, push.

## Data ground truths

- **JSON prices win** over OM-extracted prices when they conflict (broker-verified).
- **Email domain is `@teamutahcre.com`** (NOT teamutahcommercial.com — that's the website domain). Robert@teamutahcre.com.
- **Phone format**: hyphens (`801-898-8810`), not dots.

## Pages and what reads from JSON

| Page | What it shows |
|---|---|
| `index.html` | Active Listings grid, Pending Listings, Sold Listings |
| `listing.html?address=...` | Per-property detail page |
| `eagle-mountain.html` | 16 EM parcels in a grid |
| `map.html` | All 35+ listings pinned on a Leaflet map |
| `analyzer.html` | All FOR SALE listings selectable in the calculator dropdown |
| `test3.html` | Auction Center (currently features Wellsville hardcoded) |

If you add a listing to JSON, it shows up everywhere automatically. If you need it on the map, also add coords to `map.html` COORDS object.

## Don't touch (unless I ask)

- Site design / consistency / branding (we just finished a polish pass)
- Test pages content (test, test2, test4, test5, test6 — those are pending review)
- Footer / header structure (canonical and consistent now)
- `analyzer.html` calculator logic
- `script.js` rendering logic

## Continue

Read this file, then ask me which listing change to start with, OR just start working if I've already pasted instructions.
