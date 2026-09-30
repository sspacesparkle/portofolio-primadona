"""Trace public assets used by rendered HTML/CSS/JS. --clean archives unused files."""
import json
import re
import sys
import shutil
from html import unescape
from pathlib import Path
from urllib.parse import unquote, urlsplit
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
public = root / 'public'
roots = list(public.glob('*reference.html'))
used = set()
missing = set()

def resolve(value, parent):
    value = unescape(value.strip())
    if not value or value.startswith(('#', 'data:', 'http:', 'https:', 'mailto:', 'javascript:', '//')):
        return None
    value = unquote(urlsplit(value).path)
    file = public / value.lstrip('/') if value.startswith('/') else parent.parent / value
    file = file.resolve()
    if not file.is_relative_to(public): return None
    # App routes are not assets.
    if file.suffix == '' and not file.is_file(): return None
    return file

def walk(path):
    if path in used: return
    if not path.is_file():
        missing.add(str(path.relative_to(public)))
        return
    used.add(path)
    if path.suffix.lower() not in {'.html','.css','.js'}: return
    text = path.read_text(errors='replace')
    values = []
    if path.suffix == '.html':
        soup = BeautifulSoup(text, 'html.parser')
        for tag in soup.find_all(True):
            for attr in ['src','href','data-src','poster']:
                if tag.get(attr): values.append(tag[attr])
            if tag.get('srcset'):
                values.extend(item.strip().rsplit(' ',1)[0] for item in tag['srcset'].split(','))
    values += re.findall(r'url\(\s*["\']?([^\)"\']+)',text)
    values += re.findall(r'["\'](/(?:assets|contact%20us|contact us)/[^"\'<>]+)["\']',text)
    for value in values:
        child=resolve(value,path)
        if child: walk(child)

for path in roots: walk(path.resolve())
files=[path for path in public.rglob('*') if path.is_file()]
unused=[path for path in files if path.resolve() not in used]
summary={'used_files':len(used),'unused_files':len(unused),'used_mb':round(sum(p.stat().st_size for p in used)/1024**2,2),
         'unused_mb':round(sum(p.stat().st_size for p in unused)/1024**2,2),'missing':sorted(missing)}
print(json.dumps(summary,indent=2))
report=root/'asset-audit.json'
report.write_text(json.dumps({**summary,'unused':[str(p.relative_to(public)) for p in unused]},indent=2))
if '--clean' in sys.argv:
    assert not missing, 'Fix missing referenced assets before cleanup'
    backup=Path('/private/tmp/portfolio-unused-assets-20261001')
    backup.mkdir(exist_ok=True)
    for path in unused:
        target=backup/path.relative_to(public)
        assert not target.exists(),target
        target.parent.mkdir(parents=True,exist_ok=True)
        shutil.move(str(path),str(target))
    print(f'Archived {len(unused)} files to {backup}')
