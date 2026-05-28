"""Designation / course / award tracker + JSON exporter.

Usage:
    python tracker.py init           # create DB + seed roster (idempotent)
    python tracker.py reseed         # WIPE and re-seed (loses manual edits)
    python tracker.py list           # show all
    python tracker.py status         # progress summary
    python tracker.py set CODE FIELD VALUE
    python tracker.py export         # write designations.json for bio page
"""
import json
import sqlite3
import sys
from pathlib import Path

DB = Path(__file__).parent / "tracker.db"
JSON_OUT = Path(__file__).parent / "designations.json"

# (code, name, kind, issuer, default_status, default_completed_date)
ROSTER = [
    # ───── Already earned ─────
    ("EPRO",      "NAR e-PRO® Certification",                       "designation", "National Association of REALTORS®",  "completed", "2021-05-01"),
    ("AHWD",      "At Home With Diversity®",                        "designation", "National Association of REALTORS®",  "completed", None),
    ("PSA",       "Pricing Strategy Advisor",                       "designation", "National Association of REALTORS®",  "completed", None),
    ("SFR",       "Short Sales & Foreclosure Resource®",            "designation", "National Association of REALTORS®",  "completed", None),
    ("CNE",       "Certified Negotiation Expert®",                  "designation", "Real Estate Negotiation Institute",  "completed", None),
    ("CNHS",      "Certified New Home Specialist™",                 "designation", "SellNewHomes.com",                   "completed", None),
    ("RCC",       "Residential Construction Certified™",            "designation", "SellNewHomes.com",                   "completed", None),
    ("CLHMS",     "Certified Luxury Home Marketing Specialist",     "designation", "The Institute for Luxury Home Marketing", "completed", "2022-01-01"),
    ("VCA",       "Veteran Certified Agent",                        "designation", "Veterans Real Estate Benefits (VREB) Network", "completed", "2022-01-01"),
    ("CCIM-CAND", "CCIM Candidate Member (pursuing CCIM)",          "membership",  "CCIM Institute",                     "in_progress", None),
    ("CCIM-101",  "CCIM CI 101: Financial Analysis for CIRE",       "course",      "CCIM Institute",                     "completed", "2025-10-14"),
    ("CSE",       "Commercial Sales Expert",                        "designation", "Agent Certifications",               "completed", "2026-05-28"),
    ("CLA",       "Commercial Leasing Advisor",                     "designation", "Agent Certifications",               "completed", "2026-05-28"),
    ("CBA",       "Certified Buyers Agent",                         "designation", "Agent Certifications",               "completed", "2026-05-28"),
    ("CLME",      "Certified Listing Marketing Expert",             "designation", "Agent Certifications",               "completed", "2026-05-28"),
    ("CREN",      "Certified Real Estate Negotiator",               "designation", "Agent Certifications",               "completed", "2026-05-28"),
    ("CBDA",      "Certified Business Development Agent",           "designation", "Agent Certifications",               "completed", "2026-05-28"),
    ("CELA",      "Certified Expert Listing Agent",                 "designation", "Agent Certifications",               "completed", "2026-05-28"),
    ("CSI",       "Certified Sales Interrogator",                   "designation", "Agent Certifications",               "completed", "2026-05-28"),
    ("PLA",       "Professional Listing Agent",                     "designation", "Agent Certifications",               "completed", "2026-05-28"),
    ("AIM",       "AI Masterclass",                                 "course",      "Agent Certifications",               "completed", "2026-05-28"),
    ("CBSL",      "Converting Buyer and Seller Leads",              "course",      "Agent Certifications",               "completed", "2026-05-28"),
    ("CLHA",      "Certified Luxury Home Agent",                    "designation", "Agent Certifications",               "completed", "2026-05-28"),
    ("CCIM-102",  "CCIM CI 102: Market Analysis for CIRE",          "course",      "CCIM Institute",                     "planned",   None),
    ("CCIM-103",  "CCIM CI 103: User Decision Analysis for CIRE",   "course",      "CCIM Institute",                     "planned",   None),
    ("CCIM-104",  "CCIM CI 104: Investment Analysis for CIRE",      "course",      "CCIM Institute",                     "planned",   None),

    # ───── In-flight (agentcertifications.org, 4 remaining designations) ─────
    ("CLE",   "Certified Listing Expert",                  "designation", "Agent Certifications", "planned", None),
    ("NHCP",  "New Home Certified Professional",           "designation", "Agent Certifications", "planned", None),
    ("CMREP", "Certified Mobile Real Estate Photographer", "designation", "Agent Certifications", "planned", None),

    # ───── In-flight (agentcertifications.org, 1 remaining course) ─────
    ("SMM",   "Social Media Mastery",                      "course", "Agent Certifications", "planned", None),

    # ───── Planned external courses ─────
    ("GOOG-AI", "Google AI Professional Certificate",      "course", "Google / Coursera",    "planned", None),

    # ───── Awards already earned ─────
    ("DSA-2019",   "Realtor Distinguished Service Award 2019", "award", "Salt Lake Board of REALTORS®", "completed", "2019-12-31"),
    ("DSA-2020",   "Realtor Distinguished Service Award 2020", "award", "Salt Lake Board of REALTORS®", "completed", "2020-12-31"),
    ("DSA-2021",   "Realtor Distinguished Service Award 2021", "award", "Salt Lake Board of REALTORS®", "completed", "2021-12-31"),
    ("TEAM-EXEC-2016", "RE/MAX Team Executive Club 2016",        "award", "RE/MAX", "completed", "2016-12-31"),
    ("EXEC-2017",      "RE/MAX Executive Club 2017",             "award", "RE/MAX", "completed", "2017-12-31"),
    ("EXEC-2019",      "RE/MAX Executive Club 2019",             "award", "RE/MAX", "completed", "2019-12-31"),
    ("REMAX-5YR",      "RE/MAX 5 Years of Service Recognition",  "award", "RE/MAX", "completed", "2020-07-07"),
    ("TEAM-EXEC-2020", "RE/MAX Team Executive Club 2020",        "award", "RE/MAX", "completed", "2020-12-31"),
    ("TEAM-EXEC-2021", "RE/MAX Team Executive Club 2021",        "award", "RE/MAX", "completed", "2021-12-31"),
    ("TEAM-EXEC-2022", "RE/MAX Team Executive Club 2022",        "award", "RE/MAX", "completed", "2022-12-31"),
    ("TEAM-EXEC-2024", "RE/MAX Team Executive Club 2024",        "award", "RE/MAX", "completed", "2024-12-31"),
    ("REMAX-10YR",     "RE/MAX 10 Years of Service Recognition", "award", "RE/MAX", "completed", "2025-07-07"),
    ("TEAM-EXEC-2025", "RE/MAX Team Executive Club 2025",        "award", "RE/MAX", "completed", "2025-12-31"),
]

SCHEMA = """
CREATE TABLE IF NOT EXISTS items (
    code           TEXT PRIMARY KEY,
    name           TEXT NOT NULL,
    kind           TEXT NOT NULL,        -- designation | course | award
    issuer         TEXT NOT NULL,
    status         TEXT DEFAULT 'planned',
    enrolled_date  TEXT,
    completed_date TEXT,
    ce_hours       REAL DEFAULT 0,
    cost           REAL DEFAULT 0,
    notes          TEXT DEFAULT '',
    cert_path      TEXT,
    badge_path     TEXT,
    sort_order     INTEGER
);
"""

def connect():
    return sqlite3.connect(DB)

def _seed(con):
    for i, row in enumerate(ROSTER):
        code, name, kind, issuer, status, done = row
        con.execute(
            "INSERT OR IGNORE INTO items(code,name,kind,issuer,status,completed_date,sort_order) VALUES (?,?,?,?,?,?,?)",
            (code, name, kind, issuer, status, done, i),
        )

def cmd_init():
    con = connect()
    con.executescript(SCHEMA)
    _seed(con)
    con.commit()
    print(f"Seeded {len(ROSTER)} items into {DB.name} (existing rows preserved)")
    con.close()

def cmd_reseed():
    con = connect()
    con.executescript("DROP TABLE IF EXISTS items;" + SCHEMA)
    _seed(con)
    con.commit()
    print(f"Wiped & reseeded {len(ROSTER)} items into {DB.name}")
    con.close()

def cmd_list():
    con = connect()
    rows = con.execute("SELECT code,name,kind,status,completed_date FROM items ORDER BY sort_order").fetchall()
    for code, name, kind, status, done in rows:
        mark = "[x]" if status == "completed" else "[ ]"
        d = f" ({done})" if done else ""
        print(f"{mark} {code:10} {kind:11} {name}{d}")
    con.close()

def cmd_status():
    con = connect()
    total = con.execute("SELECT COUNT(*) FROM items").fetchone()[0]
    done = con.execute("SELECT COUNT(*) FROM items WHERE status='completed'").fetchone()[0]
    enrolled = con.execute("SELECT COUNT(*) FROM items WHERE status IN ('enrolled','in_progress')").fetchone()[0]
    print(f"Completed: {done}/{total}")
    print(f"In progress: {enrolled}")
    print(f"Remaining: {total - done - enrolled}")
    con.close()

def cmd_set(code, field, value):
    allowed = {"status","enrolled_date","completed_date","ce_hours","cost","notes","cert_path","badge_path"}
    if field not in allowed:
        sys.exit(f"field must be one of {allowed}")
    con = connect()
    con.execute(f"UPDATE items SET {field}=? WHERE code=?", (value, code))
    con.commit()
    con.close()
    print(f"Set {code}.{field} = {value}")

def _ensure_cert_preview(cert_path_rel):
    """For inline cert display: if cert is a PDF, render page 1 to PNG once.
    Returns a path (relative to designations/) to use as an <img> source, or None."""
    if not cert_path_rel:
        return None
    abs_cert = Path(__file__).parent / cert_path_rel
    if not abs_cert.exists():
        return None
    ext = abs_cert.suffix.lower()
    if ext in (".jpg", ".jpeg", ".png", ".gif", ".webp"):
        return cert_path_rel  # image already; use directly
    if ext == ".pdf":
        preview_abs = abs_cert.with_name(abs_cert.stem + "_preview.png")
        if not preview_abs.exists():
            try:
                import fitz  # PyMuPDF
            except ImportError:
                print(f"  ! fitz/PyMuPDF not installed; skipping PDF preview for {cert_path_rel}")
                return None
            try:
                doc = fitz.open(str(abs_cert))
                pix = doc[0].get_pixmap(dpi=140)
                pix.save(str(preview_abs))
                doc.close()
                print(f"  + rendered PDF preview: {preview_abs.name}")
            except Exception as e:
                print(f"  ! failed to render preview for {cert_path_rel}: {e}")
                return None
        # Return path relative to designations/, with forward slashes for the web
        rel = preview_abs.relative_to(Path(__file__).parent)
        return str(rel).replace("\\", "/")
    return None

def cmd_export():
    con = connect()
    con.row_factory = sqlite3.Row
    rows = [dict(r) for r in con.execute(
        "SELECT code,name,kind,issuer,status,completed_date,enrolled_date,cert_path,badge_path,notes FROM items ORDER BY sort_order"
    )]
    con.close()
    for row in rows:
        row["cert_preview_path"] = _ensure_cert_preview(row.get("cert_path"))
    JSON_OUT.write_text(json.dumps(rows, indent=2))
    print(f"Wrote {JSON_OUT.name} ({len(rows)} items)")

def main():
    if len(sys.argv) < 2:
        print(__doc__); return
    cmd = sys.argv[1]
    if cmd == "init": cmd_init()
    elif cmd == "reseed": cmd_reseed()
    elif cmd == "list": cmd_list()
    elif cmd == "status": cmd_status()
    elif cmd == "set" and len(sys.argv) == 5: cmd_set(*sys.argv[2:5])
    elif cmd == "export": cmd_export()
    else: print(__doc__)

if __name__ == "__main__":
    main()
