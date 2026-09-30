"""Sync related-project media with the current Home covers; --check verifies them."""
import sys
from copy import deepcopy
from pathlib import Path
from urllib.parse import unquote

from bs4 import BeautifulSoup

public = Path(__file__).resolve().parents[1] / "public"
home = BeautifulSoup((public / "reference.html").read_text(), "html.parser")
covers = {}
for item in home.select(".home-projects-item"):
    link = item.select_one(".project-link-wrap a[href]")
    media = item.select_one(".home-project-split-grid img, .home-project-split-grid video")
    if link and media:
        covers[link["href"]] = media

count = 0
for path in sorted(public.glob("work-*-reference.html")):
    html = path.read_text()
    soup = BeautifulSoup(html, "html.parser")
    for card in soup.select(".work-grid-coll-wrap.is-related a.project-link"):
        cover = covers[card["href"]]
        source = cover.get("src") or cover.get("data-src")
        assert (public / unquote(source.lstrip("/"))).is_file(), source
        visual = card.select_one(".g_visual_wrap")
        if "--check" in sys.argv:
            media = visual.select("img, video")
            assert len(media) == 1, (path.name, card["href"])
            assert (media[0].get("src") or media[0].get("data-src")) == source, path.name
            assert not media[0].get("srcset"), path.name
        else:
            replacement = deepcopy(visual)
            replacement.clear()
            background = soup.new_tag("div", attrs={"class": "g_visual_background u-cover-absolute"})
            replacement.append(background)
            current = deepcopy(cover)
            current.attrs.pop("srcset", None)
            current.attrs.pop("sizes", None)
            if current.name == "video":
                current["preload"] = "none"
            replacement.append(current)
            old = str(visual)
            if old not in html:
                # Some original exports preserve uppercase attributes and single quotes.
                import re
                source_old = visual.select_one("img, video")
                needle = source_old.get("src") or source_old.get("data-src")
                at = html.index(needle)
                start = html.rfind("<div", 0, html.rfind("<div", 0, at))
                end = html.index("</div>", at) + 6
                old = html[start:end]
                assert "g_visual_wrap" in old, path.name
            html = html.replace(old, str(replacement), 1)
        count += 1
    if "--check" not in sys.argv:
        path.write_text(html)
print(f"{'Verified' if '--check' in sys.argv else 'Updated'} {count} Next Project covers")
