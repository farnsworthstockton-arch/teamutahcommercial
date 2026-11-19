# Compliance log — teamutahcommercial.com

Every change to how this site collects leads gets a laws-and-rules check here before it goes live.
Not legal advice: these are checks against the published rules, written down so they can be
re-checked. Newest first.

---

## 2026-11-19 — Lead forms send straight to the team (lead inbox)

**What changed.** The 14 lead forms (1031 exchange, buyer qualification, closing costs, due
diligence, lease calculator, property valuation, sell your property, tenant representation, zoning
guide, consultation, listing page, market report, glossary question, blog sign-up) now send the
visitor's request to the team's own inquiry service, which saves it and emails it to the team
(Reply-To = the visitor). If sending fails, the page falls back to the old behaviour: the visitor's
own email app opens with the request filled in. Added: `inquiry.js`, `privacy.html`, a privacy
note under every lead form, and an optional call/text consent box on every form that asks for a
phone number.

| # | Rule | Result | Notes |
|---|------|--------|-------|
| 1 | Utah blind-ad rule, R162-2f-401h (brokerage named) | Pass | Every form page already names REMAX Associates (header, disclaimer, footer). The new privacy page names it in its first sentence and its contact block. |
| 2 | TCPA consent for calls and texts | Pass | The "OK to call or text me" box starts **unticked**, is optional, is not a condition of anything, names who will contact them ("our team"), says message and data rates may apply, and says how to stop (reply STOP or tell us). The server stores the answer (`yes` / `no` / not asked) on every lead and prints it in the team's email. The FCC's "one-to-one consent" rule is not in force: the 11th Circuit vacated it on 2025-01-24 and the FCC removed it from its rules on 2025-08-29 (90 FR 42137). |
| 3 | What the box does NOT cover | Rule for the team | The box covers contact **about the visitor's own request**. It is not consent for marketing blasts or autodialed / prerecorded / platform texting campaigns. Don't load these numbers into a dialer or texting platform for marketing without separate written consent. |
| 4 | Utah telephone solicitation laws | Low risk, not re-read this session | Answering a person's own inquiry is not an unsolicited call. Re-check Utah Code 13-25a and 13-26 before the team ever starts cold calls or cold texts from this list. |
| 5 | CAN-SPAM (market-update sign-ups) | Pass, with a rule | Sign-ups only come from people who typed their own address and pressed Subscribe. There is no mailing-list service yet; a person adds them by hand. Every update sent must have an honest From and subject, the postal address (6955 S Union Park Center, Suite 140, Cottonwood Heights, UT 84047) and a working way to unsubscribe, honoured within 10 business days. The privacy page promises this. |
| 6 | Minors (COPPA) | Pass | The site is for adults doing commercial real estate business and is not aimed at children. The privacy page says it is not meant for anyone under 18, that we don't knowingly collect children's information, and that we delete it on request. |
| 7 | Utah Consumer Privacy Act | Does not apply | It only covers businesses with $25M+ yearly revenue **and** 100,000+ consumers (or 25,000+ and over half of revenue from selling data), Utah Code 13-61-102. It also excludes people acting in a commercial context. The privacy page still offers access, correction and deletion. |
| 8 | Privacy policy is accurate | Pass | Measured 2026-11-19: no analytics, ad trackers or cookie-setting scripts on any page. Outside services the page lists: Cloudflare cdnjs and jsDelivr (icons, fonts, scripts), OpenStreetMap tiles (map pages), a Google Maps embed (consultation page). Lead data goes only to the inquiry server, the team's email (Gmail) and a short phone notification from the team's own notification server (name, what it's about, the start of the message, phone number). Nothing is sold. |
| 9 | Data kept and deleted | Open item | Leads are kept in the inquiry database and the team's inbox. There is no automatic deletion yet; a deletion request is handled by hand (database on the inquiry server + the emails). The policy promises deletion on request. |
| 10 | Spam and abuse | Pass | Hidden honeypot field, a minimum fill time, a per-IP rate limit, an Origin check, size limits on every field, at most 3 lead emails per sender (same IP or same email address) per 24 hours, and a cap of 30 lead emails per 24 hours in total. Past a limit, leads are still saved and the page falls back to the visitor's email app; when the 30 cap trips, the team gets one "paused" notice. No third-party CAPTCHA, so no extra data goes to another company. A security review on 2026-11-19 found no critical or high issues; its 3 medium and 2 low findings were fixed before launch (verified TLS to Gmail, the per-sender limit, a stricter email-address check, encoded-word neutralising in email headers, and the spam reply now triggers the fallback). |
| 11 | Licences of anything new | Pass | No new images, fonts, maps, music, voices or models. `inquiry.js` and `privacy.html` are our own code and text. |
| 12 | Fair housing / Equal Housing | n/a, unchanged | Commercial site; the Equal Housing logo stays in every footer. |
| 13 | AI disclosure (Utah AI Policy Act) | n/a | No AI-generated content or AI chat in this change. |
| 14 | Nothing sent for anyone without consent | Pass | Tests sent only TEST leads to Stockton's own inbox. The site sends nothing on a visitor's behalf except the request they pressed Send on. |

**Found in passing, not changed here:** several existing pages offer a "Free CMA", "Free
Consultation" or "Free Building Value Opinion". REALTOR Code of Ethics Standard of Practice 12-1
says a REALTOR must not call services free unless they get no pay from any source for them.
That is page wording, so it belongs to the site-content work, not this change.

**Sources checked 2026-11-19:**
- 11th Circuit vacatur of the FCC one-to-one consent rule: [Morrison Foerster summary](https://www.mofo.com/resources/insights/250130-eleventh-circuit-vacates-fcc-s-tcpa-one-to-one-consent-rule), [case page](https://tcpa.com/cases/insurance-marketing-coalition-v-fcc/)
- Utah Consumer Privacy Act thresholds: [Utah Legislature](https://le.utah.gov/interim/2025/pdf/00004272.pdf), [overview](https://www.ketch.com/regulatory-compliance/utah-consumer-privacy-act-ucpa)
- Utah advertising rule R162-2f-401h: Utah Administrative Code (read 2026-09-08)
