# 🚀 Guia de Deployment

## Visão Geral

Este guia cobre as estratégias de deployment para diferentes ambientes (desenvolvimento, staging, produção).

---

## 📋 Pré-requisitos

- Node.js 18+ e npm/yarn
- Docker & Docker Compose (opcional)
- Git
- Acesso ao servidor (SSH/HTTPS)
- Environment variables configuradas

---

## 🏗️ Estratégia 1: Docker (Recomendado)

### Build da imagem

```bash
# Build local
docker build -t dash-mag:latest .

# Verificar imagem
docker images | grep dash-mag
```

### Deploy com Docker Compose

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose -f docker-compose.yml up -d

# Com logs
docker-compose up -d && docker-compose logs -f
```

### Verificar status

```bash
# Container status
docker ps | grep dash-mag

# Logs
docker-compose logs -f web

# Shell no container
docker exec -it dash-mag-web bash

# Health check
curl http://localhost:3000/health
```

---

## 📦 Estratégia 2: PM2 (Node.js direto)

### Instalação

```bash
npm install -g pm2
cd /path/to/app
npm ci --production

# Build Next.js
npm run build
```

### Iniciar com PM2

```bash
# Usar arquivo de configuração
pm2 start ecosystem.config.js

# Ou direto
pm2 start "npm start" --name "dash-mag" --instances 2

# Logs
pm2 logs dash-mag

# Monitor
pm2 monit
```

### Configuração PM2 (`ecosystem.config.js`)

```javascript
module.exports = {
  apps: [
    {
      name: 'dash-mag',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      merge_logs: true
    }
  ],
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/4L4V4NK/dash-mag.git',
      path: '/var/www/dash-mag',
      'post-deploy': 'npm ci --production && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};
```

### Comandos PM2

```bash
# Reiniciar
pm2 restart dash-mag

# Reload (zero downtime)
pm2 reload dash-mag

# Parar
pm2 stop dash-mag

# Status
pm2 status

# Logs em tempo real
pm2 logs dash-mag --lines 100

# Salvar configuração
pm2 save
pm2 startup
```

---

## 🔧 Estratégia 3: GitHub Actions (CI/CD)

### Workflow: Build & Deploy

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Test
        run: npm test

      - name: Build Docker image
        run: docker build -t dash-mag:${{ github.sha }} .

      - name: Push to registry
        run: |
          docker tag dash-mag:${{ github.sha }} dash-mag:latest
          docker push dash-mag:latest

      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /var/www/dash-mag
            git pull origin main
            npm ci --production
            npm run build
            pm2 reload ecosystem.config.js --env production
```

---

## 📋 Checklist pré-deployment

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Banco de dados migrado
- [ ] Testes passando (`npm test`)
- [ ] Build local funcionando (`npm run build && npm start`)
- [ ] SSL certificates válidos
- [ ] Backups criados
- [ ] Health check configurado
- [ ] Monitoring ativo
- [ ] Alertas configurados

---

## 🌐 Estratégia 4: Nginx Reverse Proxy

### Configuração Nginx

```nginx
# /etc/nginx/sites-available/dash-mag
upstream dash_mag {
  server localhost:3000;
  server localhost:3001;
  server localhost:3002;
}

server {
  listen 80;
  listen [::]:80;
  server_name dashboard.example.com;
  
  # Redirect HTTP to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name dashboard.example.com;

  ssl_certificate /etc/ssl/certs/cert.pem;
  ssl_certificate_key /etc/ssl/private/key.pem;
  
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
  gzip_disable "msie6";

  location / {
    proxy_pass http://dash_mag;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
  }

  location /_next/static {
    alias /var/www/dash-mag/.next/static;
    expires 365d;
    add_header Cache-Control "public, immutable";
  }

  # Health check endpoint
  location /health {
    access_log off;
    proxy_pass http://dash_mag;
  }
}
```

### Habilitar site

```bash
sudo ln -s /etc/nginx/sites-available/dash-mag /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📊 Monitoramento & Logging

### Health Check

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version
  });
}
```

### Verificar health

```bash
# Local
curl http://localhost:3000/health

# Remoto
curl https://dashboard.example.com/health

# Com interval
watch -n 5 'curl -s http://localhost:3000/health | jq .'
```

### Logs

```bash
# Docker
docker logs -f dash-mag-web --tail 50

# PM2
pm2 logs dash-mag

# System
tail -f /var/log/syslog | grep dash-mag

# Application
tail -f logs/pm2-combined.log
```

---

## 🔄 Rollback

### Se usando Git

```bash
# Ver histórico
git log --oneline -10

# Rollback para commit anterior
git revert HEAD
git push origin main

# Rebuild
npm run build
pm2 reload ecosystem.config.js
```

### Se usando Docker

```bash
# Ver imagens
docker images dash-mag

# Voltar para versão anterior
docker-compose down
docker run -d -p 3000:3000 dash-mag:previous-tag
```

### Se usando Backups

```bash
# Restaurar backup
tar -xzf backup-$(date +%Y%m%d).tar.gz -C /var/www/dash-mag

# Restart
pm2 restart dash-mag
```

---

## 🔒 SSL/TLS Certificate

### Let's Encrypt com Certbot

```bash
# Instalar
sudo apt-get install certbot python3-certbot-nginx

# Obter certificado
sudo certbot certonly --nginx -d dashboard.example.com

# Renovação automática
sudo certbot renew --dry-run

# Crontab para renovação
0 2 * * * /usr/bin/certbot renew --quiet
```

---

## 📈 Performance Tuning

### Next.js

```javascript
// next.config.js
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    sizes: [640, 750, 828, 1080, 1200, 1920]
  },

  // Output optimization
  experimental: {
    optimizePackageImports: [
      'recharts',
      '@radix-ui/react-*'
    ]
  },

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=86400'
        }
      ]
    }
  ]
};
```

### Node.js

```bash
# Variáveis de ambiente
NODE_ENV=production
NODE_OPTIONS="--max-old-space-size=512"
```

---

## 📊 Environment Variables Checklist

```bash
# Application
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_AI_ENDPOINT=https://ai.example.com
NEXT_PUBLIC_ENVIRONMENT=production

# Authentication
NEXTAUTH_URL=https://dashboard.example.com
NEXTAUTH_SECRET=your-secret-key

# Database/Backend
CLICKHOUSE_URL=http://clickhouse:8123
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=password
DATABASE_URL=postgresql://user:pass@db:5432/dashdb

# AI Services
GEMINI_API_KEY=your-key
OPENAI_API_KEY=your-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info

# Port
PORT=3000
```

---

**Última atualização**: Nov 17, 2025
**Versão**: 1.0.0
