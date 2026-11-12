# Portfólio de Leonardo Carvalho — GitHub Pages

Portfólio pessoal focado em **desenvolvimento web e automação**. Contém 10 templates conceituais navegáveis e dois estudos de caso descritos sem código ou informações corporativas privadas.

## Publicação no GitHub Pages

1. No GitHub, crie um repositório **público** chamado `portfolio-dev` no usuário `LeoCarvalho090`.
2. Extraia o ZIP e envie **o conteúdo interno da pasta**, incluindo `index.html`, `assets/`, `projetos/`, `.nojekyll`, `robots.txt` e `sitemap.xml`, diretamente para a raiz do repositório. Não envie uma pasta `portfolio-dev/` envolvendo tudo.
3. Abra **Settings → Pages** e escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
4. Após o deploy, acesse `https://leocarvalho090.github.io/portfolio-dev/`.
5. Teste os dez botões “Ver website” e a navegação móvel.

> Os caminhos de `canonical`, `og:image`, `sitemap.xml` e `robots.txt` foram preparados para a URL acima. Se mudar o nome do repositório ou usuário, ajuste estes quatro itens antes de publicar.

## Desenvolvimento local

```bash
cd portfolio-dev
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra `http://localhost:8000/`.

## Personalizar informações

- `index.html`: título, biografia e estudos de caso.
- `assets/js/site-config.js`: link do GitHub e opcionais `linkedin` e `email`. Campos vazios não são exibidos ao público.
- `assets/js/projects.js`: nomes, segmentos, descrições e caminhos das 10 demonstrações.
- `assets/css/styles.css`: tema visual e responsividade.
- `assets/img/`: miniaturas e imagem de compartilhamento.
- `projetos/`: cópias de sites demonstrativos; todos marcados com `noindex,nofollow` e aviso de projeto conceitual.

## Privacidade e autoria

- **Não** contém código-fonte, dados de clientes, acessos ou documentos do projeto de automação corporativa.
- Os dez websites são **templates conceituais**, e não contratos ou clientes atendidos.
- Alguns templates antigos usam imagens externas de Unsplash e fontes do Google. Revise as licenças e substitua imagens antes de comercializar um modelo.
- O GitHub Pages gratuito, em repositório público, torna **todos os arquivos enviados ao repositório visíveis a outras pessoas**. Publicar este ZIP permite inspeção do código dos templates. Para manter o código privado, considere publicar apenas as miniaturas e apontar as demonstrações para hospedagem externa.
- Não há licença aberta incluída. Isso não impede terceiros de visualizar o código disponível publicamente.

## Testes locais realizados

- Navegação e filtros por 5 categorias
- Busca instantânea de modelos
- Menu responsivo
- Abertura das 10 demos
- Layout de desktop e mobile

## Observação

Os links sociais adicionais são opcionais. Nenhum e-mail pessoal foi incluído automaticamente.


## Sistema interativo em destaque — AutomationLab

O projeto autoral independente foi adicionado a `apps/automationlab/` e o cartão foi colocado antes dos dez websites no `index.html`.

- **Demo publicada após upload ao Pages:** `https://leocarvalho090.github.io/portfolio-dev/apps/automationlab/`
- **Código:** `apps/automationlab/assets/engine.mjs` (regras e estados), `assets/app.js` (interface), `tests/engine.test.mjs`.
- **Teste:** `cd apps/automationlab && npm test`.
- **Importante:** toda fila de execução é **simulada no navegador**; não há processamento em backend ou dados de clientes.
