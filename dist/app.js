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

if(document.getElementById('compare-brand'))initializeCarComparison();
async function initializeCarComparison(){
 const brandSelect=document.getElementById('compare-brand'),carSelect=document.getElementById('compare-car'),status=document.getElementById('compare-status'),cards=document.getElementById('compare-cards'),details=document.getElementById('compare-packages');
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const display=value=>value?String(value).replace(/(\d)(HP|NM)/gi,'$1 $2').replace(/NM/g,'Nm'):'Não publicado';
 const row=(p,key)=>p?.metrics.find(r=>key==='power'?/^pot/i.test(r.metric):/^tor/i.test(r.metric));
 let entries=[];
 function draw(){
  const entry=entries.find(e=>e.v.id===carSelect.value);if(!entry)return;
  const {v,name}=entry,one=v.packages.find(p=>/^stage\s*1$/i.test(p.name)),two=v.packages.find(p=>/^stage\s*2$/i.test(p.name));
  const originals=key=>{const values=[...new Set([one,two].filter(Boolean).map(p=>row(p,key)?.original).filter(Boolean))];return values.length===1?display(values[0]):values.length?'Varia por pacote':'Não publicado';};
  const originalPower=originals('power'),originalTorque=originals('torque');
  const stages=[{name:'Original',p:null},{name:'Stage 1',p:one},{name:'Stage 2',p:two}];
  cards.innerHTML=stages.map((stage,i)=>{
   const present=i===0||!!stage.p;
   const power=i===0?originalPower:display(row(stage.p,'power')?.tuned),torque=i===0?originalTorque:display(row(stage.p,'torque')?.tuned);
   const gains=i>0&&present?`<div class="compare-gains"><span>Ganho de potência<strong>${escape(display(row(stage.p,'power')?.gain))}</strong></span><span>Ganho de torque<strong>${escape(display(row(stage.p,'torque')?.gain))}</strong></span></div>`:i===0?'<p class="compare-baseline">Referência original publicada no catálogo.</p>':'<p class="compare-baseline">Este stage não está publicado para a versão selecionada.</p>';
   const url='https://wa.me/5511984496047?text='+encodeURIComponent('Olá! Quero saber sobre '+stage.name+' para '+name+'. Podem confirmar aplicação e orçamento?');
   return `<article class="compare-stage ${i===0?'original':''} ${present?'':'unavailable'}"><div class="compare-stage-head"><span class="code">0${i+1}</span><h3>${stage.name}</h3><span class="compare-tag">${i===0?'REFERÊNCIA':present?'PREPARADO':'NÃO PUBLICADO'}</span></div><p class="compare-vehicle">${escape(name)}</p><dl><div><dt>Potência</dt><dd>${escape(present?power:'—')}</dd></div><div><dt>Torque</dt><dd>${escape(present?torque:'—')}</dd></div></dl>${gains}${i>0?`<a class="btn ${present?'':'btn-line'}" href="${escape(url)}">${present?'Orçar '+stage.name:'Consultar a ACF'} ↗</a>`:'<a class="arrow-link" href="/performance/?version='+encodeURIComponent(v.id)+'">Consultar aplicação ↗</a>'}</article>`;
  }).join('');
  status.textContent=name+' — comparação atualizada.';details.href='/performance/?version='+encodeURIComponent(v.id);
 }
 function loadCars(preferred){
  const list=entries.filter(e=>e.brandId===brandSelect.value);
  carSelect.replaceChildren(...list.map(e=>new Option(e.label,e.v.id)));carSelect.disabled=!list.length;
  if(preferred&&list.some(e=>e.v.id===preferred))carSelect.value=preferred;
  draw();
 }
 try{
  const response=await fetch('/data/catalog.json');if(!response.ok)throw new Error();const data=await response.json();
  for(const b of data.brands)for(const m of b.models)for(const y of m.years)for(const v of y.versions){if(v.packages.some(p=>/^stage\s*[12]$/i.test(p.name)))entries.push({brandId:b.id,brand:b.name,label:m.name+' / '+y.name+' / '+v.name,name:b.name+' '+m.name+' / '+y.name+' / '+v.name,v});}
  if(!entries.length)throw new Error();
  const brands=data.brands.filter(b=>entries.some(e=>e.brandId===b.id));brandSelect.replaceChildren(...brands.map(b=>new Option(b.name,b.id)));brandSelect.disabled=false;
  const initial=entries.find(e=>e.v.id==='96')||entries[0];brandSelect.value=initial.brandId;loadCars(initial.v.id);
  brandSelect.addEventListener('change',()=>loadCars());carSelect.addEventListener('change',draw);
 }catch{status.textContent='Não foi possível carregar a comparação. Consulte os pacotes no catálogo ou fale com a ACF.';brandSelect.disabled=true;carSelect.disabled=true;}
}
