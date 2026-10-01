"""Export syntree diagrams through Typst's HTML inline-SVG renderer."""

from pathlib import Path
import re
import subprocess
import tempfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
FIGURES = (
    "normal", "fusion", "fission", "impoverishment", "record", "separate",
    "nominalizations", "pfau-error", "pfau-architecture",
    "cat-n", "cat-num", "cat-dp", "cat-vp", "cat-tp", "cat-movement",
    "cat-agr", "cat-copy",
    "pfau-fusion", "pfau-category", "tree-code", "planned-frame",
)

with tempfile.TemporaryDirectory(prefix="dm-trees-") as scratch:
    for name in FIGURES:
        html = Path(scratch) / f"{name}.html"
        subprocess.run([
            "typst", "compile", "--features", "html", "--format", "html",
            "--input", f"figure={name}", str(ROOT / "trees.typ"), str(html),
        ], check=True)
        svgs = re.findall(r"<svg\b.*?</svg>", html.read_text(), re.DOTALL)
        if len(svgs) != 1:
            raise ValueError(f"{name}: expected one inline SVG, got {len(svgs)}")
        ET.fromstring(svgs[0])
        (ROOT / f"{name}.svg").write_text(svgs[0] + "\n")
        print(f"Exported {name}.svg")
