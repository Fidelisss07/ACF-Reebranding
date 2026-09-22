"""Validate generated routes, local links, metadata and catalog integrity."""
from pathlib import Path
import sys,json
from urllib.parse import urlsplit,unquote
ROOT=Path(__file__).parent
sys.path.insert(0,str(ROOT/'.sites-runtime/python'))
from bs4 import BeautifulSoup
dist=ROOT/'dist'
errors=[]
titles=[]
files=list(dist.rglob('*.html'))
for file in files:
    doc=BeautifulSoup(file.read_text(encoding='utf-8'),'html.parser')
    if len(doc.find_all('h1'))!=1: errors.append(f'{file}: h1')
    if not doc.find('meta',attrs={'name':'description'}): errors.append(f'{file}: description')
    titles.append(doc.title.string)
    for el in doc.find_all('img'):
        if not el.has_attr('alt'): errors.append(f'{file}: image alt')
    for el in doc.select('script[type="application/ld+json"]'): json.loads(el.string)
    ids=[el['id'] for el in doc.select('[id]')]
    if len(ids)!=len(set(ids)): errors.append(f'{file}: duplicate ids')
    for el in doc.select('[href],[src]'):
        url=el.get('href') or el.get('src');parts=urlsplit(url)
        if parts.scheme or parts.netloc: continue
        path=unquote(parts.path)
        target=(dist/path.lstrip('/')) if path.startswith('/') else (file.parent/path if path else file)
        if target.is_dir(): target=target/'index.html'
        if not target.exists(): errors.append(f'{file}: missing {url}')
        elif parts.fragment and target.suffix=='.html':
            other=BeautifulSoup(target.read_text(encoding='utf-8'),'html.parser')
            if not other.find(id=unquote(parts.fragment)):errors.append(f'{file}: fragment {url}')
assert len(titles)==len(set(titles)), 'Repeated titles'
c=json.loads((dist/'data/catalog.json').read_text(encoding='utf-8'))
versions=[v for b in c['brands'] for m in b['models'] for y in m['years'] for v in y['versions']]
assert len(versions)==223
assert sum(len(v['packages']) for v in versions)==471
assert not c['errors']
print(json.dumps({'html_files':len(files),'versions':len(versions),'packages':471,'errors':errors},ensure_ascii=False))
sys.exit(bool(errors))
