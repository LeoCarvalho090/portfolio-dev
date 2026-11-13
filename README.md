# Leonardo Carvalho — desenvolvimento web e automação

Sou Leonardo Carvalho, desenvolvedor com experiência em **interfaces web, automação de processos e integração de ferramentas**. Este repositório reúne projetos independentes que apresentam minha forma de trabalhar: compreender necessidades, estruturar regras, desenvolver interfaces claras e criar soluções com comportamento verificável.

**[Conhecer o portfólio](https://leocarvalho090.github.io/portfolio-dev/)** · **[LinkedIn](https://www.linkedin.com/in/leonardo-carvalho-131464449)** · **[Projeto AutomationLab](https://github.com/LeoCarvalho090/automationlab)**

## Projetos em destaque

### AutomationLab — automação e lógica de sistemas

Aplicação demonstrativa em JavaScript que reúne auditoria de estoque, validação de pedidos e relatórios de vendas fictícias. Inclui controle de estados, fila visual simulada, prevenção de tarefas duplicadas, falhas controladas, histórico e testes unitários.

- [Experimentar aplicação](https://leocarvalho090.github.io/portfolio-dev/apps/automationlab/)
- [Código-fonte e documentação técnica](https://github.com/LeoCarvalho090/automationlab)

As rotinas de negócio executam cálculos reais sobre dados fictícios; a fila e a temporização são simuladas no navegador. Não há backend ou banco de dados compartilhado.

### Websites responsivos — 10 conceitos independentes

Desenvolvi **dez interfaces demonstrativas** para segmentos comerciais distintos, com duas abordagens visuais para cada segmento: barbearias, academias, oficinas, pet shops e hamburguerias.

Os exemplos exploram **HTML semântico, CSS responsivo, identidade visual, navegação móvel e interatividade em JavaScript**. Alguns incluem filtros, carrinhos ou formulários de demonstração; nenhuma operação representa agendamento, compra ou atendimento real.

[Explorar a galeria de websites](https://leocarvalho090.github.io/portfolio-dev/#projetos)

## Experiência aplicada

Além dos projetos autorais, minha trajetória envolve automação de rotinas administrativas com **JavaScript, Google Apps Script e Google Workspace**, integrando ferramentas para organização de registros, documentos e comunicações.

Também participei, durante minha formação técnica, do desenvolvimento em equipe de um sistema acadêmico de agendamento de consultas, com aplicativo Android, interface web e gerenciamento de agenda.

Essas experiências são apresentadas de forma resumida. **Não publico código proprietário, dados de empresas ou materiais confidenciais.**

## Tecnologias e práticas

- **Web:** HTML5, CSS3, JavaScript, layouts responsivos e componentes de interface.
- **Automação:** Google Apps Script, Google Sheets, Gmail e Drive.
- **Lógica de sistemas:** regras de negócio, estados, prevenção de duplicidades, tratamento de falhas e registros de eventos.
- **Ferramentas:** Git, GitHub e testes automatizados com Node.js.

## Organização do repositório

```text
index.html                  Página principal do portfólio
assets/                     Estilos, scripts, imagens e configurações
apps/automationlab/         Versão integrada da demonstração
projetos/                   Dez websites conceituais independentes
robots.txt e sitemap.xml    Recursos básicos de indexação do portfólio
```

Os READMEs de cada demonstração registram suas particularidades e limitações.

### Execução local

Este portfólio é estático e pode ser executado com um servidor HTTP simples:

```bash
git clone https://github.com/LeoCarvalho090/portfolio-dev.git
cd portfolio-dev
python3 -m http.server 8000 --bind 127.0.0.1
```

Acesse `http://localhost:8000/`. Para os testes do AutomationLab:

```bash
cd apps/automationlab
npm test
```

Os testes exigem Node.js 20 ou superior.


---

**Leonardo Carvalho**  
[Portfólio](https://leocarvalho090.github.io/portfolio-dev/) · [LinkedIn](https://www.linkedin.com/in/leonardo-carvalho-131464449) · [GitHub](https://github.com/LeoCarvalho090)
