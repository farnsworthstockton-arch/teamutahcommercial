# Designations & Courses

Tracking system for Stockton Farnsworth's professional certifications.

**Source:** [agentcertifications.org](https://agentcertifications.org) — support@agentcertifications.org

## Folder Layout

```
designations/
├── tracker.db              SQLite database (status, dates, CE hours, notes)
├── tracker.py              CLI to view/update progress
├── certificates/           PDF certificates after completion (one per designation)
├── course-materials/       PDFs, slides, downloads from each course
├── notes/                  Personal notes/summaries per course (markdown)
├── exam-prep/              Practice tests, flashcards
└── badges/                 Digital badge images (for use on bio page)
```

## File Naming Convention

Use the short code prefix (e.g. `CREN_certificate.pdf`, `CREN_notes.md`, `CREN_badge.png`).

## Roster

### Designations (13)
| Code | Name |
|------|------|
| CREN | Certified Real Estate Negotiator |
| CELA | Certified Expert Listing Agent |
| CLE  | Certified Listing Expert |
| CBDA | Certified Business Development Agent |
| NHCP | New Home Certified Professional |
| CMREP| Certified Mobile Real Estate Photographer |
| CLME | Certified Listing Marketing Expert |
| CBA  | Certified Buyers Agent |
| CSI  | Certified Sales Interrogator |
| PLA  | Professional Listing Agent |
| CSE  | Commercial Sales Expert |
| CLHA | Certified Luxury Home Agent |
| CLA  | Commercial Leasing Agent |

### Courses (4 — training, no designation letters)
- Ultimate Real Estate Success Bundle
- AI Masterclass
- Social Media Mastery
- Converting Buyer and Seller Leads

## Workflow

1. **Enroll** — set status to `enrolled`, fill `enrolled_date`
2. **Study** — drop materials into `course-materials/`, notes into `notes/`
3. **Complete** — set status to `completed`, fill `completed_date`, save cert to `certificates/`, badge to `badges/`
4. **Publish** — bio page auto-pulls completed designations from `tracker.db` (or static JSON export)
