# Design system — ACF Performance

Os tokens implementados ficam em `dist/style.css`; os componentes compartilhados em `build.py`.

| Papel | Valor |
|---|---|
| Fundo | #101114 |
| Superfície | #191b20 |
| Superfície elevada | #22252b |
| Texto principal | #f6f6f7 |
| Texto secundário | #b5b7bf |
| Divisor decorativo | #393c43 |
| Ação principal / marca | #e00000 |
| Destaque textual no escuro | #ff6666 |
| Seção clara | #eff0f2 |
| Texto na seção clara | #191b20 |

Barlow Condensed 600 para títulos e números; Barlow 400–700 para leitura e controles; IBM Plex Mono 400–500 para identificadores. Fontes carregadas por Google Fonts, com fallbacks locais. Texto de leitura geralmente 16–18px; metadados a partir de 12px; títulos fluidos por `clamp`. Evitar caixa alta em parágrafos longos; descrições integrais legadas ficam em disclosures.

Escala de espaçamento: 4, 8, 12, 16, 24, 32, 48, 64 e 96px. Margens laterais fluidas, conteúdo com referência de 1400px. Pontos de adaptação: 1150, 900 e 600px. Menu compacto abaixo de 900px; grades viram uma coluna em celulares. Campos usam 16px em mobile.

## Componentes e contratos

- Cabeçalho: logo original, navegação, acesso externo do cliente e orçamento. Menu móvel controla `aria-expanded`; Escape fecha e devolve foco ao botão.
- Botões: ação vermelha, alternativa contornada e link direcional. Foco visível com contorno e afastamento. Setas decorativas ocultas da árvore acessível.
- Comparação: botões Stage 1/2 com `aria-pressed`, números atualizados em região viva; unidades e origem explícitas.
- Catálogo: quatro selects nativos; dependentes desabilitados até seleção anterior. Estados de carregamento, seleção incompleta, aplicação sem pacote, versão inexistente e falha. Trocar seleção limpa resultados e versão antiga da URL.
- Pacote: tabela semântica com cabeçalhos, descrição e imagens em disclosures, orçamento contextual e contratação original.
- Curso: formato, aprendizado, duração, pré-requisito e CTA; data/preço ausentes marcados. Detalhe mantém descrição original acessível.
- Contato: labels associados, validação nativa e mensagem preparada localmente. O usuário abre o WhatsApp para concluir o envio; não há backend de e-mail.
- Equipe: biografias reais e placeholders explícitos de retrato.

O movimento é discreto e respeita `prefers-reduced-motion`. Imagens possuem texto alternativo; navegação tem link de salto. Divisores decorativos não substituem bordas de campos. Contraste de cores sólidas está registrado em `VERIFICACAO.md`; isso não equivale a certificação integral de acessibilidade.

## Home aprovada — revisão visual

A home usa a última composição aprovada: fundo automotivo contínuo, título em duas linhas, CTA à esquerda e faixa de serviços. `dist/approved-home.css` concentra os estilos específicos. A imagem `hero-approved.png` é uma composição gerada a partir da foto original e do conceito aprovado, não um novo registro documental da oficina. Textos, menu e botões permanecem HTML acessível. No celular, texto e orçamento precedem a imagem para preservar legibilidade.

Revisão escolhida em 23/09/2026: composição PERFORMANCE vermelha ao fundo, carro central e CTA inferior. A arte decorativa está em hero-performance.png; título principal, navegação, legendas e botões são HTML. A arte é uma composição visual, não evidência documental de resultados.

Identidade estendida às 11 páginas: performance-system.css define fundo preto, superfícies escuras, cabeçalhos com palavra decorativa vermelha, títulos condensados pesados, ações arredondadas, catálogo, formulário, cursos, equipe e rodapé. Conteúdo e integrações mantidos. Verificação: dez rotas internas a 390px sem overflow, preparação local do WhatsApp e troca de fabricante no catálogo.

Catálogo aprovado: catalog-layout.css implementa filtros laterais, veículo selecionado e comparação dinâmica entre original e todos os pacotes. A aplicação BMW M3 é exibida inicialmente; os filtros cobrem o catálogo completo. Valores originais divergentes não são fundidos. Detalhes comerciais permanecem expansíveis. No celular, filtros acima e tabela em região rolável com foco por teclado.

Comparação na home (#resultados): fabricante e aplicação selecionáveis, três colunas Original/Stage 1/Stage 2, potência/torque e ganhos preservados. Stage ausente recebe aviso, sem números inventados. Testados BMW M3 versão 96 e Audi A1 versão 1283 sem Stage 2. Valores originais divergentes são identificados.
