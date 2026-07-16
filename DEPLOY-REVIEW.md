# Deploy Review — `seo-pass-2026q3`

5-minute summary for Stockton before merging to `main` (public Cloudflare Pages deploy).

**Scope:** SEO/meta tags, social share cards, sitemap, and a minified JS build. All offline, no
data values changed, no deploy triggered. This branch builds on the accessibility/SEO/perf pass
already on `main` (commit `54ef30d`) — most pages already had titles, meta descriptions, canonical
tags, and per-listing JSON-LD from that earlier work, so this pass filled in the remaining gaps.

## What changed

1. **Meta tags on the pages that were still missing them**
   - `designation.html` — was the only page with no meta description, canonical, or Open Graph
     tags. It's a client-rendered detail page (`designation.html?code=CREN`), so the tags are now
     set dynamically per designation in `render()`, same pattern already used on `listing.html`.
   - `stockton.html` — had a meta description already but no canonical/OG tags. Added, using the
     existing headshot photo (`photos/team/stockton-headshot.jpg`) as `og:image`.
   - `glossary.html` — had title/description/canonical but no OG/Twitter tags. Added.

2. **`sitemap.xml` refresh** — was stale (3 URLs: home, clients-served, stockton.html). Now
   includes all 9 static pages, all 10 blog posts, and all 16 listings that have their own
   `listing.html?address=...` detail page (Eagle Mountain parcels share one OM and route to
   `eagle-mountain.html` instead, so they're represented by that one URL, not 16 separate ones).
   35 URLs total, `test*.html` excluded as required.

3. **`scripts/generate-og.mjs`** (new, no dependencies) — reads `real-listings.json` and
   regenerates `og/listings.json` (per-listing OG title/description/image/url) and `sitemap.xml`
   in one run. Run it after any listing change so both stay in sync:
   ```
   node scripts/generate-og.mjs
   ```
   Output is committed (`og/listings.json`) so the data doesn't depend on a build step running in
   production — Cloudflare Pages just serves the static files as-is.

4. **`script.min.js`** (new) — a conservative, dependency-free minifier
   (`scripts/minify.mjs`) strips comments and collapses whitespace from `script.js` while leaving
   every string/template-literal/regex byte-for-byte untouched (tracked with a small state
   machine), so behavior can't change. 22,415 → 14,974 bytes (33% smaller). `index.html` and
   `cre-tools.html` (the two pages that load `script.js`) now load `script.min.js` with `defer`
   instead. The readable `script.js` source is untouched and stays in the repo.

5. **Verified, no changes needed:**
   - Alt text — every `<img>` across all real pages already has an `alt` attribute (checked
     programmatically, zero misses).
   - JSON-LD `Offer` schema — already present in `listing.html`'s per-property structured data
     (added in the prior SEO pass).
   - Listing-photo layout shift — property-card photos are CSS `background-image` divs with a
     fixed `height: 200px` (`style.css`), not `<img>` tags, so there's no CLS to fix and native
     `loading="lazy"` doesn't apply to them (it's an `<img>`-only attribute). Logo/footer `<img>`
     tags already had `loading="lazy" decoding="async"` from the prior pass.

## Verification performed

- `node --check` on `script.min.js` (and confirmed key function names/strings survived intact).
- `python3 -c "import xml.etree.ElementTree as ET; ET.parse('sitemap.xml')"` — valid XML.
- Local static server (`python3 -m http.server`) — 200 on every changed/new file
  (`index.html`, `cre-tools.html`, `script.min.js`, `script.js`, `designation.html`,
  `stockton.html`, `glossary.html`, `sitemap.xml`, `og/listings.json`, `real-listings.json`).
- No visual changes — only `<head>` metadata, one `<script src>` swap, and new files were touched.

## Not done / out of scope for this pass

- Individual `listing.html?address=` detail pages for the two unnamed Eagle Mountain assemblages
  are still pending parcel numbers from Stockton (see `TODO.md` — unrelated to this branch).
- Per-listing SVG share-card images (the task description mentioned this as an option) were not
  built — `og/listings.json` reuses each listing's existing photo as `og:image` instead, which is
  simpler to keep in sync and avoids introducing an image-generation dependency offline.
