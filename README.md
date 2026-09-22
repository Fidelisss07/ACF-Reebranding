# ACF Performance — redesign

Site estático responsivo com 11 páginas, catálogo filtrável e contato por WhatsApp. Documentação: `docs/ANALISE.md`, `docs/DESIGN-SYSTEM.md`, `docs/CONTEUDOS-PENDENTES.md` e `docs/VERIFICACAO.md`.

## Executar

Python 3: `python -m http.server 4177 --bind 127.0.0.1 --directory dist`. Abra http://127.0.0.1:4177/.

## Editar e gerar

Instale a dependência de geração com `python -m pip install -r requirements.txt`. Execute `python build.py`. O frontend não usa dependências JavaScript. Templates e conteúdo editorial: `build.py`; estilos e comportamento: `dist/style.css` e `dist/app.js`; arquivos reais: `dist/assets`; catálogo-fonte: `research/catalog.json`. O gerador copia esse catálogo para `dist/data/catalog.json`.

`collect_catalog.py` registra a coleta do catálogo oficial e usa cache em `research/catalog`. Uma nova coleta deve ser revisada antes de substituir dados comerciais; o site não consulta a API legada em tempo real. HTMLs de pesquisa são evidência, não código servido ao visitante.

## Publicação

Saída estática: `dist/`. A prévia usa `noindex,nofollow` e robots bloqueado, pois ainda contém campos pendentes. Para lançar no domínio final, ajustar `ORIGIN` em `build.py`, aprovar o conteúdo e então atualizar robots e meta robots, regenerando sitemap/canonical/schema. SEO inclui títulos, descrições, OG textual e dados estruturados AutoRepair e Course; não inclui imagem social personalizada.

Login, compras e inscrição ficam nos sistemas originais. O formulário apenas prepara a mensagem do WhatsApp e não armazena dados. Fontes são externas; imagens do catálogo completo podem depender do domínio original. As imagens editoriais principais estão locais.
