"""Genera trucco9.gif animata + trucco9_gallery.png a partire dal nuovo design 2026.
Cattura 10 screenshot via Edge headless e li compone."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).parent
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# Viewport ottimizzato per il design 2026 (singola schermata, no scroll)
W, H = 1440, 900

def capture_step(n: int, out_path: Path):
    """Cattura screenshot dello step n via Edge headless."""
    url = f"file:///{ROOT.as_posix()}/index.html?step={n}"
    cmd = [
        EDGE,
        "--headless=new",
        "--disable-gpu",
        f"--window-size={W},{H}",
        "--virtual-time-budget=2500",
        f"--screenshot={out_path}",
        url,
    ]
    subprocess.run(cmd, capture_output=True, timeout=30)
    return out_path.exists() and out_path.stat().st_size > 5000


def build_gif():
    print("=== Cattura screenshot dei 10 step ===")
    frames = []
    for n in range(1, 11):
        out = ROOT / f"_frame_{n:02d}.png"
        ok = capture_step(n, out)
        print(f"  step {n:2d}: {'OK' if ok else 'FAIL'}  {out.name}")
        if not ok:
            print(f"     WARNING: skipping step {n}")
            continue
        img = Image.open(out).convert("RGB")
        # Resize for GIF (preserve aspect, target width 1024)
        target_w = 1024
        target_h = int(img.height * target_w / img.width)
        img = img.resize((target_w, target_h), Image.LANCZOS)
        frames.append(img)

    if not frames:
        print("Nessun frame catturato, abort.")
        return

    print("\n=== Build GIF ===")
    out_gif = ROOT / "trucco9.gif"
    frames[0].save(
        out_gif,
        save_all=True,
        append_images=frames[1:],
        duration=2400,   # ms per frame
        loop=0,
        optimize=False,
        disposal=2,
    )
    size_kb = out_gif.stat().st_size / 1024
    print(f"  GIF: {out_gif.name}  ({size_kb:.0f} KB)")
    return frames


def build_gallery_png(frames):
    """Galleria 2x5 con tutti i 10 step affiancati."""
    if len(frames) < 10:
        print("Galleria saltata (servono 10 frame)."); return

    print("\n=== Build galleria PNG ===")
    cols, rows = 2, 5
    pad = 18
    cell_w = 720
    # Calcola cell_h proporzionale
    cell_h = int(frames[0].height * cell_w / frames[0].width)
    title_h = 110

    page_w = cols * cell_w + (cols + 1) * pad
    page_h = title_h + rows * cell_h + (rows + 1) * pad

    page = Image.new("RGB", (page_w, page_h), "white")
    draw = ImageDraw.Draw(page)

    try:
        font_title = ImageFont.truetype("seguibl.ttf", 48)
        font_sub = ImageFont.truetype("segoeui.ttf", 22)
    except Exception:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    draw.text((page_w // 2, 28), "Il trucco del 9 — Galleria",
              fill="#4f46e5", font=font_title, anchor="ma")
    draw.text((page_w // 2, 78), "Tutti i 10 casi: dal 9×1 al 9×10",
              fill="#64748b", font=font_sub, anchor="ma")

    for i, frame in enumerate(frames):
        # Resize each frame to fit cell
        scaled = frame.resize((cell_w, cell_h), Image.LANCZOS)
        row = i // cols
        col = i % cols
        x = pad + col * (cell_w + pad)
        y = title_h + pad + row * (cell_h + pad)
        page.paste(scaled, (x, y))

    out = ROOT / "trucco9_gallery.png"
    page.save(out, "PNG", dpi=(200, 200), optimize=True)
    print(f"  Galleria: {out.name}  ({out.stat().st_size / 1024:.0f} KB)")


def cleanup_frames():
    for f in ROOT.glob("_frame_*.png"):
        f.unlink()


if __name__ == "__main__":
    frames = build_gif()
    if frames:
        build_gallery_png(frames)
    cleanup_frames()
    print("\nDone.")
