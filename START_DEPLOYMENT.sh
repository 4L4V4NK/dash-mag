#!/bin/bash

# 🚀 START_DEPLOYMENT.sh - Iniciar deployment com 1 comando

cd /ai-monitoring

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        🚀 INICIANDO DEPLOYMENT DO REACT DASHBOARDS        ║"
echo "║                                                            ║"
echo "║  Destino: 10.253.100.16:45829 (User: nereidas)           ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "📋 Verificando arquivo de deployment..."
if [ ! -f "EXPORT_REACT_DASHBOARDS.tar.gz" ]; then
    echo "⚠️  Arquivo comprimido não encontrado. Criando..."
    tar -czf EXPORT_REACT_DASHBOARDS.tar.gz EXPORT_REACT_DASHBOARDS/
    echo "✅ Arquivo criado: $(ls -lh EXPORT_REACT_DASHBOARDS.tar.gz | awk '{print $5}')"
else
    echo "✅ Arquivo encontrado: $(ls -lh EXPORT_REACT_DASHBOARDS.tar.gz | awk '{print $5}')"
fi

echo ""
echo "📍 Iniciando deployment..."
echo ""

./deploy-react-export.sh

if [ $? -eq 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                                                            ║"
    echo "║         ✅ DEPLOYMENT CONCLUÍDO COM SUCESSO!              ║"
    echo "║                                                            ║"
    echo "║  Próximo passo: Iniciar projeto com PM2                   ║"
    echo "║                                                            ║"
    echo "║  ./manage-remote-dashboard.sh setup                       ║"
    echo "║                                                            ║"
    echo "║  Depois acesse: http://10.253.100.16:3000/dashboard/login║"
    echo "║                                                            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
else
    echo ""
    echo "❌ Deployment falhou. Verifique os logs acima."
    exit 1
fi
