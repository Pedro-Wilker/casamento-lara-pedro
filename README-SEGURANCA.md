# 🔐 Segurança do Projeto - Casamento Lara & Pedro

## 🚨 **IMPORTANTE: Segurança das Credenciais**

Este projeto implementa um sistema seguro para gerenciar as credenciais do Supabase sem expô-las no código-fonte público.

## 📋 **Como Funciona a Segurança**

### **1. Variáveis de Ambiente**
As credenciais do Supabase são armazenadas como variáveis de ambiente:
- `SUPABASE_URL`: URL do projeto Supabase
- `SUPABASE_ANON_KEY`: Chave anônima do Supabase

### **2. Injeção Segura**
- Durante o build, as variáveis são injetadas no arquivo `env.js`
- O arquivo `env.js` está no `.gitignore` e não é commitado
- As credenciais nunca ficam expostas no repositório

### **3. Configuração por Ambiente**
- **Desenvolvimento**: Usa valores de fallback
- **Produção**: Usa variáveis do ambiente de hospedagem

## 🛠️ **Configuração por Ambiente**

### **Desenvolvimento Local**
1. Copie `.env.example` para `.env.local`
2. Preencha com suas credenciais reais
3. Execute `npm run dev`

### **Vercel (Produção)**
1. No painel do Vercel, vá para **Settings** → **Environment Variables**
2. Adicione as variáveis:
   ```
   SUPABASE_URL=https://ubxqubqkjktifrsvvzir.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVieHF1YXFqa2t0aWZyc3Z2emlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMjQ3NzAsImV4cCI6MjA0OTYwMDc3MH0.7YpDvJhHmYJzL3kX8mF2tQwRzZ4JkLmNpQrS6tV8wXk
   ```
3. Faça o deploy

### **Outras Plataformas**
- **Netlify**: Use **Site settings** → **Build & deploy** → **Environment**
- **GitHub Pages**: Use **GitHub Secrets** e **GitHub Actions**
- **Firebase**: Use **Firebase Functions** com variáveis de ambiente

## 🔒 **Boas Práticas de Segurança**

### **✅ O que é seguro:**
- ✅ Credenciais em variáveis de ambiente
- ✅ Chave anônima (não tem acesso total)
- ✅ Políticas RLS configuradas
- ✅ Arquivos sensíveis no `.gitignore`

### **❌ O que NUNCA fazer:**
- ❌ Comitar credenciais no código
- ❅ Usar chave service_key no frontend
- ❌ Expor dados sensíveis em logs
- ❅ Desabilitar RLS no Supabase

## 📁 **Arquivos de Segurança**

### **Protegidos (.gitignore):**
```
.env*
assets/js/env.js
supabase-credentials.json
*.key
*.pem
```

### **Públicos (seguros):**
```
assets/js/supabase-config.js (usa variáveis)
vercel.json (apenas para Vercel)
```

## 🔍 **Verificação de Segurança**

### **1. Verificar se as credenciais estão expostas:**
```bash
# Verificar se há credenciais no código
grep -r "supabase" --include="*.js" --exclude-dir=node_modules .
grep -r "eyJ" --include="*.js" --exclude-dir=node_modules .
```

### **2. Verificar variáveis de ambiente:**
```bash
# No navegador, abra o console
console.log(window.ENV);
```

### **3. Testar conexão segura:**
- Abra o site
- Clique em "🎁 Ver Lista de Presentes"
- Verifique se carrega sem erros no console

## 🚨 **Em Caso de Exposição**

Se as credenciais forem expostas acidentalmente:

1. **Imediatamente** vá ao painel do Supabase
2. Vá para **Settings** → **API**
3. Clique em **Regenerate** na chave anônima
4. Atualize as variáveis de ambiente
5. Revogue a chave antiga se possível

## 📞 **Suporte**

Para dúvidas sobre segurança:
1. Verifique este documento primeiro
2. Consulte a [documentação do Supabase](https://supabase.com/docs)
3. Revise as [boas práticas de segurança](https://supabase.com/docs/guides/security)

---

**⚠️ Lembre-se:** A segurança é responsabilidade de todos. Mantenha suas credenciais sempre protegidas!