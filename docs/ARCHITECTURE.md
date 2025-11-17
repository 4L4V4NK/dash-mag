# 🏗️ Arquitetura do Projeto - Dash Mag

## 📋 Visão Geral

Dash Mag é uma aplicação React/Next.js com múltiplos dashboards de analytics, construída com design system moderno (Golden Ratio + Bento Grid) e pronta para produção.

## 🗂️ Estrutura de Pastas

```
dash-mag/
├── EXPORT_REACT_DASHBOARDS/          # Composição React completa
│   ├── app/                          # Next.js App Router
│   │   ├── dashboard/
│   │   │   ├── login/               # Página de autenticação
│   │   │   ├── executive/           # Dashboard executivo (principal)
│   │   │   ├── operational-v2/      # Operações em tempo real
│   │   │   ├── predictive-v2/       # Análises preditivas
│   │   │   ├── dashboard-oficial/   # Legacy/Oficial
│   │   │   └── bento-grid-v2/       # Nova layout com Golden Ratio
│   │   └── layout.tsx               # Layout global
│   │
│   ├── components/                  # Componentes React reutilizáveis
│   │   ├── NavigationMenu.tsx       # Menu principal (3 variantes)
│   │   ├── ChatAssistant.tsx        # Chat com IA
│   │   ├── ChartBlock.tsx           # Bloco de gráficos
│   │   ├── DashboardHeader.tsx      # Cabeçalho padrão
│   │   ├── DashboardMetricCard.tsx  # Cartão de métrica
│   │   ├── HiddenBlocksBar.tsx      # Barra de controle de blocos
│   │   └── *.module.css             # CSS Modules para cada componente
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useGoldenGridLayout.ts  # Layout com Golden Ratio (Φ ≈ 1.618)
│   │   ├── useGoldenBreakpoint.ts  # Breakpoints em Fibonacci
│   │   ├── useBentoGridLayout.ts   # Layout Bento Grid moderno
│   │   └── useChartBlocks.ts       # Controle de visibilidade de blocos
│   │
│   ├── services/                    # Integração com API
│   │   ├── api.service.ts          # Base HTTP client
│   │   ├── executive-dashboard.service.ts
│   │   ├── operational-dashboard.service.ts
│   │   ├── predictive-dashboard.service.ts
│   │   └── dashboards-api.service.ts
│   │
│   ├── styles/                      # Design System
│   │   ├── corelytics-theme.ts     # Tema + cores (dark mode)
│   │   ├── dashboard-components.ts  # Estilos de componentes
│   │   ├── GlobalStyles.tsx         # Estilos globais
│   │   └── Dashboard.module.css     # Estilos do dashboard
│   │
│   ├── types/                       # TypeScript Type Definitions
│   │   ├── dashboard.ts
│   │   ├── api.ts
│   │   └── user.ts
│   │
│   ├── package.json                 # Dependências
│   ├── next.config.js               # Configuração Next.js
│   ├── tsconfig.json                # TypeScript Config (Strict)
│   ├── .env.example                 # Variáveis de ambiente
│   └── README.md                    # Documentação do projeto
│
├── docs/                            # Documentação
│   ├── ARCHITECTURE.md              # Este arquivo
│   ├── COMPONENTS.md                # Catálogo de componentes
│   ├── API.md                       # Documentação de APIs
│   └── DEPLOYMENT.md                # Guia de deployment
│
├── scripts/                         # Scripts de automação
│   ├── deploy.sh                    # Deploy automatizado
│   ├── setup.sh                     # Setup inicial
│   └── backup.sh                    # Backup de dados
│
├── __tests__/                       # Testes
│   ├── components/                  # Testes de componentes
│   ├── hooks/                       # Testes de hooks
│   └── services/                    # Testes de services
│
├── public/                          # Arquivos estáticos
│   ├── images/                      # Imagens do projeto
│   ├── fonts/                       # Fontes customizadas
│   └── favicon.ico                  # Favicon
│
├── .github/                         # Configurações GitHub
│   └── workflows/                   # GitHub Actions CI/CD
│
├── START_DEPLOYMENT.sh              # Deploy rápido
├── deploy-react-export.sh           # Script principal
├── manage-remote-dashboard.sh       # Gerenciador remoto
├── Dockerfile                       # Containerização
├── docker-compose.yml               # Orquestração
├── .eslintrc.json                   # ESLint config
├── .prettierrc                      # Prettier config
├── jest.config.js                   # Jest config
├── CONTRIBUTING.md                  # Guia de contribuição
├── CHANGELOG.md                     # Histórico de versões
└── README.md                        # README principal
```

## 🎨 Design System

### Golden Ratio Implementation
- **Proporção Áurea**: Φ ≈ 1.618
- **Aplicação**: Espaçamentos, tamanhos de fonte, dimensões de componentes
- **Breakpoints Fibonacci**: 610px, 987px, 1597px, 2584px

### Bento Grid Layout
- Cards adaptáveis
- Grid responsivo (5→8→13→21 colunas)
- Transições suaves
- Dark mode integrado

## 🔄 Fluxo de Dados

```
Usuario Login
    ↓
API Authentication
    ↓
Dashboard Selection
    ↓
Load Data from Services
    ↓
Render Components with Custom Hooks
    ↓
Display Charts (Recharts)
    ↓
Chat Assistant (Real-time)
```

## 🌐 Páginas e Componentes

### Páginas

| Página | Rota | Descrição |
|--------|------|-----------|
| Login | `/dashboard/login` | Autenticação de usuários |
| Executive | `/dashboard/executive` | Dashboard principal para executivos |
| Operational v2 | `/dashboard/operational-v2` | Métricas operacionais em tempo real |
| Predictive v2 | `/dashboard/predictive-v2` | Análises preditivas com ML |
| Dashboard Oficial | `/dashboard/dashboard-oficial` | Legacy (compatibilidade) |
| Bento Grid v2 | `/dashboard/bento-grid-v2` | Nova versão com Golden Ratio |

### Componentes Principais

1. **NavigationMenu** (NOVO)
   - 3 variantes: Sidebar, Header, Drawer
   - Responsivo
   - Dark mode

2. **ChatAssistant**
   - IA integrada
   - Real-time responses
   - Design moderno

3. **ChartBlock**
   - Wrapper para Recharts
   - Responsivo
   - Loading states

4. **DashboardHeader**
   - Título e breadcrumbs
   - Ações rápidas
   - Perfil de usuário

5. **DashboardMetricCard**
   - KPI display
   - Trending indicators
   - Click-through actions

6. **HiddenBlocksBar**
   - Toggle visibility
   - Salvar preferências
   - Customização

## ⚙️ Configuração

### Environment Variables (.env.production)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_CLICKHOUSE_API=http://10.253.100.16:8123
NEXT_PUBLIC_N8N_WEBHOOK=http://10.253.100.16:5678/webhook
NEXT_PUBLIC_CHAT_API=http://10.253.100.16:3001
NEXT_PUBLIC_APP_NAME=Corelytics AI Monitoring
```

### TypeScript Strict Mode
- Todos os tipos definidos
- No implicit any
- Strict null checks
- Strict binding checks

## 🔌 API Services

Todos os services seguem o mesmo padrão:

```typescript
// Base pattern
class DashboardService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  async getMetrics() { ... }
  async getChartData() { ... }
  async createAlert() { ... }
}
```

Services Disponíveis:
- `api.service.ts` - Base HTTP client
- `executive-dashboard.service.ts`
- `operational-dashboard.service.ts`
- `predictive-dashboard.service.ts`
- `dashboards-api.service.ts`

## 🎯 Custom Hooks

### useGoldenGridLayout
Implementa grid responsivo com Golden Ratio

```typescript
const { columns, spacing, fontSize } = useGoldenGridLayout();
```

### useGoldenBreakpoint
Breakpoints baseados em Fibonacci

```typescript
const breakpoint = useGoldenBreakpoint(); // 'mobile' | 'tablet' | 'desktop' | 'wide'
```

### useBentoGridLayout
Layout moderno de cards

```typescript
const { layout, reorder } = useBentoGridLayout(initialLayout);
```

### useChartBlocks
Controle de visibilidade de blocos

```typescript
const { visible, toggle, reset } = useChartBlocks(defaultBlocks);
```

## 🔐 Segurança

- HTTPS apenas em produção
- Validação de entrada em todos os formulários
- Sanitização de dados
- Rate limiting na API
- CORS configurado

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "next": "14.2.33",
    "react": "18.2.0",
    "typescript": "^5.0.0",
    "recharts": "^2.8.0",
    "lucide-react": "^0.263.0"
  }
}
```

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Porta 3000
```

### Production Build
```bash
npm run build
npm start
```

### Docker
```bash
docker-compose up -d
```

### PM2
```bash
pm2 start npm --name dashboard -- start
pm2 save
pm2 startup
```

## 🧪 Testing

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress
- **E2E Tests**: Playwright
- **Performance**: Lighthouse

## 📊 Performance

- Next.js Image Optimization
- Code Splitting
- CSS-in-JS (CSS Modules)
- Lazy Loading Components
- Caching Strategies

## 🔍 Monitoring

- Error tracking (Sentry)
- Performance monitoring (New Relic)
- User analytics (Google Analytics)
- Custom dashboards (Grafana)

## 📝 Versionamento

Segue Semantic Versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

Ver `CHANGELOG.md` para histórico completo.

## 🤝 Contribuindo

Veja `CONTRIBUTING.md` para guidelines de contribuição.

## 📄 Licença

Todos os direitos reservados.

---

**Última atualização**: Nov 17, 2025
**Versão**: 1.0.0
