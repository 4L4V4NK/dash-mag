#!/bin/bash

################################################################################
#                                                                              #
#  🎛️  GERENCIADOR REMOTO - PM2 DASHBOARDS                                   #
#                                                                              #
#  Uso: ./manage-remote-dashboard.sh <ação>                                   #
#                                                                              #
#  Ações:                                                                     #
#    start         - Iniciar o projeto                                       #
#    stop          - Parar o projeto                                         #
#    restart       - Reiniciar o projeto                                     #
#    status        - Ver status                                              #
#    logs          - Ver logs em tempo real                                  #
#    ps            - Ver processos                                           #
#    ping          - Testar conexão                                          #
#    install-pm2   - Instalar PM2 no servidor                                #
#    setup         - Configurar PM2 no servidor (primeira vez)               #
#                                                                              #
################################################################################

REMOTE_HOST="10.253.100.16"
REMOTE_PORT="45829"
REMOTE_USER="nereidas"
PROJECT_PATH="/home/nereidas/projects/EXPORT_REACT_DASHBOARDS"
PROJECT_NAME="corelytics-dashboard"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ============================================================================
# FUNÇÕES
# ============================================================================

show_usage() {
    echo -e "${BLUE}Gerenciador de Dashboard Remoto${NC}"
    echo ""
    echo "Uso: $0 <ação>"
    echo ""
    echo "Ações disponíveis:"
    echo "  start         - Iniciar o projeto"
    echo "  stop          - Parar o projeto"
    echo "  restart       - Reiniciar o projeto"
    echo "  status        - Ver status"
    echo "  logs          - Ver logs em tempo real"
    echo "  ps            - Ver processos"
    echo "  ping          - Testar conexão"
    echo "  install-pm2   - Instalar PM2"
    echo "  setup         - Configurar PM2 (primeira vez)"
    echo ""
}

test_connection() {
    if ! ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "echo 'OK'" > /dev/null 2>&1; then
        echo -e "${RED}❌ Falha na conexão SSH${NC}"
        exit 1
    fi
}

# ============================================================================
# AÇÕES
# ============================================================================

action_install_pm2() {
    echo -e "${YELLOW}▶ Instalando PM2 no servidor...${NC}"
    ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << 'EOF'
        npm install -g pm2
        echo ""
        echo "✅ PM2 instalado:"
        pm2 --version
EOF
    echo -e "${GREEN}✅ PM2 instalado com sucesso${NC}"
}

action_setup() {
    echo -e "${YELLOW}▶ Configurando PM2 no servidor (primeira vez)...${NC}"
    ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << EOF
        cd $PROJECT_PATH
        
        echo "Instalando PM2 globalmente..."
        npm install -g pm2
        
        echo ""
        echo "Iniciando projeto com PM2..."
        pm2 start npm --name "$PROJECT_NAME" -- start
        
        echo ""
        echo "Salvando configuração..."
        pm2 save
        
        echo ""
        echo "Configurando startup..."
        pm2 startup
        
        echo ""
        echo "Status:"
        pm2 status
        
        echo ""
        echo "✅ PM2 configurado e projeto iniciado!"
EOF
    
    echo -e "${GREEN}✅ Setup concluído${NC}"
    echo ""
    echo "URLs para acessar:"
    echo "  🔵 http://10.253.100.16:3000/dashboard/login"
    echo "  🔵 http://10.253.100.16:3000/dashboard/executive"
}

action_start() {
    echo -e "${YELLOW}▶ Iniciando projeto...${NC}"
    ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << EOF
        pm2 start $PROJECT_NAME
        echo ""
        echo "Status:"
        pm2 status
EOF
    echo -e "${GREEN}✅ Projeto iniciado${NC}"
}

action_stop() {
    echo -e "${YELLOW}▶ Parando projeto...${NC}"
    ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << EOF
        pm2 stop $PROJECT_NAME
        echo ""
        echo "Status:"
        pm2 status
EOF
    echo -e "${GREEN}✅ Projeto parado${NC}"
}

action_restart() {
    echo -e "${YELLOW}▶ Reiniciando projeto...${NC}"
    ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << EOF
        pm2 restart $PROJECT_NAME
        
        sleep 2
        
        echo ""
        echo "Status:"
        pm2 status
        
        echo ""
        echo "Primeiras linhas dos logs:"
        pm2 logs $PROJECT_NAME --lines 10
EOF
    echo -e "${GREEN}✅ Projeto reiniciado${NC}"
}

action_status() {
    echo -e "${YELLOW}▶ Verificando status...${NC}"
    echo ""
    ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "pm2 status"
}

action_logs() {
    echo -e "${YELLOW}▶ Exibindo logs em tempo real (Ctrl+C para sair)...${NC}"
    echo ""
    ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "pm2 logs $PROJECT_NAME"
}

action_ps() {
    echo -e "${YELLOW}▶ Processos da aplicação:${NC}"
    echo ""
    ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST << EOF
        echo "=== PM2 ==="
        pm2 status || echo "PM2 não está ativo"
        
        echo ""
        echo "=== Processos Node.js ==="
        ps aux | grep -i node | grep -v grep || echo "Nenhum processo Node.js"
        
        echo ""
        echo "=== Portas em uso ==="
        netstat -tuln | grep LISTEN || echo "Nenhuma porta escutando"
EOF
}

action_ping() {
    echo -e "${YELLOW}▶ Testando conexão...${NC}"
    if ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "echo 'SSH OK' && npm -v && pm2 -v" 2>/dev/null; then
        echo -e "\n${GREEN}✅ Conexão OK${NC}"
        echo "   SSH: ✓"
        echo "   npm: ✓"
        echo "   PM2: ✓"
    else
        echo -e "\n${RED}❌ Problema na conexão${NC}"
    fi
}

# ============================================================================
# MAIN
# ============================================================================

if [ $# -eq 0 ]; then
    show_usage
    exit 0
fi

ACTION=$1

test_connection

echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}\n"

case "$ACTION" in
    start)
        action_start
        ;;
    stop)
        action_stop
        ;;
    restart)
        action_restart
        ;;
    status)
        action_status
        ;;
    logs)
        action_logs
        ;;
    ps)
        action_ps
        ;;
    ping)
        action_ping
        ;;
    install-pm2)
        action_install_pm2
        ;;
    setup)
        action_setup
        ;;
    *)
        echo -e "${RED}❌ Ação desconhecida: $ACTION${NC}"
        show_usage
        exit 1
        ;;
esac

echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}\n"
