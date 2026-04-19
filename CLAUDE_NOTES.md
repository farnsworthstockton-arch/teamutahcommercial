# Team Utah Commercial — Claude Session Notes
**Last updated:** 2026-04-19  
**Live site:** https://teamutahcre.com  
**GitHub repo:** https://github.com/farnsworthstockton-arch/teamutahcommercial (branch: main)  
**Local repo:** `D:\Claw empire\teamutahcommercial\`

---

## Stack
- Static site on GitHub Pages (auto-deploys on push to main)
- No build step — plain HTML/CSS/JS
- Listings data loaded at runtime via `fetch('real-listings.json')`

---

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main site — header, auction section, listings, team, footer |
| `script.js` | Loads + renders listings from real-listings.json |
| `style.css` | All styles |
| `real-listings.json` | Master listings data (edit this to add/change/remove listings) |
| `clients-served.html` | Subpage — all 15 client logos |

---

## Photo Folders
Drop property photos here: `D:\Claw empire\teamutahcommercial\photos\`

Each property has a subfolder. The filename must match the `photo` field in `real-listings.json`.

```
photos/
├── wellsville/
│   ├── 1-exterior.jpg      ← exterior (shown first on site)
│   ├── 2-theater.jpg
│   └── 3-dining.jpg
├── jordan-canal/
│   └── 1-auto-from-realnex.jpg
├── magna-main-8987/
│   └── 1-auto-from-realnex.jpg
├── layton-main/
│   └── 1-auto-from-wfrmls.jpg
├── mccormick-851/
│   └── 1-auto-from-realnex.jpg
├── mccormick-855/
│   └── 1-auto-from-realnex.jpg
├── belladonna-1295/
│   └── 1-auto-from-realnex.jpg
├── jasmine-1448/
│   └── 1-auto-from-realnex.jpg
├── belladonna-1290/
│   └── 1-auto-from-wfrmls.jpg
├── belladonna-1174/
│   └── 1-auto-from-wfrmls.jpg
├── eagle-mtn-corridor/
│   └── 1-auto-from-wfrmls.jpg
├── piper-ln/
│   └── 1-auto-from-wfrmls.jpg
└── team-group.jpg          ← team group photo
```

**To add a photo for a new property:**
1. Create a subfolder under `photos/`
2. Drop the image in
3. Add `"photo": "photos/your-folder/filename.jpg"` to that listing in `real-listings.json`
4. Commit + push

**Properties with NO photo yet** (show stock image based on type):
- 210 E Main St, American Fork
- 512 E Larchwood Dr (Income)
- 2955 E 3500 S Stefanoff Farms
- All Belladonna/Jasmine/Peony lots except 1295, 1448, 1290, 1174
- Eagle Mountain Retail Land
- 3000 Lake Mountain Rd
- All FOR LEASE listings
- All PAST PROJECTS

---

## Listings Data (`real-listings.json`)

### Sections
- `"section": "FOR SALE"` — shows in For Sale section
- `"section": "FOR LEASE"` — shows in For Lease section
- `"section": "PAST PROJECTS"` — always shown at bottom, greyed out, NOT filtered

### Status badge
- Add `"status": "Under Contract"` to show red badge (currently only on 8987 Magna Main St)

### Acreage
- Set `"acres": 1.23` to show acreage on the card
- Confirmed NO acreage data available anywhere for: 1344 E Jasmine, 2694 N Peony (parcel table in OM PDF is image-based, not text-extractable)

### Current counts
- 25 FOR SALE
- 5 FOR LEASE
- 5 PAST PROJECTS

---

## Logos
```
logos/
├── team-utah-commercial.png   ← TURE logo (header + footer)
└── remax-commercial-navy.jpg  ← RE/MAX logo (header + footer)
```

---

## Team Phone Numbers (real, confirmed)
- Robert Farnsworth: 801.898.8810
- Randy Cummins: 801.641.8004
- Ashlee Bonham: 801.602.6850

---

## Client Logos
All 15 in `clients/` folder. Referenced in `clients-served.html`.
Toll Brothers, Meritage Homes, LGI Homes, Redstone, Brown Group, Alchemy Development,
Grand Noble, Century Communities, Fieldpiece, Big Ben's, Ascent Academies,
Ironworkers, CWA, KIHOMAC, Rumack Trusts Partnership

---

## Git Workflow
```bash
cd "D:\Claw empire\teamutahcommercial"
git add .
git commit -m "your message"
git push origin main
# GitHub Pages deploys automatically in ~1-2 min
```

If git identity error:
```bash
git config user.email "stockton@teamutahcre.com"
git config user.name "Stockton Farnsworth"
```

---

## Known Issues / TODO
- Acreage missing for several Belladonna/Jasmine/Peony lots (data not accessible in any source)
- Several listings have no photos yet (see list above)
- Wellsville auction link goes to FRE.com/539 (already set correctly in index.html)
- 8987 Magna Main is "Under Contract" — remove status field when deal closes
