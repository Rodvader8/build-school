"""Marks a track as built on the curriculum map, using the real lesson titles from disk.
Usage: python3 scripts/mark-track-built.py <track-id>"""
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
track = sys.argv[1]
titles = []
for lesson in sorted((root / "src/curriculum" / track).glob("*/lesson.ts")):
    match = re.search(r"title:\s*(['\"])(.*?)(?<!\\)\1", lesson.read_text())
    titles.append(match.group(2).replace("\\'", "'"))
if not titles:
    sys.exit(f"No lessons found for {track}")

map_file = root / "src/curriculum/map.ts"
text = map_file.read_text()
start = text.index(f"id: '{track}',")
block_end = text.index("capstones:", start)
block = text[start:block_end]
block = re.sub(r"status: '\w+'", "status: 'built'", block, count=1)
quoted = ", ".join("'" + t.replace("\\", "\\\\").replace("'", "\\'") + "'" for t in titles)
block = re.sub(r"modules: \[.*?\],", lambda _: f"modules: [{quoted}],", block, count=1, flags=re.S)
map_file.write_text(text[:start] + block + text[block_end:])
print(f"{track}: built, {len(titles)} lessons")
