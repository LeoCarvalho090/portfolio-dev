# Modelo 02 — PULSO Fitness (portfólio)

Landing page responsiva para uma **academia fictícia**, pronta para ser adaptada e vendida a um estabelecimento real.

## O que está incluído

- Página inicial e identidade visual esportiva de alto impacto;
- Modalidades: musculação, funcional e cardio;
- Planos com valores ilustrativos e chamadas para matrícula;
- Diferenciais, horários, FAQ e seção de contato;
- Botões de WhatsApp com texto contextual;
- Menu adaptado para celular e tablet, HTML semântico e acessibilidade básica;
- Ilustrações SVG locais para apresentação mesmo sem internet;
- Código HTML, CSS e JavaScript puros, sem back-end e sem biblioteca obrigatória.

## Como visualizar

Abra `index.html` no seu navegador. O projeto pode ser hospedado em plataformas para sites estáticos, como Cloudflare Pages ou Netlify. Fonts externas são opcionais; se estiver offline, o navegador usa fontes locais.

## Como configurar o WhatsApp

No arquivo `script.js`, configure a variável `WHATSAPP_NUMBER` com um número verdadeiro do cliente (apenas dígitos, `55` + DDD + número). Enquanto estiver vazia, os botões apenas exibem a mensagem de demonstração: **não enviam mensagens para terceiros**.

```js
const WHATSAPP_NUMBER = '';
```

Os botões montam mensagens personalizadas, como "Gostaria de saber mais sobre o plano Evolution".

## Personalização para cada cliente

1. Substitua **PULSO Fitness** por marca real e ajuste título e textos.
2. Troque os planos, valores e benefícios por dados comerciais corretos.
3. Atualize endereço real, horários, contatos, fotos e modalidades.
4. Configure WhatsApp real no `script.js`.
5. Ajuste as cores CSS em `:root` se desejar mudar a identidade visual.
6. Revise políticas de contratação, promoções e condições que serão publicadas.
7. Publique e vincule um domínio registrado em nome do cliente.

## Observações

Este projeto é uma **demonstração fictícia**. Os planos, preços, serviços, horários e endereço genérico são ilustrativos. Não são usados depoimentos ou métricas inventadas. Evite publicar o nome fictício como se fosse um estabelecimento real.

Créditos: gráficos vetoriais originais presentes na pasta `assets/`.
