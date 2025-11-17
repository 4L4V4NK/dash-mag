Deployment do React Dashboards
==============================

🎯 OBJETIVO
-----------
Migrar o projeto EXPORT_REACT_DASHBOARDS para o servidor 10.253.100.16:45829 
com deploy automatizado, PM2 para gerenciamento e documentação completa.


📦 ARQUIVOS CRIADOS
-------------------

✅ START_DEPLOYMENT.sh (2.6 KB)
   → Script de entrada rápida (1 comando = tudo automatizado)
   → Ideal para: primeira execução, início rápido
   → Usar: ./START_DEPLOYMENT.sh

✅ deploy-react-export.sh (9.1 KB)
   → Script principal de deployment
   → Etapas: validação SSH → compress → upload → extract → install → build → config
   → Usar: ./deploy-react-export.sh

✅ manage-remote-dashboard.sh (7.3 KB)
   → Gerenciador remoto do projeto rodando
   → Comandos: status | logs | start | stop | restart | setup | ping
   → Usar: ./manage-remote-dashboard.sh <ação>

✅ DEPLOY_GUIDE.md (7.1 KB)
   → Documentação completa com 4 opções de deployment
   → Inclui: troubleshooting, monitoramento, nginx config, backup/restore
   → Ler: menos de 5 minutos para entender tudo

✅ QUICK_REFERENCE.txt (12 KB)
   → Cheat sheet com todos os comandos mais usados
   → Inclui: shortcuts, dicas, checklist
   → Abrir quando precisar de um comando rápido

✅ EXPORT_REACT_DASHBOARDS.tar.gz (88 KB)
   → Projeto comprimido pronto para upload
   → Criado automaticamente se não existir
   → Size: 632 KB expandido


🚀 QUICK START (3 PASSOS)
-------------------------

1️⃣  Executar deployment:
    cd /ai-monitoring
    ./START_DEPLOYMENT.sh
    
    ⏱️  Tempo: ~10-15 minutos

2️⃣  Iniciar projeto com PM2:
    ./manage-remote-dashboard.sh setup
    
    ⏱️  Tempo: ~1 minuto

3️⃣  Acessar no navegador:
    http://10.253.100.16:3000/dashboard/login
    
    ✅ Pronto! Dashboard online


📋 COMANDOS MÁS USADOS
---------------------

Deploy:
  ./START_DEPLOYMENT.sh         ← Recomendado (tudo em um!)
  ./deploy-react-export.sh      ← Alternativa manual

Gerenciar:
  ./manage-remote-dashboard.sh status    ← Ver status
  ./manage-remote-dashboard.sh logs      ← Ver logs em tempo real
  ./manage-remote-dashboard.sh restart   ← Reiniciar
  ./manage-remote-dashboard.sh setup     ← Primeira vez com PM2

SSH Direto:
  ssh -p 45829 nereidas@10.253.100.16
  pm2 logs corelytics-dashboard


🌐 URLS
------

Após iniciar (assumindo porta 3000 padrão):

  Login:
  http://10.253.100.16:3000/dashboard/login

  Executive Dashboard (principal):
  http://10.253.100.16:3000/dashboard/executive

  Operational v2:
  http://10.253.100.16:3000/dashboard/operational-v2

  Predictive v2:
  http://10.253.100.16:3000/dashboard/predictive-v2

  Legacy:
  http://10.253.100.16:3000/dashboard/dashboard-oficial


⚙️ DETALHES TÉCNICOS
-------------------

Stack:
  • Next.js 14.2.33
  • React 18.2.0
  • TypeScript (Strict)
  • CSS Modules
  • Recharts (gráficos)
  • Lucide React (ícones)

Servidor:
  • Node.js 18+
  • npm 9+
  • PM2 (process manager)
  • Linux (presumível)

Gerenciamento:
  • PM2 para auto-restart
  • Systemd service como backup
  • Log rotation automático


📊 O QUE SERÁ CRIADO NO SERVIDOR
---------------------------------

/home/nereidas/projects/
├── EXPORT_REACT_DASHBOARDS/          ← Projeto React
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── executive/
│   │   │   ├── operational-v2/
│   │   │   ├── predictive-v2/
│   │   │   └── dashboard-oficial/
│   │   └── ...
│   ├── components/                    ← 10+ componentes prontos
│   ├── hooks/                         ← 4 hooks (Golden Ratio)
│   ├── services/                      ← 5 services adaptáveis
│   ├── .next/                         ← Build otimizado (criado)
│   ├── node_modules/                  ← Dependências (criado)
│   ├── .env.production                ← Config (criado)
│   ├── package.json
│   └── README.md
├── logs/                              ← Para logs futuros
└── backups/                           ← Para backups


✅ CHECKLIST PRÉ-DEPLOYMENT
---------------------------

□ SSH funciona:
  ssh -p 45829 nereidas@10.253.100.16 "echo OK"

□ Conexão estável (para upload de ~100 MB)

□ Tempo disponível (10-15 minutos)

□ Arquivo comprimido existe:
  ls -lh EXPORT_REACT_DASHBOARDS.tar.gz

□ Scripts estão executáveis:
  ls -l deploy-react-export.sh manage-remote-dashboard.sh


🔍 MONITORAMENTO
---------------

Verificar status:
  ./manage-remote-dashboard.sh status

Ver logs:
  ./manage-remote-dashboard.sh logs

Ver processos:
  ./manage-remote-dashboard.sh ps

SSH direto:
  ssh -p 45829 nereidas@10.253.100.16
  pm2 status
  pm2 logs corelytics-dashboard


⚡ TROUBLESHOOTING RÁPIDO
------------------------

Problema: SSH connection refused
  ssh -p 45829 nereidas@10.253.100.16 "echo OK"

Problema: npm: command not found
  Servidor precisa de Node.js - contatar admin

Problema: Porta 3000 em uso
  ./manage-remote-dashboard.sh ps
  kill -9 <PID>

Problema: Build falha
  ./manage-remote-dashboard.sh logs
  Ver mensagem de erro específica

Problema: Dashboard não carrega
  Verificar: ./manage-remote-dashboard.sh status
  Ver logs: ./manage-remote-dashboard.sh logs


📚 DOCUMENTAÇÃO COMPLETA
------------------------

Para entender todas as opções:
  cat DEPLOY_GUIDE.md

Para comandos rápidos:
  cat QUICK_REFERENCE.txt

No servidor remoto:
  /home/nereidas/projects/EXPORT_REACT_DASHBOARDS/README.md
  /home/nereidas/projects/EXPORT_REACT_DASHBOARDS/INTEGRATION_GUIDE.md


🎯 WORKFLOW TÍPICO
------------------

1. Primeira vez:
   ./START_DEPLOYMENT.sh
   (aguarde 10-15 minutos)

2. Após finalizar:
   ./manage-remote-dashboard.sh setup

3. Verificar se está rodando:
   ./manage-remote-dashboard.sh status

4. Ver logs:
   ./manage-remote-dashboard.sh logs

5. Acessar:
   http://10.253.100.16:3000/dashboard/login

6. Tudo certo? Maravilha! 🎉


🔒 SEGURANÇA
-----------

⚠️ .env.production será criado com URLs padrão
   Recomendações:
   • Alterar senhas em produção
   • Usar HTTPS (nginx + SSL)
   • Configurar firewall
   • Fazer backup regularmente
   • Usar PM2 Plus para monitoring


🛠️ MANUTENÇÃO
-------------

Backup automático:
  ssh -p 45829 nereidas@10.253.100.16 << 'EOF'
  cd /home/nereidas/projects
  tar -czf EXPORT_REACT_DASHBOARDS_backup_$(date +%Y%m%d).tar.gz EXPORT_REACT_DASHBOARDS/
  EOF

Redeploy (caso necessário):
  ./manage-remote-dashboard.sh stop
  ./START_DEPLOYMENT.sh
  ./manage-remote-dashboard.sh setup


🎓 PRÓXIMAS ETAPAS
------------------

1. Deploy com START_DEPLOYMENT.sh
2. Verificar status com manage-remote-dashboard.sh
3. Testar URLs no navegador
4. Configurar nginx (opcional, para porta 80)
5. Fazer backup (criar rotina)
6. Integrar com seu backend/ClickHouse
7. Customizar .env.production conforme necessário


📞 SUPORTE
---------

SSH direto para troubleshooting:
  ssh -p 45829 nereidas@10.253.100.16
  cd /home/nereidas/projects/EXPORT_REACT_DASHBOARDS

Ver logs detalhados:
  pm2 logs corelytics-dashboard --lines 100

Reiniciar se travar:
  pm2 restart corelytics-dashboard

Ver recursos sendo usado:
  pm2 monit


═════════════════════════════════════════════════════════════════════════════
                            PRONTO PARA DEPLOY!
═════════════════════════════════════════════════════════════════════════════

Próximo comando:

    ./START_DEPLOYMENT.sh

Isso vai fazer tudo automaticamente! 🚀

═════════════════════════════════════════════════════════════════════════════
