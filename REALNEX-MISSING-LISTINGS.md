# RealNex — listings missing from MarketPlace

Site (`teamutahcommercial.com/real-listings.json`, 40 entries) vs RealNex MyListing, **2026-09-23**.
All new listings created as **Draft**. Status stays Draft until Stockton reviews.

---

## Created 2026-09-23 — 6 of 10, all verified after reload

| RealNex ID | Name | Type | Price | Size | Parcel | Address stored |
|---|---|---|---|---|---|---|
| 4123000 | 1344 E Jasmine (lot 309) | Vacant Land - Industrial | $1,306,800 | 2.00 Ac | 71-025-0309 | Eagle Mountain, UT |
| 4123005 | 1290 E Belladonna (lot 311) | Vacant Land - Industrial | $976,180 | 2.49 Ac | 71-025-0311 | Eagle Mountain, UT |
| 4123006 | 1296 E Jasmine (lot 401) | Vacant Land - Industrial | $363,807 | 0.86 Ac | 71-025-0401 | Eagle Mountain, UT |
| 4123010 | Eagle Mountain Commercial | Vacant Land - Commercial | — | 77.36 Ac | 59-055-0022 | Eagle Mountain, UT |
| 4123011 | EM Commercial Corridor | Vacant Land - Industrial | — | 90.81 Ac | 59-056-0037 | Eagle Mountain, UT |
| 4123012 | Southgate Office Park - Suite 1202 A | Office | — | 1,325 SF | 27-24-427-014 | ⚠️ **WRONG — see below** |

### 🔴 Listing 4123012 has the wrong street address

It currently reads **`12433 South Fort Street, Draper, UT 84020`**.
It should be **`11576 S State Street, Draper, UT 84020`**.

Cause: RealNex's address picker only accepts a location produced by its own map widget's
reverse-geocode. A stray click on the map dropped a pin at a random Draper point and that is what
got saved. Typing the correct street into the Street box displays correctly but is **rejected on
save** (verified — it reverts). **Fix this by hand before the listing goes Active.**

All Eagle Mountain listings show only "Eagle Mountain, UT" because Google has no address data for
the new Monte Vista streets, so the picker cannot produce one. Not wrong, just incomplete.

Parcels and acreages verified against `Parcel Addendum - OM Version 9.12.2026.xlsx`
(`D:\teams\Team Utah Homes\Team+UT+CRE - Documents\1-Monte Vista Ranch LC - Tiffany Walden\Docs\`).

**Addendum vs website discrepancies** (addendum governs): lot 401 acreage 0.8566 vs site 0.86 ·
parcel B (Pony Express) 68.98 ac vs site 69.98 · parcel C (Piper Ln) 115.98 ac vs site 115.96.

---

## Still to create — 4

| Name | Listing type | RealNex Type | Rate | Size | City | Parcel |
|---|---|---|---|---|---|---|
| Southgate Office Park - Suite 1202 B | For Lease | Office | $26.00/SF | 1,325 SF | Draper, UT 84020 | 27-24-427-014 |
| 3666 S State Street | For Lease | Retail - Retail Pad | — | 1.81 Ac | confirm city | — |
| 1145 Washington Blvd — Suite 1 | For Lease | Shopping Center / Retail | $26.00/SF | 1,526 SF | Ogden, UT 84404 | 12-110-0058 |
| 62 N Country Way — Units 1 & 2 | For Lease | Industrial | — | 9,030 SF / 1.32 Ac | Washington, UT 84780 | W-SVIP-2-34 |

Site marks both Southgate suites **Pending** → set In Contract, not Active, when they go live.
EM Commercial Corridor is also **Pending** on the site.

62 N Country Way parcel confirmed from the Washington County property report
(`D:\downloads data\CRE Work\Documents\62_N_Country_Way_Parcel_W-SVIP-2-34_Combined.pdf`):
account no. W-SVIP-2-34, parcel ID 1211846, Sunrise Valley Industrial Park, owner Dedicated
Plumbing LLC, county data 4/26/2026.

### Lease listings need a "Space"

RealNex prompts: *"This listing does not have any spaces. At least one space with status
'Available' is required for the listing to be active."* The **rent rate lives on the Space, not on
the Info tab** — there is no price field on a lease listing's main form. So each lease listing
needs a Space added with its SF and $/SF before it can go Active.

---

## Photos

**Blocked on one thing:** RealNex's Manage Photos dialog requires ticking **"I Agree"**, confirming
the unfettered right to publish the content without violating third-party rights. That is
Stockton's to accept, not Claude's.

**Good news — the Teams folders have plenty of first-party photos** (team cellphone photos and
renderings, not MLS):

| Listing | Source | Count |
|---|---|---|
| Southgate 1202 A & B | `Team+UT+CRE - Documents\11576 S State St - Tisoy Properties - Ashley Clark\Cellphone photos\` | 84 |
| 3666 S State Street | `Team+UT+CRE - Documents\3666 S State Street-Tina Rastan-Chicken Express\Photos\` | 24 |
| 62 N Country Way | `Team+UT+CRE - Documents\62 N Country Way- Washington UT 84780\Marketing\` — incl. `New Rendering Dedicated Plumbing.png` | 4 + renderings |
| Monte Vista lots | no folders for lots 309/311/401 or parcels A/D; website copies only | — |
| 1145 Washington Blvd | no Teams folder found | — |

⚠️ The website copy for 1290 E Belladonna is `photos/belladonna-1290/1-auto-from-wfrmls.jpg` —
**pulled from the MLS**. MLS photos usually belong to the listing broker or photographer. Confirm
before using that one.

---

## Also on the site but not in RealNex — probably deliberate

Five older past projects: 1755 W North Temple SLC · 3600 N Fairfield East Gate HAFB ·
205 W 700 South CMN SLC · 1701 S 5350 W SLC (A) · 2608 Bridger Rd SLC.

## In RealNex but not on the site — probably deliberate

7877 US-89 Wellsville (Off Market, Robert's) · Magna Main Restaurant (Off Market) ·
8987 W Magna Main / Art Sanchez (Off Market) · 1031 Sublease Orem (Leased).

## RealNex housekeeping

Two duplicate address-less Drafts repeating listings that already exist properly:
`3000 Lake Mountain Rd 590190021` and `2900 N Pony Express Pkwy 590560053`.
Not touched — deleting is off limits.

## How to create a listing (the Add New button is broken)

The Add New button is a Bootstrap modal trigger with **no click handler bound** — it only shows its
tooltip. Open the dialog from the console instead:
`$('#NewListingModal').modal('show')`. Full notes in memory: `reference_realnex_listing_ui`.
