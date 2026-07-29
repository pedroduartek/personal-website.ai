#!/usr/bin/env python3
"""Render the static social-share (Open Graph) image for pedroduartek.com.

Produces a 1200x630 PNG at apps/web/public/og-image.png by screenshotting a
self-contained HTML page with headless Chrome. The design follows the site's
dark theme (#151B23 background, #3B8640 brand accent, Space Grotesk).

Usage:
    python apps/web/scripts/og/render_og.py

The Space Grotesk variable font is read from apps/web/public/fonts and inlined
as a base64 data URI so the page needs no network access. If the font file is
missing the layout falls back to a system sans-serif stack.
"""

from __future__ import annotations

import base64
import os
import subprocess
import sys
import tempfile
from pathlib import Path

WIDTH = 1200
HEIGHT = 630

BG = "#151B23"
BG_SOFT = "#1C242E"
ACCENT = "#3B8640"
TEXT = "#F4F7FB"
MUTED = "#9BA7B4"

NAME = "Pedro Duarte"
ROLE = "Senior Software Engineer"
DETAIL = "C#/.NET  \u00b7  Microservices  \u00b7  Lisbon, Portugal"
DOMAIN = "pedroduartek.com"

CHROME_CANDIDATES = (
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
)

SCRIPT_DIR = Path(__file__).resolve().parent
WEB_DIR = SCRIPT_DIR.parent.parent
PUBLIC_DIR = WEB_DIR / "public"
FONT_PATH = PUBLIC_DIR / "fonts" / "SpaceGrotesk-variable.woff2"
OUT_PATH = PUBLIC_DIR / "og-image.png"


def find_chrome() -> str:
    override = os.environ.get("CHROME_PATH")
    if override and Path(override).exists():
        return override
    for candidate in CHROME_CANDIDATES:
        if Path(candidate).exists():
            return candidate
    raise SystemExit(
        "Could not find Chrome. Set CHROME_PATH to the chrome executable."
    )


def font_css() -> tuple[str, str]:
    """Return (@font-face block, font-family stack)."""
    fallback = (
        '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif'
    )
    if not FONT_PATH.exists():
        print(f"warning: {FONT_PATH} not found, using system sans", file=sys.stderr)
        return "", fallback
    encoded = base64.b64encode(FONT_PATH.read_bytes()).decode("ascii")
    face = (
        "@font-face {\n"
        "  font-family: 'Space Grotesk';\n"
        f"  src: url(data:font/woff2;base64,{encoded}) format('woff2');\n"
        "  font-weight: 300 700;\n"
        "  font-style: normal;\n"
        "}\n"
    )
    return face, f"'Space Grotesk', {fallback}"


def build_html() -> str:
    face, family = font_css()
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
{face}
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
html, body {{ width: {WIDTH}px; height: {HEIGHT}px; }}
body {{
  font-family: {family};
  background: {BG};
  color: {TEXT};
  overflow: hidden;
}}
.card {{
  position: relative;
  width: {WIDTH}px;
  height: {HEIGHT}px;
  padding: 88px 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background:
    radial-gradient(1100px 520px at 88% -12%, {BG_SOFT} 0%, rgba(28, 36, 46, 0) 70%),
    {BG};
}}
.card::before {{
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  background: {ACCENT};
}}
.eyebrow {{
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: {ACCENT};
}}
.eyebrow .dot {{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: {ACCENT};
}}
h1 {{
  margin-top: 30px;
  font-size: 112px;
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.035em;
}}
h2 {{
  margin-top: 22px;
  font-size: 46px;
  font-weight: 500;
  letter-spacing: -0.012em;
  color: {TEXT};
}}
.detail {{
  margin-top: 20px;
  font-size: 27px;
  font-weight: 400;
  color: {MUTED};
}}
.rule {{
  margin-top: 46px;
  width: 132px;
  height: 5px;
  border-radius: 999px;
  background: {ACCENT};
}}
.domain {{
  position: absolute;
  left: 96px;
  bottom: 60px;
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: {MUTED};
}}
</style>
</head>
<body>
  <div class="card">
    <div class="eyebrow"><span class="dot"></span>PEDRODUARTEK</div>
    <h1>{NAME}</h1>
    <h2>{ROLE}</h2>
    <p class="detail">{DETAIL}</p>
    <div class="rule"></div>
    <div class="domain">{DOMAIN}</div>
  </div>
</body>
</html>
"""


def render() -> None:
    chrome = find_chrome()
    html = build_html()

    with tempfile.TemporaryDirectory() as tmp:
        tmp_dir = Path(tmp)
        page = tmp_dir / "og.html"
        page.write_text(html, encoding="utf-8")

        OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        cmd = [
            chrome,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--force-device-scale-factor=1",
            f"--user-data-dir={tmp_dir / 'profile'}",
            f"--window-size={WIDTH},{HEIGHT}",
            f"--screenshot={OUT_PATH}",
            page.as_uri(),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if not OUT_PATH.exists():
            sys.stderr.write(result.stdout + result.stderr)
            raise SystemExit("Chrome did not produce a screenshot.")

    print(f"wrote {OUT_PATH} ({OUT_PATH.stat().st_size} bytes)")


if __name__ == "__main__":
    render()
