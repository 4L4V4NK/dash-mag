#!/bin/bash

################################################################################
#                                                                              #
#  🚀 SCRIPT DE DEPLOYMENT - EXPORT REACT DASHBOARDS                          #
#                                                                              #
#  Destino: 10.253.100.16:45829 (User: nereidas)                             #
#  Projeto: EXPORT_REACT_DASHBOARDS                                           #
#                                                                              #
################################################################################

set -e

# Configurações
REMOTE_HOST="10.253.100.16"
REMOTE_PORT="45829"
REMOTE_USER="nereidas"
REMOTE_PATH="/home/nereidas/projects"
LOCAL_EXPORT_PATH="/ai-monitoring/EXPORT_REACT_DASHBOARDS"
PROJECT_NAME="EXPORT_REACT_DASHBOARDS"

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================================================
# FUNÇÕES
# ============================================================================

print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║ $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}\n"
}

print_step() {
    echo -e "${YELLOW}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ============================================================================
# VALIDAÇÕES INICIAIS
# ============================================================================

print_header "VALIDANDO AMBIENTE LOCAL"

print_step "Verificando se pasta de export existe..."
if [ ! -d "$LOCAL_EXPORT_PATH" ]; then
    print_error "Pasta não encontrada: $LOCAL_EXPORT_PATH"
    exit 1
fi
print_success "Pasta encontrada"

print_step "Verificando arquivo .tar.gz..."
if [ ! -f "/ai-monitoring/EXPORT_REACT_DASHBOARDS.tar.gz" ]; then
    print_step "Criando arquivo comprimido..."
    cd /ai-monitoring
    tar -czf EXPORT_REACT_DASHBOARDS.tar.gz EXPORT_REACT_DASHBOARDS/
    print_success "Arquivo criado"
else
    print_success "Arquivo já existe"
fi

print_step "Testando conexão SSH..."
if ! ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "echo 'SSH OK'" > /dev/null 2>&1; then
    print_error "Falha na conexão SSH"
    echo "Verifique:"
    echo "  Host: $REMOTE_HOST"
    echo "  Port: $REMOTE_PORT"
    echo "  User: $REMOTE_USER"
    exit 1
fi
print_success "Conexão SSH funcionando"

# ============================================================================
# PREPARAR SERVIDOR REMOTO
# ============================================================================

print_header "PREPARANDO SERVIDOR REMOTO"

print_step "Criando estrutura de diretórios..."
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << 'EOF'
    mkdir -p /home/nereidas/projects
    mkdir -p /home/nereidas/projects/logs
    mkdir -p /home/nereidas/projects/backups
    echo "✓ Diretórios criados"
EOF

print_success "Estrutura criada"

print_step "Verificando Node.js e npm..."
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << 'EOF'
    echo "Node.js version:"
    node --version || echo "⚠️  Node.js não instalado"
    
    echo "npm version:"
    npm --version || echo "⚠️  npm não instalado"
EOF

# ============================================================================
# UPLOAD DO PROJETO
# ============================================================================

print_header "TRANSFERINDO ARQUIVOS"

print_step "Enviando arquivo comprimido ($(du -h /ai-monitoring/EXPORT_REACT_DASHBOARDS.tar.gz | cut -f1))..."

scp -P $REMOTE_PORT /ai-monitoring/EXPORT_REACT_DASHBOARDS.tar.gz \
    $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/

print_success "Upload concluído"

print_step "Extraindo no servidor..."
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << 'EOF'
    cd /home/nereidas/projects
    tar -xzf EXPORT_REACT_DASHBOARDS.tar.gz
    echo "✓ Arquivos extraídos"
EOF

print_success "Arquivos extraídos"

# ============================================================================
# INSTALAR DEPENDÊNCIAS E BUILD
# ============================================================================

print_header "INSTALANDO DEPENDÊNCIAS E FAZENDO BUILD"

print_step "Instalando npm packages..."
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << 'EOF'
    cd /home/nereidas/projects/EXPORT_REACT_DASHBOARDS
    npm install --legacy-peer-deps 2>&1 | tail -20
    echo "✓ Dependências instaladas"
EOF

print_success "Dependências instaladas"

print_step "Fazendo build do projeto..."
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << 'EOF'
    cd /home/nereidas/projects/EXPORT_REACT_DASHBOARDS
    npm run build 2>&1 | tail -30
    echo "✓ Build concluído"
EOF

print_success "Build concluído"

# ============================================================================
# CONFIGURAR AMBIENTE
# ============================================================================

print_header "CONFIGURANDO AMBIENTE"

print_step "Criando .env.production..."
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << 'EOF'
cat > /home/nereidas/projects/EXPORT_REACT_DASHBOARDS/.env.production << 'ENVFILE'
# Configurações de Produção
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_CLICKHOUSE_API=http://10.253.100.16:8123
NEXT_PUBLIC_N8N_WEBHOOK=http://10.253.100.16:5678/webhook
NEXT_PUBLIC_CHAT_API=http://10.253.100.16:3001
NEXT_PUBLIC_APP_NAME=Corelytics AI Monitoring
ENVFILE
    echo "✓ .env.production criado"
EOF

print_success ".env.production configurado"

# ============================================================================
# CRIAR SYSTEMD SERVICE (OPCIONAL)
# ============================================================================

print_header "CRIANDO SYSTEMD SERVICE (OPCIONAL)"

print_step "Criando service file..."
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << 'EOF'
cat > /tmp/corelytics-dashboard.service << 'SERVICE'
[Unit]
Description=Corelytics React Dashboards
After=network.target

[Service]
Type=simple
User=nereidas
WorkingDirectory=/home/nereidas/projects/EXPORT_REACT_DASHBOARDS
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
SERVICE

    echo "✓ Service file criado em /tmp/corelytics-dashboard.service"
    echo ""
    echo "Para instalar (requer sudo):"
    echo "  sudo cp /tmp/corelytics-dashboard.service /etc/systemd/system/"
    echo "  sudo systemctl daemon-reload"
    echo "  sudo systemctl enable corelytics-dashboard"
    echo "  sudo systemctl start corelytics-dashboard"
EOF

print_success "Service file criado"

# ============================================================================
# INFORMAÇÕES FINAIS
# ============================================================================

print_header "🎉 DEPLOYMENT CONCLUÍDO COM SUCESSO!"

echo -e "${GREEN}Projeto foi enviado para:${NC}"
echo "  📍 Host: $REMOTE_HOST:$REMOTE_PORT"
echo "  👤 User: $REMOTE_USER"
echo "  📁 Path: /home/nereidas/projects/EXPORT_REACT_DASHBOARDS"

echo -e "\n${GREEN}Próximos Passos:${NC}"
echo "  1. SSH no servidor:"
echo "     ssh -p 45829 nereidas@10.253.100.16"
echo ""
echo "  2. Iniciar o projeto em desenvolvimento:"
echo "     cd /home/nereidas/projects/EXPORT_REACT_DASHBOARDS"
echo "     npm run dev"
echo ""
echo "  3. Ou iniciar em produção (requer PM2 ou systemd):"
echo "     npm run start"
echo ""
echo "  4. URLs para acessar (assumindo porta 3000 padrão):"
echo "     🔵 http://10.253.100.16:3000/dashboard/login"
echo "     🔵 http://10.253.100.16:3000/dashboard/executive"
echo "     🔵 http://10.253.100.16:3000/dashboard/operational-v2"
echo "     🔵 http://10.253.100.16:3000/dashboard/predictive-v2"

echo -e "\n${GREEN}Arquivos importantes no servidor:${NC}"
echo "  📄 .env.production - Configurações de produção"
echo "  📄 INTEGRATION_GUIDE.md - Guia de integração"
echo "  📄 README.md - Documentação geral"
echo "  📁 .next/ - Build otimizado para produção"

echo -e "\n${YELLOW}Dicas:${NC}"
echo "  • Para usar PM2: npm install -g pm2 && pm2 start npm --name dashboard -- start"
echo "  • Para nginx: Configure proxy reverso apontando para localhost:3000"
echo "  • Logs: Verifique com 'npm run dev' ou journalctl para systemd"

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

################################################################################
#                           DEPLOYMENT COMPLETO                               #
################################################################################
