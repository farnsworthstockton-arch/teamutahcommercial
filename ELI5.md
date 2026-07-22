# ELI5 — Team Utah Commercial Website

_Last verified: 2026-07-22 (checked against README, TODO.md, CLAUDE_NOTES.md, and the actual files)_

## 1. What it is

This is the public website for **Team Utah Commercial**, Stockton's commercial
real estate team at RE/MAX. It's a plain website (HTML, CSS, and a little
JavaScript — no database, no login) that lives online at
**teamutahcommercial.com**. It shows all the properties the team has for sale
or for lease, a page of past deals, the logos of clients they've worked with,
Stockton's agent page, a blog full of Utah CRE articles, a glossary, and a few
free calculator-style tools. When someone opens the site, the property cards are
built on the fly by reading a single data file (`real-listings.json`), so
updating a listing is just editing that file and pushing it.

## 2. Why it exists

Stockton needs one professional, always-on place to send buyers, sellers, and
tenants instead of mailing PDFs one at a time. The site solves a few problems:

- **A shop window for every listing.** Buyers can filter by type (office,
  retail, industrial, land), county, and price, search by address, see photos,
  price, square footage, and download the offering memorandum, then email the
  broker in one click.
- **Credibility.** The "Clients Served" logo wall, past-projects section, agent
  designations, and blog make the team look established and make Stockton
  discoverable on Google.
- **Low effort to keep current.** Because listings come from one JSON file (and,
  optionally, from an Excel-driven sync pipeline), adding or changing a property
  doesn't mean rebuilding the whole site.

## 3. How it works

Think of the site as a printed brochure whose pages are filled in automatically
from a spreadsheet. The layout (`index.html`, `style.css`) is fixed. The list of
properties lives in `real-listings.json`. When the page loads, `script.js` reads
that file and stamps out one card per property into the For Sale, For Lease, and
Past Projects sections. Photos live in per-property folders under `photos/`, and
each listing points at its own folder.

There's also an optional **listing sync pipeline** (in the sibling
`teamutahcommercial-data` folder) that watches a marketing Excel workbook, spots
changes, and re-generates the JSON and photo staging automatically. It's built
and tested but currently dormant — auto-deploy is off and it isn't scheduled to
run on its own yet, so today listings are updated by hand.

The whole site is hosted for free and re-publishes itself every time changes are
pushed to the `main` branch on GitHub (Cloudflare Pages / GitHub Pages
auto-deploy). No servers to babysit.

## 4. Current status

- **Live and deployed** at teamutahcommercial.com, auto-deploying from `main`.
- **Roughly 34 listings** on the site: about 23 for sale, 6 for lease, 5 past
  projects (counts drift as deals open and close).
- **Clients Served page:** ~39 client logo cards (E.M. Founders Group added
  2026-07-13).
- **Sync pipeline:** built and verified (33 listings parsed, 31 with photos) but
  **dormant** — not auto-deploying and not in Task Scheduler.
- **Known gaps / waiting on Stockton:** a Discord webhook for sync
  notifications, a one-time git-credentials-fix push, confirming a few
  price/acreage numbers that disagree between the Excel and the JSON, per-parcel
  data for the 16 Eagle Mountain listings that currently share one OM, and
  turning on site analytics. These are tracked in `TODO.md`.
- **Latest fix:** the CRE Tools hub no longer loads the homepage's property-listing
  code. That code expected filters and a property grid that do not exist on the
  tools page, so removing it prevents a background JavaScript error on every visit.
