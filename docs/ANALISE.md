# Análise e direção — ACF Performance

Consulta das fontes: 22/09/2026. Fonte utilizada: https://www.acfperformance.com/. O material específico da ACF anunciado no briefing não foi anexado; o ZIP anterior contém referências de design. Se o cliente enviar material divergente, ele deve prevalecer. Páginas e respostas originais estão arquivadas em `research/`.

## Diagnóstico

A home antiga apresenta chamadas para performance com pouca informação de apoio, visual cinza e acesso ao orçamento pouco destacado. A nova hierarquia explica remap e preparação, oferece WhatsApp acima da dobra, mostra resultados publicados e organiza história, equipe, cursos e conteúdo. A repetição de alguns rótulos no conteúdo extraído inclui títulos e textos alternativos; não foi tratada como prova de duplicação visual em todos os cards.

O catálogo público, carregado por AJAX, possui 20 categorias, 97 modelos, 162 grupos de ano/geração, 223 versões e 471 pacotes na consulta. A extração terminou sem erros de leitura. A nova interface preserva descrições, preços e unidades da fonte e permite consultar as aplicações por filtros dependentes. É um retrato datado, sem sincronização automática.

Education contém dois cursos: Módulo 1 presencial (16 horas, dois dias) e Módulo 2 híbrido (15 horas online e 16 presenciais). História e quatro biografias foram preservadas. Media tinha apenas “Teste”. Portal é acesso restrito de revendedores, não um portal editorial; o redesign mantém o acesso ao sistema original, assim como a Área do Cliente.

## Redirecionamentos verificados

| URLs originais sem barra final | Comportamento observado |
|---|---|
| /acf, /performance, /education, /media, /portal, /contato, /area-do-cliente | HTTPS → 301 HTTP com barra → 308 HTTPS com barra → 200 |
| Home, história, equipe e detalhes dos cursos consultados | Resposta final 200; detalhes sem a cadeia acima |

Não foi observado loop infinito. Recomenda-se corrigir o servidor original para um único redirecionamento HTTPS → HTTPS. O código entregue usa diretamente as rotas com barra; não altera a configuração do domínio oficial. Evidência: `research/redirects.json`.

## Direção escolhida

“Potência sob controle”: fotografia real de carro no dinamômetro, fundo quase preto, vermelho da marca, títulos condensados e números alinhados como instrumentos. A composição alterna faixas editoriais, comparação técnica e uma seção clara para Education. A finalidade é tornar preparação, evidência e orçamento reconhecíveis rapidamente.

O vermelho #e00000 foi encontrado no CSS original. #ff6666 é sua adaptação para texto sobre fundos escuros. Fotos, logo e gráficos vêm das fontes ACF; não há veículos ou depoimentos gerados. Os números comerciais em HP/Nm são separados do gráfico original em WHP/kgf·m. Alegações históricas de recordes permanecem atribuídas à história publicada, sem afirmar validade atual.

## Arquitetura entregue

11 páginas: Home, ACF, História, Equipe Performance, Performance, Education, dois detalhes de curso, Media, Portal e Contato; mais página 404. Loja, redes, playlist Tunercast, WhatsApp, autenticação e contratação continuam nos destinos originais. HTML/CSS/JavaScript estático, com geração compartilhada em Python.
