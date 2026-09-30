#!/usr/bin/env python3
"""Group downloaded image/video assets by portfolio project."""

from collections import defaultdict
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ASSETS = PUBLIC / "assets"
MEDIA_RE = re.compile(r"/assets/(?:images|videos)/[^\"'()<> ,}]+")

PROJECTS = {
    "work-coarse-and-fine-reference.html": "01-coarse-and-fine",
    "work-fine-folks-reference.html": "02-fine-folks",
    "work-iolo-pizza-reference.html": "03-iolo-pizza",
    "work-indo-alam-resort-reference.html": "04-indo-alam-resort",
    "work-laus-kopi-reference.html": "05-laus-kopi",
    "work-kamietiam-reference.html": "06-kamietiam",
    "work-setria-group-reference.html": "07-setria-group",
    "work-setria-creative-reference.html": "08-setria-creative",
    "work-bigjava-reference.html": "09-bigjava",
    "work-funactive-yogyakarta-reference.html": "10-funactive-yogyakarta",
    "work-kemedis-reference.html": "11-kemedis",
    "work-denns-sambal-reference.html": "12-denns-sambal",
    "work-batik-ndalem-arjs-reference.html": "13-batik-ndalem-arjs",
}


def main() -> None:
    owners: dict[str, set[str]] = defaultdict(set)
    for page, project in PROJECTS.items():
        for ref in MEDIA_RE.findall((PUBLIC / page).read_text()):
            owners[ref].add(project)

    moves: dict[str, str] = {}
    for kind in ("images", "videos"):
        for source in (ASSETS / kind).iterdir():
            old = f"/assets/{kind}/{source.name}"
            projects = owners.get(old, set())
            folder = next(iter(projects)) if len(projects) == 1 else "shared"
            new = f"/assets/projects/{folder}/{kind}/{source.name}"
            destination = PUBLIC / new.removeprefix("/")
            destination.parent.mkdir(parents=True, exist_ok=True)
            source.rename(destination)
            moves[old] = new

    text_files = [
        path
        for path in PUBLIC.rglob("*")
        if path.suffix in {".html", ".css", ".js", ".json"}
    ]
    for path in text_files:
        content = path.read_text()
        updated = MEDIA_RE.sub(lambda match: moves.get(match.group(), match.group()), content)
        if updated != content:
            path.write_text(updated)

    for kind in ("images", "videos"):
        (ASSETS / kind).rmdir()

    unresolved = []
    for path in text_files:
        unresolved.extend(MEDIA_RE.findall(path.read_text()))
    assert not unresolved, f"Old media paths remain: {unresolved[:3]}"
    assert all((PUBLIC / path.removeprefix("/")).exists() for path in moves.values())
    print(f"Organized {len(moves)} media files into 13 project folders plus shared.")


if __name__ == "__main__":
    main()
