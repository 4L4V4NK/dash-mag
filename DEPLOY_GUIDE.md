# 🚀 Guia de Deployment - React Export Dashboards

## Servidor Alvo
- **Host**: `10.253.100.16`
- **Port**: `45829`
- **User**: `nereidas`
- **Path**: `/home/nereidas/projects/EXPORT_REACT_DASHBOARDS`

---

## 🎯 Deployment Automatizado (Recomendado)

### 1️⃣ Executar script de deployment

```bash
cd /ai-monitoring
./deploy-react-export.sh
```

Este script irá:
- ✅ Validar conexão SSH
- ✅ Comprimir projeto
- ✅ Enviar arquivos via SCP
- ✅ Extrair no servidor
- ✅ Instalar dependências (npm install)
- ✅ Fazer build (npm run build)
- ✅ Criar `.env.production`
- ✅ Gerar service file (systemd)

### 2️⃣ Aguarde a conclusão

O script mostrará:
```
🎉 DEPLOYMENT CONCLUÍDO COM SUCESSO!

Projeto foi enviado para:
  📍 Host: 10.253.100.16:45829
  👤 User: nereidas
  📁 Path: /home/nereidas/projects/EXPORT_REACT_DASHBOARDS
```

---

## 🔧 Deployment Manual (Se Preferir)

### Passo 1: Conectar via SSH

```bash
ssh -p 45829 nereidas@10.253.100.16
```

### Passo 2: Preparar diretórios

```bash
mkdir -p ~/projects
cd ~/projects
```

### Passo 3: Enviar arquivos

**Do seu PC local:**
```bash
scp -P 45829 /ai-monitoring/EXPORT_REACT_DASHBOARDS.tar.gz \
    nereidas@10.253.100.16:~/projects/
```

### Passo 4: Extrair no servidor

**No servidor remoto:**
```bash
cd ~/projects
tar -xzf EXPORT_REACT_DASHBOARDS.tar.gz
cd EXPORT_REACT_DASHBOARDS
```

### Passo 5: Instalar dependências

```bash
npm install --legacy-peer-deps
```

### Passo 6: Build

```bash
npm run build
```

### Passo 7: Configurar .env.production

```bash
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_CLICKHOUSE_API=http://10.253.100.16:8123
NEXT_PUBLIC_N8N_WEBHOOK=http://10.253.100.16:5678/webhook
NEXT_PUBLIC_CHAT_API=http://10.253.100.16:3001
NEXT_PUBLIC_APP_NAME=Corelytics AI Monitoring
EOF
```

---

## ▶️ Iniciar o Projeto

### Opção 1: Desenvolvimento (Com reload automático)

```bash
npm run dev
```

Acesse: `http://10.253.100.16:3000/dashboard/login`

### Opção 2: Produção com npm start

```bash
npm run start
```

### Opção 3: Produção com PM2 (Recomendado)

#### Instalar PM2 globalmente

```bash
npm install -g pm2
```

#### Iniciar com PM2

```bash
cd /home/nereidas/projects/EXPORT_REACT_DASHBOARDS
pm2 start npm --name "corelytics-dashboard" -- start
pm2 save
pm2 startup
```

#### Gerenciar com PM2

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs corelytics-dashboard

# Reiniciar
pm2 restart corelytics-dashboard

# Parar
pm2 stop corelytics-dashboard

# Remover
pm2 delete corelytics-dashboard
```

### Opção 4: Systemd Service (Melhor opção para produção)

O script já criou o arquivo service em `/tmp/corelytics-dashboard.service`

**Instalar (requer sudo):**

```bash
sudo cp /tmp/corelytics-dashboard.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable corelytics-dashboard
sudo systemctl start corelytics-dashboard
```

**Gerenciar:**

```bash
# Status
sudo systemctl status corelytics-dashboard

# Logs
sudo journalctl -u corelytics-dashboard -f

# Reiniciar
sudo systemctl restart corelytics-dashboard

# Parar
sudo systemctl stop corelytics-dashboard
```

---

## 🌐 URLs para Acessar

Assumindo que o servidor está rodando em `localhost:3000`:

| Página | URL |
|--------|-----|
| Login | `http://10.253.100.16:3000/dashboard/login` |
| Executive Dashboard | `http://10.253.100.16:3000/dashboard/executive` |
| Operational v2 | `http://10.253.100.16:3000/dashboard/operational-v2` |
| Predictive v2 | `http://10.253.100.16:3000/dashboard/predictive-v2` |
| Dashboard Oficial (Legacy) | `http://10.253.100.16:3000/dashboard/dashboard-oficial` |

---

## ⚙️ Configuração de Nginx (Opcional)

Se quiser expor via nginx (porta 80/443), crie um vhost:

```nginx
server {
    listen 80;
    server_name 10.253.100.16;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Depois:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔍 Verificar Status

### SSH e verificar processo

```bash
ssh -p 45829 nereidas@10.253.100.16

# Se usando PM2
pm2 status

# Se usando systemd
systemctl status corelytics-dashboard

# Se usando npm direct
ps aux | grep npm
```

### Testar endpoint

```bash
curl http://10.253.100.16:3000/dashboard/login
```

### Ver logs

**Se usando PM2:**
```bash
pm2 logs corelytics-dashboard
```

**Se usando systemd:**
```bash
sudo journalctl -u corelytics-dashboard -f
```

**Se usando npm direct:**
```bash
# Ver output no terminal onde rodou npm run start
```

---

## 🛠️ Solução de Problemas

### "Connection refused"
- Verifique se a aplicação está rodando: `pm2 status`
- Reinicie: `pm2 restart corelytics-dashboard`

### "Port 3000 already in use"
```bash
# Encontrar processo
lsof -i :3000

# Matar processo
kill -9 <PID>
```

### "npm: command not found"
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Build falha
```bash
# Limpar cache
rm -rf .next node_modules package-lock.json

# Reinstalar
npm install --legacy-peer-deps

# Rebuild
npm run build
```

### Permissões de arquivo
```bash
# Dar permissão ao usuário nereidas
sudo chown -R nereidas:nereidas /home/nereidas/projects
```

---

## 📊 Monitoramento

### Usar PM2 Plus (opcional)

```bash
# Criar conta em pm2.io
pm2 plus

# Link seu PM2 local
pm2 link <secret_key> <public_key>

# Monitorar via web
# Acesse pm2.io para ver status, logs, alerts em tempo real
```

---

## 🚨 Backup e Restore

### Fazer backup

```bash
cd /home/nereidas/projects
tar -czf EXPORT_REACT_DASHBOARDS_backup_$(date +%Y%m%d_%H%M%S).tar.gz EXPORT_REACT_DASHBOARDS/
```

### Restaurar

```bash
tar -xzf EXPORT_REACT_DASHBOARDS_backup_20251117_120000.tar.gz
cd EXPORT_REACT_DASHBOARDS
npm install --legacy-peer-deps
npm run build
pm2 restart corelytics-dashboard
```

---

## 📝 Notas Importantes

1. **Dependências**: `recharts` e `lucide-react` são necessários
2. **Arquivo .env**: Configure as variáveis de ambiente conforme seu setup
3. **Integração com Backend**: Adapte as URLs em `.env.production` para sua API
4. **Segurança**: Use HTTPS em produção (configure SSL no nginx)
5. **Logs**: Monitore regularmente para detectar erros

---

## ✅ Checklist Final

- [ ] Deploy concluído com sucesso
- [ ] Processo está rodando (pm2 status)
- [ ] .env.production configurado com URLs corretas
- [ ] Login funciona (http://10.253.100.16:3000/dashboard/login)
- [ ] Executive dashboard carrega
- [ ] Menu de navegação funciona
- [ ] Chat assistant está integrado
- [ ] Backup feito regularmente

---

## 🎉 Parabéns!

Seu projeto React está online em produção! 🚀

Para dúvidas, verifique:
- `/home/nereidas/projects/EXPORT_REACT_DASHBOARDS/README.md`
- `/home/nereidas/projects/EXPORT_REACT_DASHBOARDS/INTEGRATION_GUIDE.md`
