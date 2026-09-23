'use strict';
const menu=document.querySelector('.menu');
const navigation=document.querySelector('#navigation');
function closeMenu(){navigation?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
navigation?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
const form=document.querySelector('#contact-form');
form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const message=['Olá, equipe ACF!',...Array.from(data).filter(([,v])=>String(v).trim()).map(([k,v])=>`${k}: ${String(v).trim()}`)].join('\n');const a=document.querySelector('#whatsapp-message');a.href=`https://wa.me/5511984496047?text=${encodeURIComponent(message)}`;document.querySelector('#contact-result').hidden=false;a.focus();});
if(document.querySelector('#brand'))initializeCatalog();
async function initializeCatalog(){
 const selects=['brand','model','year','version'].map(id=>document.getElementById(id));
 const status=document.getElementById('catalog-status'),results=document.getElementById('catalog-results');
 const empty=results.firstElementChild.cloneNode(true);
 let catalog;
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const sourceUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='www.acfperformance.com'?u.href:'';}catch{return '';}};
 function clearVersion(){const u=new URL(location.href);u.searchParams.delete('version');history.replaceState(null,'',u.pathname+u.search);}
 function reset(index){clearVersion();selects.slice(index).forEach((el,i)=>{el.replaceChildren(new Option(['Escolha o fabricante','Escolha o modelo','Escolha o ano'][index+i-1]||'Selecione',''));el.disabled=true;});results.replaceChildren(empty.cloneNode(true));}
 function populate(select,records){select.replaceChildren(new Option('Selecione',''),...records.map(r=>new Option(r.name,r.id)));select.disabled=!records.length;}
 function selection(){const b=catalog.brands.find(b=>b.id===selects[0].value),m=b?.models.find(m=>m.id===selects[1].value),y=m?.years.find(y=>y.id===selects[2].value),v=y?.versions.find(v=>v.id===selects[3].value);return {b,m,y,v};}
 function compareBoard(b,m,y,v,name){
  const pretty=value=>String(value||'[PREENCHER]').replace(/(\d)(HP|NM)/gi,'$1 $2').replace(/NM/g,'Nm');
  const metricLabel=value=>/^pot/i.test(value)?'Potência':/^tor/i.test(value)?'Torque':value;
  const keys=[...new Set(v.packages.flatMap(p=>p.metrics.map(r=>metricLabel(r.metric))))];
  const rows=keys.flatMap(key=>['tuned','gain'].map(field=>{
   const originals=[...new Set(v.packages.map(p=>p.metrics.find(r=>metricLabel(r.metric)===key)?.original).filter(Boolean))];
   const base=field==='gain'?'—':originals.length===1?pretty(originals[0]):'Consulte cada pacote';
   return `<tr><th scope="row">${esc(field==='gain'?'Ganho de '+key.toLowerCase():key)}</th><td>${esc(base)}</td>${v.packages.map(p=>`<td>${esc(pretty(p.metrics.find(r=>metricLabel(r.metric)===key)?.[field]))}</td>`).join('')}</tr>`;
  })).join('');
  const photo=v.id==='96'?'/assets/m3.jpg':sourceUrl(v.packages.flatMap(p=>p.photos)[0]);
  const banner=`<div class="selected-vehicle ${photo?'':'no-photo'}">${photo?`<img src="${esc(photo)}" alt="${esc(b.name+' '+m.name)} no catálogo ACF">`:''}<div><span class="eyebrow">APLICAÇÃO SELECIONADA</span><h2>${esc(b.name+' '+m.name)}</h2><p>${esc(y.name+' / '+v.name)}</p><span>${v.packages.length} pacote(s) publicado(s)</span></div></div>`;
  const cols=v.packages.map(p=>`<th scope="col">${esc(p.name)}</th>`).join('');
  const actions=v.packages.map(p=>{const href='https://wa.me/5511984496047?text='+encodeURIComponent('Olá! Tenho interesse no '+p.name+' para '+name+'. Podem confirmar aplicação e orçamento?');return `<td><a class="btn" href="${esc(href)}">Pedir orçamento ↗</a></td>`;}).join('');
  return banner+(keys.length?`<div class="comparison-scroll" tabindex="0" role="region" aria-label="Comparação de pacotes; role horizontalmente para ver todas as colunas"><table class="comparison-table"><caption>Comparação publicada pela ACF</caption><thead><tr><th scope="col">Especificação</th><th scope="col">Original</th>${cols}</tr></thead><tbody>${rows}<tr><th scope="row">Orçamento</th><td>—</td>${actions}</tr></tbody></table></div><p class="comparison-note">Valores publicados pela ACF. Confirme aplicação, peças e disponibilidade. Deslize a tabela para comparar todos os pacotes.</p>`:'<p class="note">Consulte os detalhes dos pacotes para as especificações publicadas.</p>');
 }
 function render(){
  const {b,m,y,v}=selection();if(!v)return;
  const name=`${b.name} ${m.name} / ${y.name} / ${v.name}`;
  const query=new URLSearchParams(location.search);query.set('version',v.id);history.replaceState(null,'',`${location.pathname}?${query}`);
  status.textContent=`${v.packages.length} pacote(s) para a versão selecionada.`;
  if(!v.packages.length){results.innerHTML='<div class="empty-state"><h3>Nenhum pacote publicado.</h3><p>Consulte a ACF sobre esta aplicação.</p><a class="btn" href="https://wa.me/5511984496047">Falar com a equipe ↗</a></div>';return;}
  results.innerHTML=compareBoard(b,m,y,v,name)+`<details class="package-details"><summary>O que inclui cada pacote, valores e imagens</summary><div class="package-grid">${v.packages.map(p=>{
   const media=[...p.photos,...p.graphs].map((url,i)=>{const valid=sourceUrl(url);return valid?`<a href="${esc(valid)}" target="_blank" rel="noopener"><img src="${esc(valid)}" alt="${esc(i<p.photos.length?'Foto do pacote':'Gráfico original do pacote')} ${esc(p.name)} — ${esc(b.name+' '+m.name)}" loading="lazy"><span class="small">Abrir imagem original ↗</span></a>`:'';}).join('');
   const metrics=p.metrics.length?`<table><caption>Comparação publicada pela ACF</caption><thead><tr><th scope="col">Métrica</th><th scope="col">Original</th><th scope="col">${esc(p.name)}</th><th scope="col">Ganho</th></tr></thead><tbody>${p.metrics.map(row=>`<tr><th scope="row">${esc(row.metric)}</th><td>${esc(row.original||'[PREENCHER]')}</td><td>${esc(row.tuned||'[PREENCHER]')}</td><td>${esc(row.gain||'[PREENCHER]')}</td></tr>`).join('')}</tbody></table>`:'<p class="missing">[PREENCHER] Dados de potência e torque não publicados para este pacote.</p>';
   const chat=`https://wa.me/5511984496047?text=${encodeURIComponent('Olá! Tenho interesse no '+p.name+' para '+name+'. Podem confirmar aplicação e orçamento?')}`;
   return `<article class="package"><span class="code">${esc(b.name)} / ${esc(m.name)}</span><h3>${esc(p.name)}</h3><p class="price">${esc(p.price||'[PREENCHER] Valor sob consulta')}</p>${metrics}<details><summary>O que inclui e condições</summary><div class="description">${esc(p.description||'[PREENCHER] Descrição deste pacote.')}</div></details>${media?`<details><summary>Fotos e gráficos originais</summary><div class="gallery">${media}</div><p class="small">As imagens preservam as unidades e condições do documento original.</p></details>`:''}<div class="actions"><a class="btn" href="${esc(chat)}">Pedir orçamento <span aria-hidden="true">↗</span></a>${sourceUrl(p.buy)?`<a class="arrow-link" href="${esc(sourceUrl(p.buy))}">Contratar na ACF ↗</a>`:''}</div><p class="small">Valor publicado em 22/09/2026. Confirme disponibilidade, peças e condições com a ACF.</p></article>`;
  }).join('')}</div></details>`;
  results.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{const notice=document.createElement('span');notice.className='media-fallback';notice.textContent='Imagem indisponível nesta consulta. Abrir fonte original ↗';img.replaceWith(notice);},{once:true}));
 }
 try{
  status.textContent='Carregando catálogo…';selects[0].disabled=true;
  const response=await fetch('/data/catalog.json');if(!response.ok)throw new Error('catalog unavailable');catalog=await response.json();
  populate(selects[0],catalog.brands);status.textContent='Selecione o fabricante para começar.';
  selects[0].addEventListener('change',()=>{reset(1);const {b}=selection();if(b)populate(selects[1],b.models);status.textContent=b?`${b.models.length} modelos disponíveis. Escolha o modelo.`:'Selecione o fabricante para começar.';});
  selects[1].addEventListener('change',()=>{reset(2);const {m}=selection();if(m)populate(selects[2],m.years);status.textContent=m?'Escolha o ano / geração.':'Escolha o modelo.';});
  selects[2].addEventListener('change',()=>{reset(3);const {y}=selection();if(y)populate(selects[3],y.versions);status.textContent=y?'Escolha a versão / motor.':'Escolha o ano / geração.';});
  selects[3].addEventListener('change',()=>{if(selects[3].value)render();else{clearVersion();results.replaceChildren(empty.cloneNode(true));status.textContent='Escolha a versão / motor.';}});
  const params=new URLSearchParams(location.search),id=params.get('version')||(!params.get('category')?'96':null);
  if(id){let found=false;for(const b of catalog.brands)for(const m of b.models)for(const y of m.years){const v=y.versions.find(v=>v.id===id);if(v){selects[0].value=b.id;populate(selects[1],b.models);selects[1].value=m.id;populate(selects[2],m.years);selects[2].value=y.id;populate(selects[3],y.versions);selects[3].value=v.id;render();found=true;}}if(!found)status.textContent='Versão não encontrada. Selecione uma aplicação no catálogo.';}
  else if(params.get('category')==='programavel'){const b=catalog.brands.find(b=>b.name.includes('Programável'));if(b){selects[0].value=b.id;selects[0].dispatchEvent(new Event('change'));}}
 }catch{status.textContent='Não foi possível carregar o catálogo.';selects.forEach(s=>s.disabled=true);results.innerHTML='<div class="empty-state"><h3>Vamos encontrar seu pacote.</h3><p>Consulte o catálogo oficial ou fale com a equipe ACF.</p><a class="btn" href="https://www.acfperformance.com/performance/">Catálogo oficial ↗</a></div>';}
}

if(document.getElementById('multi-cars'))initializeMultiCar();
async function initializeMultiCar(){
 const container=document.getElementById('multi-cars'),add=document.getElementById('add-compare-car'),status=document.getElementById('multi-status');let entries=[],brands=[],sequence=0;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const display=v=>v?String(v).replace(/(\d)(HP|NM)/gi,'$1 $2').replace(/NM/g,'Nm'):'Não publicado';
 const metric=(p,k)=>p?.metrics.find(r=>k==='power'?/^pot/i.test(r.metric):/^tor/i.test(r.metric));
 function refresh(){const panels=[...container.children];panels.forEach((panel,i)=>{panel.querySelector('h3').textContent='CARRO '+(i+1);const remove=panel.querySelector('.remove-car');remove.disabled=panels.length<=2;remove.setAttribute('aria-label','Remover carro '+(i+1));});}
 function addCar(preferred,focus=false){
  const uid=++sequence,first=entries.find(e=>e.v.id===preferred)||entries[0];
  const panel=document.createElement('article');panel.className='multi-car';panel.innerHTML=`<div class="multi-car-head"><h3></h3><button class="remove-car" type="button">Remover</button></div><div class="compare-controls"><div><label for="mc-brand-${uid}">Fabricante</label><select id="mc-brand-${uid}"></select></div><div><label for="mc-model-${uid}">Modelo, ano e motor</label><select id="mc-model-${uid}"></select></div></div><div class="multi-car-result"></div>`;
  container.append(panel);const bs=panel.querySelector('select'),cs=panel.querySelectorAll('select')[1],out=panel.querySelector('.multi-car-result');bs.replaceChildren(...brands.map(b=>new Option(b.name,b.id)));bs.value=first.brandId;
  function draw(){const e=entries.find(e=>e.v.id===cs.value);if(!e)return;const one=e.v.packages.find(p=>/^stage\s*1$/i.test(p.name)),two=e.v.packages.find(p=>/^stage\s*2$/i.test(p.name));
   const original=k=>{const vals=[...new Set([one,two].filter(Boolean).map(p=>metric(p,k)?.original).filter(Boolean))];return vals.length===1?display(vals[0]):vals.length?'Varia por pacote':'Não publicado';};
   const rows=[['Potência','power','tuned'],['Torque','torque','tuned'],['Ganho de potência','power','gain'],['Ganho de torque','torque','gain']].map(([label,key,field])=>`<tr><th scope="row">${label}</th><td>${esc(field==='gain'?'—':original(key))}</td>${[one,two].map(p=>`<td>${esc(p?display(metric(p,key)?.[field]):'Stage não publicado')}</td>`).join('')}</tr>`).join('');
   out.innerHTML=`<p class="multi-car-name">${esc(e.name)}</p><div class="comparison-scroll" tabindex="0" role="region" aria-label="Comparação de ${esc(e.name)}"><table class="comparison-table"><caption>${esc(e.name)} — Original, Stage 1 e Stage 2</caption><thead><tr><th scope="col">Especificação</th><th scope="col">Original</th><th scope="col">Stage 1</th><th scope="col">Stage 2</th></tr></thead><tbody>${rows}</tbody></table></div><a class="arrow-link" href="/performance/?version=${encodeURIComponent(e.v.id)}">Ver pacotes e orçamento ↗</a>`;
  }
  function choose(preferred){const list=entries.filter(e=>e.brandId===bs.value);cs.replaceChildren(...list.map(e=>new Option(e.label,e.v.id)));if(preferred&&list.some(e=>e.v.id===preferred))cs.value=preferred;draw();}
  bs.addEventListener('change',()=>{choose();status.textContent='Fabricante alterado. Comparação atualizada.';});cs.addEventListener('change',()=>{draw();status.textContent='Carro alterado. Comparação atualizada.';});
  panel.querySelector('.remove-car').addEventListener('click',()=>{if(container.children.length<=2)return;panel.remove();refresh();add.focus();status.textContent=`${container.children.length} carros na comparação.`;});
  choose(first.v.id);refresh();if(focus){bs.focus();status.textContent=`${container.children.length} carros na comparação. Escolha o novo carro.`;}
 }
 try{const response=await fetch('/data/catalog.json');if(!response.ok)throw new Error();const data=await response.json();for(const b of data.brands)for(const m of b.models)for(const y of m.years)for(const v of y.versions)if(v.packages.some(p=>/^stage\s*[12]$/i.test(p.name)))entries.push({brandId:b.id,v,label:m.name+' / '+y.name+' / '+v.name,name:b.name+' '+m.name+' / '+y.name+' / '+v.name});if(!entries.length)throw new Error();brands=data.brands.filter(b=>entries.some(e=>e.brandId===b.id));const second=entries.find(e=>e.brandId!==entries.find(x=>x.v.id==='96')?.brandId&&e.v.packages.some(p=>p.name==='Stage 1')&&e.v.packages.some(p=>p.name==='Stage 2'))||entries[1]||entries[0];addCar('96');addCar(second.v.id);add.disabled=false;add.addEventListener('click',()=>addCar(entries[0].v.id,true));status.textContent='2 carros na comparação. Selecione as aplicações ou adicione mais carros.';
 }catch{status.textContent='Não foi possível carregar a comparação. Consulte o catálogo de performance.';}
}
