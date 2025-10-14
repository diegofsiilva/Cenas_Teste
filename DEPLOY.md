# 🚀 Guia de Deploy - Cenas Bar e Lounge PDV

## Deploy no GitHub Pages (Recomendado)

### Passo 1: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique em "New repository"
3. Nome sugerido: `cenas-bar-pdv`
4. Marque como "Public" ou "Private" (ambos funcionam)
5. Clique em "Create repository"

### Passo 2: Fazer Upload do Código

**Opção A: Via Git (Recomendado)**

```bash
cd /caminho/para/cenas-bar-pdv
git init
git add .
git commit -m "Initial commit - Sistema PDV Cenas Bar"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/cenas-bar-pdv.git
git push -u origin main
```

**Opção B: Via Interface Web**

1. No repositório criado, clique em "uploading an existing file"
2. Arraste todos os arquivos da pasta `cenas-bar-pdv`
3. Clique em "Commit changes"

### Passo 3: Configurar GitHub Pages

1. No repositório, vá em **Settings** > **Pages**
2. Em "Build and deployment":
   - Source: selecione **GitHub Actions**
3. O deploy será feito automaticamente via GitHub Actions

### Passo 4: Aguardar Deploy

1. Vá em **Actions** no repositório
2. Aguarde o workflow "Deploy to GitHub Pages" completar (leva ~2 minutos)
3. Quando aparecer ✅ verde, o site está no ar!

### Passo 5: Acessar o Site

Seu site estará disponível em:
```
https://SEU_USUARIO.github.io/cenas-bar-pdv/
```

## Deploy Manual (Alternativa)

Se preferir fazer deploy manual sem GitHub Actions:

### 1. Construir o Projeto

```bash
cd cenas-bar-pdv
pnpm install
pnpm run build
```

### 2. Deploy via gh-pages

```bash
# Instalar gh-pages
pnpm add -D gh-pages

# Adicionar script no package.json
# "deploy": "gh-pages -d dist"

# Fazer deploy
pnpm run deploy
```

### 3. Configurar GitHub Pages

1. Vá em Settings > Pages
2. Source: Deploy from a branch
3. Branch: gh-pages / root
4. Save

## Deploy em Outros Serviços

### Vercel

1. Instale a CLI: `npm i -g vercel`
2. Execute: `vercel`
3. Siga as instruções

### Netlify

1. Arraste a pasta `dist` em [netlify.com/drop](https://app.netlify.com/drop)
2. Ou conecte o repositório GitHub

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Configuração de Domínio Customizado

Se você tem um domínio próprio (ex: `pdv.cenasbar.com.br`):

### No GitHub Pages

1. Vá em Settings > Pages
2. Em "Custom domain", digite seu domínio
3. Clique em Save
4. No seu provedor de domínio, adicione um registro CNAME:
   ```
   CNAME: pdv
   Valor: SEU_USUARIO.github.io
   ```

## Atualizações Futuras

Para atualizar o sistema após o deploy inicial:

```bash
# Faça suas alterações no código
git add .
git commit -m "Descrição das alterações"
git push
```

O GitHub Actions fará o deploy automaticamente!

## Troubleshooting

### Erro 404 ao acessar

- Verifique se o GitHub Pages está ativado
- Aguarde alguns minutos após o primeiro deploy
- Limpe o cache do navegador (Ctrl+Shift+R)

### Página em branco

- Verifique se o build foi concluído com sucesso
- Veja os logs em Actions > Deploy to GitHub Pages
- Certifique-se de que não há erros no console do navegador (F12)

### Estilos não carregam

- Verifique se todos os arquivos CSS foram incluídos no build
- Limpe o cache do navegador
- Verifique se o Tailwind CSS está configurado corretamente

## Backup dos Dados

⚠️ **IMPORTANTE**: Os dados do sistema ficam salvos no navegador (LocalStorage).

Para fazer backup:

1. Acesse "Relatórios"
2. Clique em "Exportar Relatório"
3. Salve o arquivo JSON em local seguro

Para restaurar, você precisará importar manualmente via console do navegador ou implementar uma função de importação.

## Suporte

Para problemas com deploy, consulte:
- [Documentação GitHub Pages](https://docs.github.com/pages)
- [Documentação Vite](https://vitejs.dev/guide/static-deploy.html)

---

**Boa sorte com o deploy! 🎉**

