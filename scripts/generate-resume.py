"""Generate the committed, one-page PDF from the website's resume data.

Run with Python that has ReportLab installed: python3 scripts/generate-resume.py.
Bun loads the authoritative TypeScript data; Python only owns PDF presentation.
Generation fails without replacing the current asset if it needs multiple pages.
"""

import json
import os
import subprocess
import tempfile
from html import escape
from io import BytesIO
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/resume-zacharia-hammad.pdf"


def text(value: str) -> str:
    if not value.isascii():
        raise ValueError(f"Resume text must use ASCII characters: {value!r}")
    return escape(value)


def link(url: str, label: str) -> str:
    return f'<link href="{text(url)}">{text(label)}</link>'


def generate() -> None:
    export = subprocess.run(
        [
            "bun",
            "-e",
            'import { resume } from "./src/data/resume"; '
            'import { contact } from "./src/data/contact"; '
            'import { site } from "./src/data/site"; '
            "console.log(JSON.stringify({resume, contact, siteUrl: site.url}));",
        ],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        timeout=30,
    )
    data = json.loads(export.stdout)
    resume, contact = data["resume"], data["contact"]
    ink = colors.HexColor("#17241f")
    muted = colors.HexColor("#414c46")
    accent = colors.HexColor("#235341")
    body = ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=12.5, textColor=ink)
    styles = {
        "name": ParagraphStyle("name", parent=body, fontName="Helvetica-Bold", fontSize=24, leading=28, spaceAfter=3),
        "title": ParagraphStyle("title", parent=body, fontSize=11, leading=14, spaceAfter=5),
        "contact": ParagraphStyle("contact", parent=body, fontSize=9.2, leading=12, textColor=muted),
        "summary": ParagraphStyle("summary", parent=body, leading=13, spaceBefore=8, spaceAfter=2),
        "section": ParagraphStyle("section", parent=body, fontName="Helvetica-Bold", fontSize=10.2, leading=12.5, textColor=accent, spaceBefore=7, spaceAfter=5, keepWithNext=True),
        "entry": ParagraphStyle("entry", parent=body, spaceAfter=1, keepWithNext=True),
        "role": ParagraphStyle("role", parent=body, fontSize=9.5, leading=12, textColor=muted, spaceAfter=2, keepWithNext=True),
        "bullet": ParagraphStyle("bullet", parent=body, leftIndent=9, firstLineIndent=-9, spaceAfter=1.5),
        "skill": ParagraphStyle("skill", parent=body, fontSize=9.5, leading=12, spaceAfter=2),
    }
    story = []

    def paragraph(markup: str, style: str = "body") -> None:
        story.append(Paragraph(markup, styles.get(style, body)))

    def section(label: str) -> None:
        paragraph(text(label.upper()), "section")

    paragraph(text(resume["name"]), "name")
    paragraph(text(resume["title"]), "title")
    details = [
        link(f"mailto:{detail}", detail) if detail == contact["email"] else text(detail)
        for detail in resume["details"]
    ]
    paragraph(" | ".join(details), "contact")
    urls = [data["siteUrl"], contact["linkedin"], contact["github"]]
    paragraph(" | ".join(link(url, url.removeprefix("https://").removeprefix("www.").rstrip("/")) for url in urls), "contact")
    paragraph(text(resume["summary"]), "summary")

    section("Technical Skills")
    for group in resume["skillGroups"]:
        paragraph(f'<b>{text(group["label"])}:</b> {text(", ".join(group["items"]))}', "skill")

    section("Professional Experience")
    for experience in resume["experience"]:
        paragraph(f'<b>{text(experience["organization"])}</b> | {text(experience["period"])}', "entry")
        paragraph(text(experience["role"]), "role")
        for bullet in experience["bullets"]:
            paragraph(f"- {text(bullet)}", "bullet")
        story.append(Spacer(1, 2))

    section("Projects")
    for project in resume["projects"]:
        paragraph(f'<b>{text(project["name"])}</b> | {text(project["stack"])}', "entry")
        paragraph(f'- {text(project["description"])}', "bullet")
        story.append(Spacer(1, 2))

    section("Education")
    education = resume["education"]
    paragraph(f'<b>{text(education["school"])}</b> | {text(education["period"])}', "entry")
    paragraph(text(f'{education["degree"]} | {education["minor"]} | GPA {education["gpa"]}'))

    section("Certifications")
    for certification in resume["certifications"]:
        paragraph(f'<b>{text(certification["name"])}</b> | {text(certification["period"])}')

    buffer = BytesIO()
    document = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=32,
        bottomMargin=32,
        title=f'{resume["name"]} Resume',
        author=resume["name"],
        subject=resume["title"],
        invariant=1,
        pageCompression=1,
    )
    document.build(story)
    if document.page != 1:
        raise ValueError(f"Expected a one-page resume; generated {document.page} pages. Current PDF preserved.")

    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=OUTPUT.parent, prefix=".resume-", suffix=".pdf", delete=False) as candidate:
            temporary = Path(candidate.name)
            candidate.write(buffer.getvalue())
        os.replace(temporary, OUTPUT)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()
    print(f"Generated {OUTPUT.relative_to(ROOT)} (1 page, {OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    generate()
