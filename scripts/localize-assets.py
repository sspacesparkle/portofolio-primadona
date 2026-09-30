#!/usr/bin/env python3
import argparse
import hashlib
import html
import json
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ASSETS = PUBLIC / "assets"
MANIFEST = ASSETS / "manifest.json"
CONFIG = Path("/tmp/dedharya-assets.curl")
PAGES = tuple(PUBLIC.glob("*reference.html"))
HOSTS = {
    "cdn.prod.website-files.com",
    "d3e54v103j8qbb.cloudfront.net",
    "cdn.jsdelivr.net",
    "unpkg.com",
    "use.typekit.net",
    "player.vimeo.com",
}
TYPEKIT_JS = "https://use.typekit.net/gub2gtn.js"
TYPEKIT_CSS = "https://use.typekit.net/gub2gtn.css"
URL_RE = re.compile(r"https?://[^\s\"'<>]+")


def clean_url(value: str) -> str:
    url = html.unescape(value).rstrip("\\")
    if url.endswith(")") and Path(urlsplit(url).path).suffix.endswith(")"):
        url = url[:-1]
    return url


def category(url: str) -> str:
    path = urlsplit(url).path.lower()
    if "player.vimeo.com" in url or path.endswith(".mp4"):
        return "videos"
    if path.endswith((".css",)):
        return "css"
    if path.endswith((".js",)):
        return "js"
    if "/af/" in path:
        return "fonts"
    return "images"


def local_path(url: str) -> Path:
    parsed = urlsplit(url)
    name = unquote(Path(parsed.path).name)
    name = re.sub(r"[^A-Za-z0-9._-]+", "-", name).strip("-.") or "asset"
    folder = category(url)
    if folder == "videos" and not name.lower().endswith(".mp4"):
        name += ".mp4"
    if folder == "fonts" and not Path(name).suffix:
        name += ".woff2"
    digest = hashlib.sha1(url.encode()).hexdigest()[:10]
    return ASSETS / folder / f"{digest}-{name}"


def sources() -> list[Path]:
    return [*PAGES, *ASSETS.glob("css/*.css")]


def collect() -> dict[str, str]:
    found = {TYPEKIT_CSS}
    for source in sources():
        if not source.exists():
            continue
        for raw in URL_RE.findall(source.read_text(errors="ignore")):
            url = clean_url(raw)
            if urlsplit(url).netloc in HOSTS and url not in {TYPEKIT_JS}:
                found.add(url)
    found.discard("https://cdn.prod.website-files.com")
    return {url: "/" + str(local_path(url).relative_to(PUBLIC)) for url in sorted(found)}


def load_manifest() -> dict[str, str]:
    return json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}


def prepare() -> None:
    mapping = collect()
    ASSETS.mkdir(exist_ok=True)
    MANIFEST.write_text(json.dumps(mapping, indent=2, ensure_ascii=False) + "\n")
    lines = [
        "location",
        "fail",
        "silent",
        "show-error",
        "retry = 2",
        "parallel",
        "parallel-max = 8",
        "connect-timeout = 20",
        "max-time = 300",
    ]
    pending = 0
    for url, public_path in mapping.items():
        destination = PUBLIC / public_path.lstrip("/")
        destination.parent.mkdir(parents=True, exist_ok=True)
        if destination.exists() and destination.stat().st_size:
            continue
        lines.extend((f'url = "{url}"', f'output = "{destination}"'))
        pending += 1
    CONFIG.write_text("\n".join(lines) + "\n")
    print(f"{pending} assets pending; curl config: {CONFIG}")


def rewrite() -> None:
    mapping = load_manifest()
    typekit_local = mapping.get(TYPEKIT_CSS)
    for source in sources():
        if not source.exists():
            continue
        text = source.read_text(errors="ignore")
        if source.suffix == ".html" and typekit_local:
            if "<base " not in text:
                text = text.replace("<head>", '<head><base href="/" target="_top"/>', 1)
            text = text.replace(
                '<link href="https://cdn.prod.website-files.com" rel="preconnect" crossorigin="anonymous"/>',
                "",
            )
            text = re.sub(
                r'<script src="https://use\.typekit\.net/gub2gtn\.js"[^>]*></script><script[^>]*>try\{Typekit\.load\(\);\}catch\(e\)\{\}</script>',
                f'<link href="{typekit_local}" rel="stylesheet"/>',
                text,
            )
        for url, public_path in sorted(mapping.items(), key=lambda item: -len(item[0])):
            text = text.replace(url, public_path).replace(html.escape(url), public_path)
        if source.suffix == ".html":
            text = re.sub(
                r'href="(/(?:work|info|contact)(?:/[^"]+)?)"(?![^>]*onclick=)',
                lambda match: (
                    f'href="{match.group(1)}" '
                    f'onclick="window.top.location.href=\'{match.group(1)}\'; return false;"'
                ),
                text,
            )
            text = re.sub(
                r'(<(?:link|script)\b(?=[^>]*(?:href|src)="/assets/)[^>]*?)\s+integrity="[^"]*"',
                r"\1",
                text,
            )
            text = re.sub(
                r'(<(?:link|script)\b(?=[^>]*(?:href|src)="/assets/)[^>]*?)\s+crossorigin="anonymous"',
                r"\1",
                text,
            )
        if source.name.endswith("gub2gtn.css"):
            text = re.sub(r'@import url\("https://p\.typekit\.net/[^\"]+"\);', "", text)
        source.write_text(text)
    print(f"rewrote {len(sources())} local files")


def verify() -> None:
    remaining = []
    for source in sources():
        if not source.exists():
            continue
        for raw in URL_RE.findall(source.read_text(errors="ignore")):
            url = clean_url(raw)
            if urlsplit(url).netloc in HOSTS:
                remaining.append((source.name, url))
    if remaining:
        for source, url in remaining:
            print(f"{source}: {url}")
        raise SystemExit(f"{len(remaining)} external asset references remain")
    missing = [path for path in load_manifest().values() if not (PUBLIC / path.lstrip("/")).exists()]
    if missing:
        raise SystemExit(f"{len(missing)} localized files are missing")
    invalid_videos = []
    for url, path in load_manifest().items():
        if "player.vimeo.com" not in url:
            continue
        data = (PUBLIC / path.lstrip("/")).read_bytes()[:16]
        if b"ftyp" not in data:
            invalid_videos.append(path)
    if invalid_videos:
        raise SystemExit(f"{len(invalid_videos)} localized videos are invalid")
    print(f"verified {len(load_manifest())} local assets; no external asset references remain")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=("prepare", "rewrite", "verify"))
    args = parser.parse_args()
    {"prepare": prepare, "rewrite": rewrite, "verify": verify}[args.command]()
