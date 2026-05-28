# 🎨 Official Logo Sources

Most official designation logos are gated behind member portals — you have to log in as the certified holder to download them. Below is the direct path for each credential you hold.

When you grab a logo, drop it into:
```
designations/items/<CODE>/logo/<CODE>_logo.png   (or .svg, .jpg)
```

The subpages auto-pick up files from that folder.

---

## NAR Designations (member login required at nar.realtor)

NAR runs a dedicated sub-site for each designation/certification. You log in once at nar.realtor, then visit the designation's site to access logos and marketing materials.

| Code | Portal | Login as |
|---|---|---|
| **EPRO** | [epro.realtor](https://epro.realtor/) | Your NRDS / NAR member login |
| **PSA** | [psa.realtor](https://psa.realtor/) | NAR member login |
| **SFR** | [sfr.realtor](https://sfr.realtor/) | NAR member login |
| **AHWD** | [nar.realtor/education/designations-and-certifications/at-home-with-diversity-ahwd](https://www.nar.realtor/education/designations-and-certifications/at-home-with-diversity-ahwd) → marketing tools section | NAR member login |

If a designation site doesn't have a visible "Marketing Materials" or "Logo Downloads" section, call NAR member support at **800-874-6500** and ask for the official logo file for that specific designation — they email it.

---

## CNE — Certified Negotiation Expert

Logo and marketing kit are provided by the **Real Estate Negotiation Institute (RENI)** in the post-completion student portal where you took the CNE course.

- Main site: [thereni.com](https://www.thereni.com/)
- If you took CNE through a partner school (McKissock, Gold Coast, Key Realty, Colibri, Rockwell), check that school's student portal first
- If you can't find the kit, email RENI directly and reference your CNE certificate

---

## CNHS — Certified New Home Specialist™
## RCC — Residential Construction Certified™

Both are administered by **SellNewHomes.com**.

- Logo & marketing materials: [sellnewhomes.com](https://sellnewhomes.com/) → student/member area
- They typically email a "Designation Marketing Kit" upon completion — if you have the welcome email, the logo is attached there or behind the linked portal

---

## CCIM — DO NOT USE THE CCIM LOGO YET

Per CCIM Institute rules, as a **paid Candidate Member** pursuing the designation you may say:

> "Candidate Member of the CCIM Institute, pursuing the CCIM Designation"

But you may **NOT** display the CCIM logo, CCIM pin, or use "CCIM" after your name until you complete the full designation (CI 101–104 + Portfolio of Qualifying Experience + Comprehensive Exam).

- Reference: [ccim.com — Candidate Membership Guidelines](https://www.ccim.com/membership-and-tools/become-member/guidelines-use-candidate-membership)

What you CAN use for marketing right now:
- "CCIM Institute Candidate Member" wording (no logo)
- The CI 101 Certificate of Completion (the PDF in `items/CCIM-101/certificate/`)

---

## RE/MAX 5-Year & 10-Year Service Recognitions

These are RE/MAX-internal recognitions — the logo for use is the standard RE/MAX brand mark, not a specific "5-year" or "10-year" logo.

- RE/MAX brand assets portal: [remax.com](https://www.remax.com/) → log in to mymax/Boost
- Or contact your office admin at RE/MAX Associates — they have brand-mark files (PNG, SVG, EPS) cleared for agent use

---

## RealtorDistinguishedServiceAward (DSA-2019/2020/2021)

These are awards from the Salt Lake Board of REALTORS®. No "logo" exists per-award — the certificate PDFs (already filed in their folders) are the credential.

- If you want a "Distinguished Service" graphic, contact: [slrealtors.com](https://slrealtors.com/) → board office

---

## Agent Certifications (the 17 in-progress courses)

Each of the 17 courses you're taking should issue a completion badge/logo via the Agent Certifications platform.

- Support: **support@agentcertifications.org**
- After completing a course, the badge/logo is typically delivered via email or available in your account dashboard
- Drop each one into `designations/items/<CODE>/logo/`

---

## Quick Reference: All Your Logo Statuses

| Code | Logo Status | Where to Get It |
|---|---|---|
| EPRO | 🔒 Need to download | epro.realtor (NAR login) |
| AHWD | 🔒 Need to download | nar.realtor AHWD page (NAR login) |
| PSA | 🔒 Need to download | psa.realtor (NAR login) |
| SFR | 🔒 Need to download | sfr.realtor (NAR login) |
| CNE | 🔒 Check email | RENI portal / completion email |
| CNHS | 🔒 Check email | SellNewHomes.com portal |
| RCC | 🔒 Check email | SellNewHomes.com portal |
| CCIM-CAND | ⛔ Not allowed | Cannot use CCIM logo as candidate |
| CCIM-101 | 📄 Cert only | No course-level logo, certificate PDF only |
| DSA-2019/2020/2021 | 📄 Cert only | Board award, no logo |
| REMAX-5YR/10YR | 🏢 Use brand mark | RE/MAX brand portal or office admin |
| 17 in-progress | ⏳ After completion | agentcertifications.org dashboard |

---

## Easiest Path

If you want to knock this all out in one sitting:

1. **NAR portal** (epro.realtor, psa.realtor, sfr.realtor, AHWD page) — 4 logos, one login session
2. **Email RENI** with your CNE credential — they send the logo
3. **Email SellNewHomes.com** with your CNHS + RCC creds — they send both
4. **RE/MAX office admin** — get the brand-mark files
5. **Don't worry about CCIM logo** — you're a candidate, not a designee
6. **Drop each file** into `designations/items/<CODE>/logo/` named `<CODE>_logo.png`

Or just tell me: *"I have the [code] logo, where do I put it?"* and I'll handle the rest.
