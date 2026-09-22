from pathlib import Path
import sys, json, urllib.request, concurrent.futures, time
sys.path.insert(0, str(Path('.sites-runtime/python').resolve()))
from bs4 import BeautifulSoup
ROOT=Path('research'); CACHE=ROOT/'catalog'; CACHE.mkdir(exist_ok=True)
BASE='https://www.acfperformance.com/performance/'
errors=[]
def fetch(kind, ident):
    target=CACHE/f'{kind}-{ident}.html'
    if target.exists(): return target.read_text(encoding='utf-8')
    for attempt in range(2):
        try:
            raw=urllib.request.urlopen(BASE+f'ajx-{kind}.asp?id={ident}',timeout=25).read()
            try: text=raw.decode('utf-8')
            except UnicodeDecodeError: text=raw.decode('cp1252')
            target.write_text(text,encoding='utf-8');return text
        except Exception as exc:
            if attempt: errors.append({'kind':kind,'id':ident,'error':str(exc)});return ''
def choices(s, selector):
    soup=BeautifulSoup(s,'html.parser')
    return [{'id':o['value'],'name':o.get_text(' ',strip=True)} for o in soup.select(selector+' option') if o.get('value')]
brands=choices((ROOT/'performance.html').read_text(encoding='utf-8'),'#fabricante')
def models(b): b['models']=choices(fetch('fabricante',b['id']),'#modelo');return b
def years(m): m['years']=choices(fetch('modelo',m['id']),'#ano');return m
def versions(y): y['versions']=choices(fetch('ano',y['id']),'#versao');return y
def packages(v):
    s=BeautifulSoup(fetch('versao',v['id']),'html.parser')
    v['packages']=[];banner=s.select_one('.imagem-full img');v['image']=banner.get('src') if banner else None
    names={a.get('id'):a.get_text(' ',strip=True) for a in s.select('#lista-pacotes a')}
    for el in s.select('div.stage'):
        pid=next((c for c in el.get('class',[]) if c.startswith('p') and c[1:].isdigit()),None)
        description=el.select_one('.html.texto');price=el.select_one('.valor');buy=el.select_one('a.comprar')
        table=[]
        for row in el.select('table tr')[1:]:
            cells=[td.get_text(' ',strip=True) for td in row.select('td')]
            if len(cells)>=6: table.append({'metric':cells[0],'original':cells[2],'tuned':cells[4],'gain':cells[5]})
        gallery=s.select_one('div.divimagens.'+pid) if pid else None
        v['packages'].append({'id':pid,'name':names.get(pid,'Pacote'),'price':price.get_text(' ',strip=True) if price else None,'description':description.get_text('\n',strip=True) if description else '', 'metrics':table,'buy':buy.get('href') if buy else None,'graphs':[a['href'] for a in el.select('.graficos a[href]')], 'photos':[im['src'] for im in gallery.select('img[src]')] if gallery else []})
    return v
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    list(pool.map(models,brands));mm=[m for b in brands for m in b['models']];print('Models',len(mm),flush=True)
    list(pool.map(years,mm));yy=[y for m in mm for y in m['years']];print('Years',len(yy),flush=True)
    list(pool.map(versions,yy));vv=[v for y in yy for v in y['versions']];print('Versions',len(vv),flush=True)
    list(pool.map(packages,vv))
payload={'source':BASE,'collected':'2026-09-22','brands':brands,'errors':errors}
(ROOT/'catalog.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding='utf-8')
print('Packages',sum(len(v['packages']) for v in vv),'Errors',len(errors),flush=True)
