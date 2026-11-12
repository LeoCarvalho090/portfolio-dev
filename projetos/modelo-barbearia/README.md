# Barbearia Bravo — Modelo 01 (portfólio)

Website de **uma página**, responsivo, com design escuro e detalhes dourados. Exemplo de negócio fictício para apresentação comercial. Sem dependência de servidor, cadastro ou banco de dados.

## Como visualizar

Abra `index.html` no navegador. Para servir em localhost durante o desenvolvimento, execute na pasta do projeto:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Antes de entregar a um cliente real

1. **WhatsApp:** abra `script.js` e configure `SITE_CONFIG.whatsappNumber` com DDI + DDD + número do estabelecimento, somente dígitos. Com o número vazio, os botões mostram um aviso de demonstração para **não enviar mensagens a terceiros**.
2. **Marca:** substitua `BRAVO`, o subtítulo do logo e os títulos do site; `businessName` em `script.js` também atualiza o nome em dois locais.
3. **Endereço e horários:** edite o HTML na seção `#contato` e a cidade no `SITE_CONFIG`. Inclua mapa/link de rota real, se desejado.
4. **Serviços e preços:** personalize os cartões na seção `#servicos` e remova o aviso de preços ilustrativos.
5. **Imagens:** substitua todas as URLs do Unsplash por fotos do comércio com permissão do titular e tratamento adequado de dados pessoais. As fotos de referência dependem de internet. Se falharem, aparecem artes de fundo e textos locais.
6. **SEO:** atualize `<title>`, `meta description`, textos, favicon e, se necessário, meta tags sociais. Antes de publicar um site para um cliente, considere acessibilidade, LGPD e dados comerciais corretos.
7. **Avisos de demo:** remova a frase `SITE CONCEITUAL / PORTFÓLIO — EMPRESA E DADOS FICTÍCIOS` do rodapé e a observação ilustrativa da galeria depois de substituir por conteúdos reais.
8. **Teste:** valide em Android/iPhone, clique em todos os links e confirme o WhatsApp com o proprietário antes da entrega.

## Publicação

É um site 100% estático. Pode ser publicado em Cloudflare Pages, Netlify, GitHub Pages e outros serviços compatíveis com HTML/CSS/JS. Para este modelo, publique os arquivos completos da pasta, incluindo `assets/`.

## Licença das fotografias de exemplo

As imagens externas do Unsplash foram incluídas apenas como referência de layout. A [licença do Unsplash](https://unsplash.com/license) permite o uso gratuito em muitos projetos comerciais, mas há restrições e possíveis direitos de pessoas, marcas e locais retratados. Para clientes reais, prefira fotos próprias autorizadas. URLs originais:

- https://images.unsplash.com/photo-1503951914875-452162b0f3f1
- https://images.unsplash.com/photo-1621605815971-fbc98d665033
- https://images.unsplash.com/photo-1599351431202-1e0f0137899a
- https://images.unsplash.com/photo-1598887142487-3c854d51eabb

## Estrutura

- `index.html` — textos, conteúdo e seções
- `styles.css` — aparência e responsividade
- `script.js` — configuração de WhatsApp e menu do celular
- `assets/favicon.svg` — ícone do navegador

Este site é uma demonstração. **Não representa uma barbearia real**, nem os valores e horários divulgados.
