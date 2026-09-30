"""Apply deskripsi.md to project information; use --check to verify."""
import re
import sys
from html import escape
from pathlib import Path

from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
lines = [line.strip() for line in (root / "deskripsi.md").read_text().splitlines() if line.strip()]
fields = ["Idea", "Insight", "Client", "Industry", "Location", "Execution"]
entries = {}
starts = [i - 1 for i, line in enumerate(lines) if line == "Idea"]
for start, end in zip(starts, starts[1:] + [len(lines)]):
    section = lines[start:end]
    entry = {}
    organization = "Company" if "Company" in section else "Client"
    role = "Role" if "Role" in section else "Execution"
    section_fields = ["Idea", "Insight", organization, "Industry", "Location", role]
    if section[0] == "Bigjava" and "Execution" not in section:
        section.insert(section.index("Location") + 2, "Execution")
    for i, field in enumerate(section_fields):
        at = section.index(field) + 1
        stop = section.index(section_fields[i + 1]) if i + 1 < len(section_fields) else len(section)
        entry[field] = section[at:stop]
        assert entry[field], (section[0], field)
    entries[section[0]] = entry

pages = {
    "coarse-and-fine": ["Coarse & Fine"],
    "fine-folks": ["Fine Folks"],
    "iolo-pizza": ["IoLo"],
    "indo-alam-resort": ["Indo Alam Resort", "Cemara Indo Alam"],
    "laus-kopi": ["Laus Kopi"],
    "kamietiam": ["KAMIETIAM"],
    "setria-group": ["Setria Group"],
    "machimoto": ["Machimoto"],
    "sidecar": ["Sidecar"],
    "setria-creative": ["Setria Creative"],
    "funactive-yogyakarta": ["Funactive"],
    "bigjava": ["Bigjava"],
    "denns-sambal": ["Deens Sambal"],
    "batik-ndalem-arjs": ["Batik Ndalem ARJS"],
    "kemedis": ["Kemedis"],
}
assert {name for names in pages.values() for name in names} == set(entries)


def information(names):
    narrative = []
    for name in names:
        entry = entries[name]
        if len(names) > 1:
            narrative.append(f"<h3>{escape(name)}</h3>")
        for field in fields[:2]:
            narrative.append(f"<p><strong>{field}</strong><br/>{escape(' '.join(entry[field]))}</p>")
    blocks = ['<div class="project-infos-text-wrao"><div class="line-divider"></div>'
              '<div class="div-block-19"><div class="u-rich-text u-text-style-main w-richtext">'
              + ''.join(narrative) + '</div></div></div>']
    organization = "Company" if "Company" in entries[names[0]] else "Client"
    role = "Role" if "Role" in entries[names[0]] else "Execution"
    for field in [organization, "Industry", "Location", role]:
        values = list(dict.fromkeys(value for name in names for value in entries[name][field]))
        blocks.append('<div class="project-info-block"><div class="line-divider"></div>'
                      '<div class="project-info-grid u-grid-column-4">'
                      f'<div class="project-info-title-txt u-text-style-small">{field}</div>'
                      '<div class="project-info-txt u-text-style-small w-richtext">'
                      + ''.join(f'<p>{escape(value)}</p>' for value in values)
                      + '</div></div></div>')
    return ''.join(blocks)


for slug, names in pages.items():
    path = root / f"public/work-{slug}-reference.html"
    html = path.read_text()
    expected = information(names)
    if "--check" in sys.argv:
        actual = BeautifulSoup(html, "html.parser").select_one('.project-infos')
        target = BeautifulSoup(expected, "html.parser")
        assert actual.get_text(' ', strip=True) == target.get_text(' ', strip=True), slug
    else:
        opening = re.search(r'<div\b[^>]*class="project-infos u-column-2"[^>]*>', html)
        assert opening, slug
        depth = 1
        end = None
        for tag in re.finditer(r'</?div\b[^>]*>', html[opening.end():]):
            depth += -1 if tag.group().startswith('</') else 1
            if depth == 0:
                end = opening.end() + tag.start()
                break
        assert end is not None, slug
        path.write_text(html[:opening.end()] + expected + html[end:])
print(f"{'Verified' if '--check' in sys.argv else 'Updated'} {len(pages)} project descriptions from deskripsi.md")
