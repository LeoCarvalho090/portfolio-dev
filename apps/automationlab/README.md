# AutomationLab — laboratório interativo de automação

Projeto demonstrativo independente, criado do zero para apresentar competências em JavaScript, organização de código, regras de negócio, testes, estados, deduplicação, auditoria e recuperação de uma execução simulada. **Não usa código, lógica exclusiva ou dados de sistemas comerciais de terceiros.**

## O que funciona

- **Auditoria de estoque:** calcula saldo disponível (estoque menos reservas) e identifica produtos abaixo do mínimo.
- **Validação de pedidos:** confere a existência do SKU, quantidades e disponibilidade; não efetiva uma venda.
- **Relatório de vendas:** soma valores fictícios e gera CSV (UTF-8 com BOM, separado por ponto e vírgula, para Excel em português).
- **Fila demonstrativa:** simula até duas tarefas simultâneas usando timers no navegador. Não existe processamento em servidor.
- **Idempotência demonstrativa:** uma mesma combinação `tipo + referência` nunca cria duas tarefas no estado local. Tentativas duplicadas são auditadas.
- **Falha controlada:** escolha “simular falha na primeira execução”, inspecione o erro, volte à fila e execute novamente com o mesmo ID.
- **Retomada:** se a página recarregar enquanto uma tarefa estiver `running`, ela será marcada `interrupted` e exigirá reenvio manual. Não há retomada automática de uma ação real.
- **Auditoria e exportação:** registros de eventos em JSON, resultados em CSV.
- **Persistência:** dados fictícios no `localStorage` do navegador; botão para restaurar o estado inicial.

## Iniciar no Linux / VS Code

Na pasta que contém `index.html`:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra `http://localhost:8000/`. Pode escolher outra porta se já existir um servidor. Não recomendamos abrir com `file://`, pois os módulos ES e o armazenamento variam entre navegadores.

## Executar testes sem instalar dependências

Com Node.js 20+:

```bash
npm test
```

O comando executa `node --test tests/*.test.mjs` e valida regras de negócio, CSV, deduplicação, falha, retomada e geração de estado.

## Como demonstrar para um recrutador

1. Abra a aplicação. Existem quatro operações fictícias: duas concluídas, uma aguardando e uma com falha controlada.
2. Clique em **Executar fila** para processar a tarefa pendente.
3. Em **Nova automação**, cadastre uma solicitação. Repita com o mesmo tipo e referência para ver o bloqueio de duplicidade.
4. Marque **Simular falha na primeira execução** em uma nova solicitação; execute a fila, abra os detalhes e clique em **Tentar novamente**.
5. Abra uma operação concluída e baixe o CSV de resultados; exporte também o log JSON.
6. Clique em **Restaurar demo** para reiniciar os dados fictícios.

## Hospedagem gratuita no GitHub Pages

O projeto é estático. Publique os arquivos `index.html`, `assets/`, `.nojekyll` diretamente na raiz de um repositório e configure Settings > Pages > Deploy from a branch, `main` / `(root)`.

Para usar dentro do repositório pessoal `portfolio-dev`, copie a pasta inteira para `apps/automationlab/`. A URL resultante será `https://leocarvalho090.github.io/portfolio-dev/apps/automationlab/` **depois da publicação**.

Para usar no hub local Vitruno Studio, copie a pasta inteira para `Websites/automationlab/` e adicione um cartão apontando para `automationlab/index.html`. Também existe um ZIP de hub já integrado.

## Organização

```text
automationlab/
├── index.html
├── assets/
│   ├── styles.css       # interface e responsividade
│   ├── app.js           # controles do navegador, persistência e animação da fila
│   ├── engine.mjs       # regras de negócio puras e estado da fila
│   └── favicon.svg
├── tests/
│   └── engine.test.mjs  # testes unitários
├── .nojekyll
├── package.json
└── README.md
```

## Limitações importantes antes de oferecer comercialmente

A versão atual **não é um sistema de produção**, não possui autenticação, banco de dados remoto, permissões, multiusuário, processamento de filas em servidor, proteção contra fraudes ou integrações reais. `localStorage` pode ser apagado pelo usuário; timers param quando o navegador fecha; a deduplicação não cobre múltiplas abas/dispositivos. Os dados são fictícios e não saem do navegador.

Para criar um produto comercial para lojas e empresas, é necessário especificar requisitos, backend seguro, base persistente, autenticação, permissões, registros de auditoria no servidor, estratégias de idempotência atômica, backups, monitoramento, privacidade/LGPD e testes de integração/carga. **Nenhuma promessa de desempenho multiusuário pode ser inferida deste demo.**

## Evolução possível da Vitruno Studio

- Controle de estoque com entradas/saídas reais.
- Pedidos e orçamentos para negócios locais.
- Controle de agendamentos e serviços.
- Painel administrativo com usuários e relatórios.
- Integração opcional com e-mail/WhatsApp, conforme APIs e consentimentos aplicáveis.

Nenhum nome de cliente, dado corporativo ou integração real está incluído. Este repositório não contém licença de software livre explícita; decida os termos de distribuição antes de comercializar ou compartilhar como biblioteca reutilizável.
