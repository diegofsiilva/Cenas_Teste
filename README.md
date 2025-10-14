# Cenas Bar e Lounge - Sistema PDV

Sistema completo de Ponto de Venda desenvolvido para o **Cenas Bar e Lounge**, com interface moderna e intuitiva, utilizando as cores azul e preto do estabelecimento.

## 🎯 Funcionalidades

### 1. Controle de Mesas e Comandas
- Visualização de todas as mesas do bar (5 mesas principais, 2 superiores, 1 mesa de sinuca, 2 bistrôs)
- Abertura de comandas por mesa
- Registro opcional do nome do cliente
- Adição de produtos à comanda com possibilidade de ajustar preço
- Aplicação de descontos
- Fechamento de comanda com cálculo automático do total
- Baixa automática no estoque ao adicionar produtos

### 2. Gestão de Produtos
- Cadastro completo de produtos (nome, categoria, preço, descrição, imagem, estoque)
- Organização por categorias
- Busca e filtros
- Edição e exclusão de produtos
- Visualização em cards com imagens

### 3. Controle de Estoque
- Estatísticas de estoque (total de produtos, valor em estoque, alertas de estoque baixo)
- Entrada e saída manual de produtos
- Baixa automática ao realizar vendas
- Alertas visuais para produtos com estoque baixo ou zerado
- Ajuste de estoque com observações

### 4. Relatórios e Financeiro
- Relatórios diários, mensais e por período customizado
- Estatísticas de vendas (total, número de comandas, ticket médio, itens vendidos)
- Gráficos de vendas por categoria (pizza)
- Gráfico de vendas diárias do mês (linha)
- Histórico detalhado de todas as vendas
- Exportação de relatórios em JSON

### 5. Personalização Visual
- Ajuste de cores primária e secundária
- Presets de cores prontos (Azul, Roxo, Verde, Vermelho, Laranja, Ciano)
- Upload de logo personalizado
- Imagem de fundo customizável
- Preview em tempo real das alterações

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **Lucide Icons** - Ícones
- **Recharts** - Gráficos e visualizações
- **LocalStorage** - Persistência de dados local

## 📦 Instalação e Uso Local

### Pré-requisitos
- Node.js 18+ instalado
- pnpm (ou npm/yarn)

### Passos

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd cenas-bar-pdv
```

2. Instale as dependências:
```bash
pnpm install
```

3. Inicie o servidor de desenvolvimento:
```bash
pnpm run dev
```

4. Acesse no navegador:
```
http://localhost:5173
```

## 🌐 Deploy no GitHub Pages

### Opção 1: Deploy Manual

1. Construa o projeto:
```bash
pnpm run build
```

2. O build estará na pasta `dist/`

3. Configure o GitHub Pages:
   - Vá em Settings > Pages no seu repositório
   - Selecione "Deploy from a branch"
   - Escolha a branch `gh-pages` (ou crie uma)
   - Faça upload dos arquivos da pasta `dist/` para a branch

### Opção 2: Deploy Automático com GitHub Actions

1. Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Build
      run: pnpm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. Faça commit e push:
```bash
git add .
git commit -m "Add GitHub Actions deploy"
git push
```

3. O deploy será feito automaticamente a cada push na branch main

## 🔧 Configuração do Firebase (Opcional)

Para usar o Firebase como backend (recomendado para produção):

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)

2. Ative o Firestore Database e o Storage

3. Copie as credenciais do Firebase

4. Edite o arquivo `src/lib/firebase.js` e substitua as credenciais:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

5. Reconstrua e faça deploy novamente

## 📱 Uso do Sistema

### Fluxo Básico de Operação

1. **Cadastrar Produtos**
   - Acesse "Produtos" no menu
   - Clique em "Novo Produto"
   - Preencha os dados e salve

2. **Abrir uma Mesa**
   - Na tela "Mesas", clique em uma mesa disponível
   - Digite o nome do cliente (opcional)
   - Clique em "Abrir Comanda"

3. **Adicionar Produtos**
   - Com a mesa aberta, clique em "Adicionar Produto"
   - Selecione o produto desejado
   - Ajuste quantidade e preço se necessário
   - Clique em "Adicionar à Comanda"

4. **Fechar Comanda**
   - Revise os itens
   - Aplique desconto se necessário
   - Clique em "Fechar Comanda"

5. **Gerenciar Estoque**
   - Acesse "Estoque" no menu
   - Selecione um produto
   - Escolha "Entrada" ou "Saída"
   - Digite a quantidade e confirme

6. **Visualizar Relatórios**
   - Acesse "Relatórios" no menu
   - Selecione o tipo de relatório (Diário, Mensal ou Customizado)
   - Visualize estatísticas e gráficos
   - Exporte se necessário

## 🎨 Personalização

O sistema permite personalização completa das cores através da seção "Configurações":

- Use os presets prontos para testar diferentes combinações
- Ou customize manualmente usando o formato OKLCH
- Adicione seu logo e imagem de fundo
- Todas as alterações são salvas localmente

## 💾 Armazenamento de Dados

Por padrão, o sistema usa **LocalStorage** para armazenar todos os dados:
- Produtos
- Mesas e status
- Comandas ativas
- Histórico de vendas
- Configurações visuais

**Importante**: Os dados ficam salvos no navegador. Para backup, use a função de exportar relatórios ou configure o Firebase.

## 🔒 Segurança e Privacidade

- Todos os dados são armazenados localmente no navegador
- Nenhuma informação é enviada para servidores externos (exceto se configurar Firebase)
- Recomenda-se fazer backups regulares dos dados

## 📄 Licença

Este projeto foi desenvolvido para uso exclusivo do **Cenas Bar e Lounge**.

## 🤝 Suporte

Para dúvidas ou suporte, entre em contato com o desenvolvedor.

---

**Desenvolvido com ❤️ usando React + Vite + Tailwind CSS**

