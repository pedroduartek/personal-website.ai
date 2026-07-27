# -*- coding: utf-8 -*-
"""Builds Pedro's CV (.docx + .pdf) from scripts/cv/cv-build.json.

Reproduces the current CV's structure and style (Word / Aptos): name 36pt bold,
16pt bold section headers, 12pt body, teal links, two-column entries for
Experience/Education/Conferences. Run the exporter first (npm run cv does both).

Needs: python-docx (+ pywin32 & Microsoft Word for the PDF step).
"""
import json
import os
from datetime import datetime

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "cv-build.json")
OUT_DIR = os.path.normpath(os.path.join(HERE, "..", "..", "src", "CV"))
DOCX = os.path.join(OUT_DIR, "Pedro_Duarte_CV.docx")
PDF = os.path.join(OUT_DIR, "Pedro_Duarte_CV.pdf")

FONT = "Aptos"
TEAL = RGBColor(0x46, 0x78, 0x86)
BODY = 12
HEADER = 16
NAME = 36
LEFT_COL = Inches(1.7)
RIGHT_COL = Inches(4.8)


def fmt_date(ym):
    if not ym:
        return "Present"
    try:
        return datetime.strptime(ym, "%Y-%m").strftime("%b %Y")
    except ValueError:
        return ym


def add_run(p, text, *, bold=False, italic=False, size=BODY, color=None):
    r = p.add_run(text)
    r.font.name = FONT
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    if color is not None:
        r.font.color.rgb = color
    return r


def section_header(doc, text):
    p = doc.add_paragraph()
    p.space_before = Pt(10)
    add_run(p, text, bold=True, size=HEADER)
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    return p


def two_col_row(doc):
    """A borderless 2-column table (label left, content right)."""
    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    table.autofit = False
    table.allow_autofit = False
    left, right = table.rows[0].cells
    left.width = LEFT_COL
    right.width = RIGHT_COL
    return left, right


def cell_para(cell, first=True):
    p = cell.paragraphs[0] if first and cell.paragraphs else cell.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    return p


def build():
    with open(DATA, encoding="utf-8") as f:
        cv = json.load(f)

    doc = Document()
    doc.styles["Normal"].font.name = FONT
    doc.styles["Normal"].font.size = Pt(BODY)
    for s in doc.sections:
        s.page_width = Inches(8.5)
        s.page_height = Inches(11)
        s.left_margin = s.right_margin = Inches(1)
        s.top_margin = s.bottom_margin = Inches(1)

    p = cv["profile"]

    # --- Header ---
    name_p = doc.add_paragraph()
    name_p.paragraph_format.space_after = Pt(2)
    add_run(name_p, p["name"], bold=True, size=NAME)

    contact = doc.add_paragraph()
    contact.paragraph_format.space_after = Pt(0)
    add_run(contact, f"{p['location']}  |  {p['email']}  |  {p['phone']}")
    link_p = doc.add_paragraph()
    add_run(link_p, p["linkedin"].replace("https://www.", "").rstrip("/"), color=TEAL)

    # --- Summary ---
    section_header(doc, "Summary")
    sp = doc.add_paragraph()
    add_run(sp, cv["summary"])

    # --- Technical Skills ---
    section_header(doc, "Technical Skills")
    for grp in cv["skills"]:
        bp = doc.add_paragraph()
        bp.paragraph_format.space_after = Pt(2)
        add_run(bp, "• ")
        add_run(bp, f"{grp['group']}: ", bold=True)
        add_run(bp, grp["items"])

    # --- Professional Experience ---
    section_header(doc, "Professional Experience")
    for e in cv["experience"]:
        left, right = two_col_row(doc)
        add_run(cell_para(left), e["company"], bold=True)

        rp = cell_para(right)
        add_run(rp, e["title"], bold=True)
        dates = cell_para(right, first=False)
        add_run(dates, f"{fmt_date(e['startDate'])} – {fmt_date(e['endDate'])}", italic=True)
        if e.get("technologies"):
            tp = cell_para(right, first=False)
            add_run(tp, "Tech stack: ", bold=True)
            add_run(tp, ", ".join(e["technologies"]))
        for para in e.get("prose", []):
            pp = cell_para(right, first=False)
            pp.paragraph_format.space_after = Pt(6)
            add_run(pp, para)
        doc.add_paragraph().paragraph_format.space_after = Pt(2)

    # --- Education ---
    section_header(doc, "Education")
    for ed in cv["education"]:
        left, right = two_col_row(doc)
        add_run(cell_para(left), ed["institution"], bold=True)

        rp = cell_para(right)
        add_run(rp, f"{ed['degree']} - {ed['field']}", bold=True)
        dp = cell_para(right, first=False)
        add_run(dp, f"{fmt_date(ed['startDate'])} – {fmt_date(ed['endDate'])}", italic=True)
        if ed.get("gpa"):
            gp = cell_para(right, first=False)
            add_run(gp, "Grade: ", bold=True)
            add_run(gp, ed["gpa"])
        for ach in ed.get("achievements", []):
            ap = cell_para(right, first=False)
            add_run(ap, f"• {ach}")
        doc.add_paragraph().paragraph_format.space_after = Pt(2)

    # --- Conferences and Events ---
    section_header(doc, "Conferences and Events")
    for c in cv["conferences"]:
        left, right = two_col_row(doc)
        add_run(cell_para(left), c["name"], bold=True)

        rp = cell_para(right)
        add_run(rp, c["type"], bold=True)
        dp = cell_para(right, first=False)
        add_run(dp, fmt_date(c["date"]), italic=True)
        if c.get("description"):
            desc = cell_para(right, first=False)
            add_run(desc, c["description"])
        doc.add_paragraph().paragraph_format.space_after = Pt(2)

    os.makedirs(OUT_DIR, exist_ok=True)
    doc.save(DOCX)
    print("DOCX written:", DOCX)
    to_pdf()


def to_pdf():
    try:
        import win32com.client as win32
    except ImportError:
        print("pywin32 not available; skipped PDF (DOCX is ready).")
        return
    word = None
    try:
        word = win32.DispatchEx("Word.Application")
        word.Visible = False
        d = word.Documents.Open(os.path.abspath(DOCX))
        d.SaveAs(os.path.abspath(PDF), FileFormat=17)  # wdFormatPDF
        d.Close(False)
        print("PDF written:", PDF)
    except Exception as e:  # noqa: BLE001
        print("PDF step failed (DOCX still written):", e)
    finally:
        if word is not None:
            word.Quit()


if __name__ == "__main__":
    build()
