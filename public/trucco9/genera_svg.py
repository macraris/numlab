"""Genera SVG vettoriali puri del trucco del 9.
Output:
- trucco9.svg            (esempio classico 9×3, A4 portrait)
- trucco9_gallery.svg    (galleria 2×5 di tutti e 10 i casi)
"""
from pathlib import Path

ROOT = Path(__file__).parent

# Finger center X positions (must match the HTML SVG)
FINGER_CX = {1: 106, 2: 155, 3: 205, 4: 255, 5: 365,
             6: 635, 7: 745, 8: 795, 9: 845, 10: 894}

# Number label positions
NUM_LABEL = {
    1:  (106, 155),  2:  (155, 115), 3:  (205, 85),  4:  (255, 115),
    5:  (395, 225),  6:  (605, 225), 7:  (745, 115), 8:  (795, 85),
    9:  (845, 115), 10: (894, 155),
}

DEFS = """
<defs>
  <radialGradient id="palmGrad" cx="50%" cy="60%" r="60%">
    <stop offset="0%"  stop-color="#fde0c0"/>
    <stop offset="65%" stop-color="#f5c89e"/>
    <stop offset="100%" stop-color="#d49a6a"/>
  </radialGradient>
  <linearGradient id="fingerGrad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"  stop-color="#fde0c0"/>
    <stop offset="40%" stop-color="#fbcfa3"/>
    <stop offset="100%" stop-color="#dba377"/>
  </linearGradient>
  <linearGradient id="nailGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"  stop-color="#ffeed8"/>
    <stop offset="100%" stop-color="#f0c89c"/>
  </linearGradient>
  <linearGradient id="bentFingerGrad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"  stop-color="#c8c8c8"/>
    <stop offset="100%" stop-color="#a0a0a0"/>
  </linearGradient>
  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
    <feOffset dx="0" dy="3" result="offsetblur"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
"""

def finger_block(num, x, y, w, h, bent, nail_y, nail_rx=14, nail_ry=11,
                 transform_origin=None):
    """Render a vertical finger. If bent, draw it shrunk (height *0.22) anchored at bottom."""
    if bent:
        # Shrink vertically, anchored at bottom (transform origin)
        bent_h = h * 0.22
        new_y = y + h - bent_h
        body = (f'<rect x="{x}" y="{new_y}" width="{w}" height="{bent_h}" '
                f'rx="{w/2}" ry="{w/2}" fill="url(#bentFingerGrad)" '
                f'stroke="#666" stroke-width="2"/>')
        nail = ''  # no nail when bent
        knuckles = ''
    else:
        body = (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" '
                f'rx="{w/2}" ry="{w/2}" fill="url(#fingerGrad)" '
                f'stroke="#a87650" stroke-width="2.4"/>')
        nail = (f'<ellipse cx="{x+w/2}" cy="{nail_y}" '
                f'rx="{nail_rx}" ry="{nail_ry}" '
                f'fill="url(#nailGrad)" stroke="#c19061" stroke-width="1"/>')
        # 2 knuckle lines
        k1_y = y + h * 0.33
        k2_y = y + h * 0.63
        knuckles = (
            f'<line x1="{x+4}" y1="{k1_y}" x2="{x+w-4}" y2="{k1_y}" '
            f'stroke="#b88460" stroke-width="1.2" opacity="0.6"/>'
            f'<line x1="{x+4}" y1="{k2_y}" x2="{x+w-4}" y2="{k2_y}" '
            f'stroke="#b88460" stroke-width="1.2" opacity="0.6"/>'
        )
    return body + knuckles + nail


def thumb_block(num, base_x, base_y, rotation_deg, bent):
    """Thumb is a finger angled. base is bottom-center of thumb when un-rotated."""
    w = 48
    h = 160
    # rect coords for full thumb
    x_rect = base_x - w/2
    y_rect = base_y - h
    if bent:
        bent_h = h * 0.30
        # Rotate the whole group, then place a shorter rect at bottom
        body = (
            f'<g transform="rotate({rotation_deg}, {base_x}, {base_y})">'
            f'<rect x="{x_rect}" y="{base_y - bent_h}" width="{w}" height="{bent_h}" '
            f'rx="{w/2}" ry="{w/2}" fill="url(#bentFingerGrad)" '
            f'stroke="#666" stroke-width="2"/>'
            f'</g>'
        )
    else:
        body = (
            f'<g transform="rotate({rotation_deg}, {base_x}, {base_y})">'
            f'<rect x="{x_rect}" y="{y_rect}" width="{w}" height="{h}" '
            f'rx="{w/2}" ry="{w/2}" fill="url(#fingerGrad)" '
            f'stroke="#a87650" stroke-width="2.4"/>'
            f'<line x1="{x_rect+4}" y1="{y_rect+h*0.4}" '
            f'x2="{x_rect+w-4}" y2="{y_rect+h*0.4}" '
            f'stroke="#b88460" stroke-width="1.2" opacity="0.6"/>'
            f'<ellipse cx="{base_x}" cy="{y_rect+15}" '
            f'rx="15" ry="11" fill="url(#nailGrad)" '
            f'stroke="#c19061" stroke-width="1"/>'
            f'</g>'
        )
    return body


def hands_svg_block(bent_n, show_brackets=True, bracket_y=635):
    """Genera l'intero blocco delle due mani con il dito bent_n piegato.
    Coordinate dentro un viewBox 0 0 1000 740.
    """
    out = []

    # LEFT HAND palm
    out.append('<g filter="url(#softShadow)">')
    out.append('<path d="M 70,470 Q 60,360 110,330 L 250,310 Q 320,310 330,360 L 330,500 Q 320,580 245,590 L 130,590 Q 65,580 70,470 Z" '
               'fill="url(#palmGrad)" stroke="#a87650" stroke-width="2.5"/>')
    out.append('<path d="M 120,420 Q 200,440 290,425" stroke="#b88460" stroke-width="1.5" fill="none" opacity="0.5"/>')
    out.append('<path d="M 130,470 Q 220,485 295,470" stroke="#b88460" stroke-width="1.3" fill="none" opacity="0.4"/>')
    out.append('<path d="M 200,520 Q 220,560 245,575" stroke="#b88460" stroke-width="1.2" fill="none" opacity="0.4"/>')

    # Left fingers (1-4): pinky, ring, middle, index
    # x_rect, y_rect, w, h, nail_y
    fingers_left = [
        (1,  85, 170, 42, 170, 183),  # pinky (shorter)
        (2, 133, 130, 44, 200, 142),  # ring
        (3, 183, 100, 44, 225, 112),  # middle (longest)
        (4, 233, 130, 44, 200, 142),  # index
    ]
    for num, x, y, w, h, nail_y in fingers_left:
        out.append(finger_block(num, x, y, w, h, bent=(bent_n == num), nail_y=nail_y))

    # Left thumb (5)
    out.append(thumb_block(5, base_x=325, base_y=430, rotation_deg=40, bent=(bent_n == 5)))
    out.append('</g>')

    # RIGHT HAND
    out.append('<g filter="url(#softShadow)">')
    out.append('<path d="M 930,470 Q 940,360 890,330 L 750,310 Q 680,310 670,360 L 670,500 Q 680,580 755,590 L 870,590 Q 935,580 930,470 Z" '
               'fill="url(#palmGrad)" stroke="#a87650" stroke-width="2.5"/>')
    out.append('<path d="M 710,420 Q 800,440 880,425" stroke="#b88460" stroke-width="1.5" fill="none" opacity="0.5"/>')
    out.append('<path d="M 705,470 Q 780,485 870,470" stroke="#b88460" stroke-width="1.3" fill="none" opacity="0.4"/>')
    out.append('<path d="M 755,520 Q 780,560 800,575" stroke="#b88460" stroke-width="1.2" fill="none" opacity="0.4"/>')

    # Right thumb (6)
    out.append(thumb_block(6, base_x=675, base_y=430, rotation_deg=-40, bent=(bent_n == 6)))

    # Right fingers (7-10): index, middle, ring, pinky
    fingers_right = [
        (7,  723, 130, 44, 200, 142),
        (8,  773, 100, 44, 225, 112),
        (9,  823, 130, 44, 200, 142),
        (10, 873, 170, 42, 170, 183),
    ]
    for num, x, y, w, h, nail_y in fingers_right:
        out.append(finger_block(num, x, y, w, h, bent=(bent_n == num), nail_y=nail_y))
    out.append('</g>')

    # Number labels
    for n in range(1, 11):
        lx, ly = NUM_LABEL[n]
        is_bent = (n == bent_n)
        color = "#c0392b" if is_bent else "#1d1d1f"
        size = 32 if is_bent else 28
        weight = 800 if is_bent else 700
        out.append(f'<text x="{lx}" y="{ly}" font-family="Segoe UI,Arial,sans-serif" '
                   f'font-size="{size}" font-weight="{weight}" fill="{color}" '
                   f'text-anchor="middle">{n}</text>')

    # Brackets
    if show_brackets:
        if bent_n == 10:
            tens, ones = 9, 0
            x1 = FINGER_CX[1] - 30
            x2 = FINGER_CX[10] + 30
            out.append(f'<path d="M {x1},{bracket_y-14} L {x1},{bracket_y} L {x2},{bracket_y} L {x2},{bracket_y-14}" '
                       f'stroke="#0b3d91" stroke-width="4" fill="none" stroke-linecap="round"/>')
            out.append(f'<text x="{(x1+x2)/2}" y="{bracket_y+36}" font-family="Segoe UI,Arial,sans-serif" '
                       f'font-size="22" font-weight="700" fill="#0b3d91" text-anchor="middle">'
                       f'Tutte le 10 dita = 9 decine = 90</text>')
        else:
            tens = bent_n - 1
            ones = 10 - bent_n
            if tens > 0:
                x1 = FINGER_CX[1] - 30
                x2 = FINGER_CX[tens] + 30
                out.append(f'<path d="M {x1},{bracket_y-14} L {x1},{bracket_y} L {x2},{bracket_y} L {x2},{bracket_y-14}" '
                           f'stroke="#0b3d91" stroke-width="4" fill="none" stroke-linecap="round"/>')
                lbl = f'{tens} {"dito" if tens == 1 else "dita"} = {tens*10}'
                out.append(f'<text x="{(x1+x2)/2}" y="{bracket_y+36}" font-family="Segoe UI,Arial,sans-serif" '
                           f'font-size="24" font-weight="700" fill="#0b3d91" text-anchor="middle">{lbl}</text>')
            if ones > 0:
                first_right = bent_n + 1
                x1 = FINGER_CX[first_right] - 30
                x2 = FINGER_CX[10] + 30
                out.append(f'<path d="M {x1},{bracket_y-14} L {x1},{bracket_y} L {x2},{bracket_y} L {x2},{bracket_y-14}" '
                           f'stroke="#1b6d3b" stroke-width="4" fill="none" stroke-linecap="round"/>')
                lbl = f'{ones} {"dito" if ones == 1 else "dita"} = {ones}'
                out.append(f'<text x="{(x1+x2)/2}" y="{bracket_y+36}" font-family="Segoe UI,Arial,sans-serif" '
                           f'font-size="24" font-weight="700" fill="#1b6d3b" text-anchor="middle">{lbl}</text>')

    return "\n".join(out)


def make_single_svg(bent_n):
    """SVG A4 portrait standalone — un singolo esempio (9 × n)."""
    if bent_n == 10:
        eq = "9 × 10 = 90 + 0 = 90"
    else:
        tens = bent_n - 1
        ones = 10 - bent_n
        result = tens * 10 + ones
        eq = f"9 × {bent_n} = {tens*10} + {ones} = {result}"

    return f"""<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 900">
  {DEFS}
  <!-- Title -->
  <text x="500" y="60" font-family="Segoe UI,Arial,sans-serif" font-size="36" font-weight="800" fill="#0b3d91" text-anchor="middle">Il trucco del 9 con le dita</text>
  <text x="500" y="92" font-family="Segoe UI,Arial,sans-serif" font-size="18" font-style="italic" fill="#6e7781" text-anchor="middle">Metodo giapponese — esempio</text>

  <!-- Hands area (shifted down 120 to make room for title) -->
  <g transform="translate(0, 120)">
    {hands_svg_block(bent_n)}
  </g>

  <!-- Equation -->
  <rect x="280" y="820" width="440" height="64" rx="14" ry="14" fill="#f4f6fb" stroke="#0b3d91" stroke-width="2"/>
  <text x="500" y="863" font-family="Segoe UI,Arial,sans-serif" font-size="32" font-weight="800" fill="#0b3d91" text-anchor="middle">{eq}</text>
</svg>
"""


def make_gallery_svg():
    """Galleria 2x5 con tutti i 10 casi (vector pure SVG)."""
    # Layout: 5 rows x 2 cols
    # Each mini hand area: width ~ 480, height ~ 360 (with title, equation, brackets)
    rows, cols = 5, 2
    cell_w, cell_h = 500, 380
    pad = 10
    page_w = cols * cell_w + (cols + 1) * pad
    page_h = 130 + rows * cell_h + (rows + 1) * pad

    cells = []
    cells.append(f'<text x="{page_w/2}" y="50" font-family="Segoe UI,Arial,sans-serif" font-size="40" font-weight="800" fill="#0b3d91" text-anchor="middle">Il trucco del 9 — Galleria</text>')
    cells.append(f'<text x="{page_w/2}" y="88" font-family="Segoe UI,Arial,sans-serif" font-size="20" font-style="italic" fill="#6e7781" text-anchor="middle">Tutti i 10 casi: dal 9×1 al 9×10</text>')

    for i in range(10):
        n = i + 1
        row = i // cols
        col = i % cols
        x0 = pad + col * (cell_w + pad)
        y0 = 130 + pad + row * (cell_h + pad)
        # Compute scale to fit hands (1000 wide, 740 tall) into cell_w x (cell_h - 60) leaving 60 for equation/title
        scale = (cell_w - 24) / 1000
        # cell mini-title
        if n == 10:
            eq = "9 × 10 = 90"
        else:
            tens = n - 1; ones = 10 - n; res = tens*10 + ones
            eq = f"9 × {n} = {tens*10} + {ones} = {res}"
        cells.append(
            f'<g transform="translate({x0},{y0})">'
            f'<rect x="0" y="0" width="{cell_w}" height="{cell_h}" rx="14" ry="14" '
            f'fill="white" stroke="#d0d7de" stroke-width="1.5"/>'
            f'<text x="{cell_w/2}" y="34" font-family="Segoe UI,Arial,sans-serif" '
            f'font-size="22" font-weight="700" fill="#1d1d1f" text-anchor="middle">{eq}</text>'
            f'<g transform="translate(12, 48) scale({scale})">'
            f'{hands_svg_block(n)}'
            f'</g>'
            f'</g>'
        )

    return f"""<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {page_w} {page_h}">
{DEFS}
{chr(10).join(cells)}
</svg>
"""


if __name__ == "__main__":
    # Single example 9×3 (the classic)
    (ROOT / "trucco9.svg").write_text(make_single_svg(3), encoding="utf-8")
    print(f"  trucco9.svg  (esempio 9×3)  {(ROOT/'trucco9.svg').stat().st_size/1024:.0f} KB")

    # Gallery
    (ROOT / "trucco9_gallery.svg").write_text(make_gallery_svg(), encoding="utf-8")
    print(f"  trucco9_gallery.svg  {(ROOT/'trucco9_gallery.svg').stat().st_size/1024:.0f} KB")

    # All 10 single SVG files too
    for n in range(1, 11):
        (ROOT / f"trucco9_step{n:02d}.svg").write_text(make_single_svg(n), encoding="utf-8")
    print(f"  10 file trucco9_stepNN.svg singoli generati")
