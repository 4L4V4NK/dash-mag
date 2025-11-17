# 🎯 React Dashboards Export Package

**Dashboard Composition Ready for Migration**

Pacote exportável contendo todas as páginas React, componentes e hooks necessários para integrar os dashboards ao projeto original com ClickHouse e serviços.

---

## 📦 O que está incluído

```
EXPORT_REACT_DASHBOARDS/
├── 📄 README.md (este arquivo)
├── 📄 INTEGRATION_GUIDE.md (instruções detalhadas)
│
├── 📁 Pages (Páginas React)
│   ├── login/
│   │   ├── page.tsx
│   │   └── Login.module.css
│   ├── dashboard-oficial/
│   │   ├── page.tsx (Original Bento Grid)
│   │   └── Dashboard.module.css
│   ├── bento-grid-v2/
│   │   ├── page.tsx (Novo com Bento Grid + Golden Ratio)
│   │   └── BentoGridV2.module.css
│   ├── operational-v2/
│   │   ├── page.tsx
│   │   └── OperationalV2.module.css
│   └── predictive-v2/
│       ├── page.tsx
│       └── PredictiveV2.module.css
│
├── 🧩 Components/
│   ├── NavigationMenu.tsx (Novo!)
│   ├── NavigationMenu.module.css (Novo!)
│   ├── ChatAssistant.tsx
│   ├── ChatAssistant.module.css
│   ├── DashboardHeader.tsx
│   ├── DashboardMetricCard.tsx
│   ├── ChartBlock.tsx
│   └── ... (outros componentes)
│
├── 🪝 Hooks/
│   ├── useChartBlocks.ts
│   ├── useGoldenBreakpoint.ts
│   ├── useGoldenGridLayout.ts
│   ├── useBentoGridLayout.ts
│   └── ... (outros hooks)
│
├── 🎨 Styles/
│   ├── corelytics-theme.ts
│   ├── global.css
│   └── ... (temas e estilos globais)
│
├── 🔌 Services/
│   ├── executive-dashboard.service.ts
│   ├── api-client.ts
│   └── ... (adapte para seu ambiente)
│
└── 📝 Types/
    ├── dashboard.types.ts
    └── ... (tipos TypeScript)
```

---

## 🚀 Guia Rápido de Integração

### 1. **Copiar arquivos para seu projeto**

```bash
# Assumindo que seu projeto está em /seu-projeto

# Copiar páginas
cp -r pages/* /seu-projeto/src/app/

# Copiar componentes
cp -r components/* /seu-projeto/src/components/

# Copiar hooks
cp -r hooks/* /seu-projeto/src/hooks/

# Copiar estilos
cp -r styles/* /seu-projeto/src/styles/

# Copiar services (REVISE E ADAPTE!)
cp -r services/* /seu-projeto/src/services/
```

### 2. **URLs Mapeadas no Projeto Original**

Configure suas rotas para:

```
/dashboard/login             → login/page.tsx
/dashboard/executive         → bento-grid-v2/page.tsx
/dashboard/operational-v2    → operational-v2/page.tsx
/dashboard/predictive-v2     → predictive-v2/page.tsx
/dashboard/dashboard-oficial → dashboard-oficial/page.tsx (legacy)
```

### 3. **Adicione o Menu de Navegação**

No layout principal do seu projeto, importe o `NavigationMenu`:

```tsx
// seu-projeto/src/app/layout.tsx
import { NavigationMenu } from '@/components/NavigationMenu';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NavigationMenu variant="sidebar" />
        <main style={{ marginLeft: '80px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
```

### 4. **Adapte os Services**

Os services estão prontos para chamar APIs, mas ajuste:

```typescript
// services/executive-dashboard.service.ts
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:13001/api';

// Adapte para seu endpoint ClickHouse/API
export const executiveDashboardService = {
  async getExecutiveDashboard() {
    const response = await fetch(
      `${API_BASE}/dashboard/executive-dashboard`
    );
    return response.json();
  },
};
```

---

## 📋 Funcionalidades Incluídas

### ✅ Navegação
- Sidebar colapsável com 3 variantes (sidebar, header, drawer)
- Menu ativo dinâmico baseado na URL atual
- Botão de logout integrado
- Responsivo para mobile

### ✅ Componentes
- **ChatAssistant** - AI Chat integrado em todas as páginas
- **DashboardHeader** - Header com informações gerais
- **DashboardMetricCard** - Cards para KPIs
- **ChartBlock** - Container para gráficos
- **HiddenBlocksBar** - Mostrar/esconder blocos

### ✅ Hooks (Golden Ratio & Bento Grid)
- `useGoldenBreakpoint` - Breakpoints Fibonacci (610px, 987px, 1597px)
- `useGoldenGridLayout` - Grid com proporção áurea
- `useBentoGridLayout` - Layout compacto modular
- `useChartBlocks` - Gerenciar visibilidade de blocos

### ✅ Dashboards

| Dashboard | URL | Descrição |
|-----------|-----|-----------|
| **Executive** | `/dashboard/executive` | Bento Grid v2 com Golden Ratio |
| **Operational v2** | `/dashboard/operational-v2` | Métricas operacionais |
| **Predictive v2** | `/dashboard/predictive-v2` | Previsões ML |
| **Legacy** | `/dashboard/dashboard-oficial` | Original (compatibilidade) |
| **Login** | `/dashboard/login` | Autenticação |

---

## 🔧 Personalização

### Menu de Navegação
Edite `components/NavigationMenu.tsx`:

```typescript
const NAV_ITEMS: NavItem[] = [
  {
    label: 'Seu Dashboard',
    href: '/dashboard/seu-dashboard',
    icon: <YourIcon size={20} />,
    description: 'Descrição',
  },
  // ...
];
```

### Variantes de Menu
```tsx
// Sidebar (padrão)
<NavigationMenu variant="sidebar" />

// Header (topo)
<NavigationMenu variant="header" />

// Drawer (mobile)
<NavigationMenu variant="drawer" />
```

### Cores e Tema
- **Cor primária**: `#0a4d8c` (azul escuro)
- **Background**: `#0a0e1a` a `#1a1d29` (gradiente)
- **Acentos**: `rgba(10, 77, 140, ...)`
- Edite `styles/corelytics-theme.ts` para customizar

---

## ⚙️ Dependências Necessárias

### NPM Packages Obrigatórios
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "next": "^14.0.0",
    "recharts": "^2.8.0",
    "lucide-react": "^0.263.0"
  }
}
```

### Instruções de Instalação
```bash
cd seu-projeto
npm install recharts lucide-react
```

---

## 🔌 Integração com ClickHouse

### Conectar à API
```typescript
// services/api-client.ts
const API_URL = process.env.REACT_APP_API_BASE || 'http://seu-host:13001/api';

export async function fetchDashboardData(endpoint: string) {
  try {
    const response = await fetch(`${API_URL}/dashboard/${endpoint}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}
```

### Variáveis de Ambiente
```bash
# .env.local
REACT_APP_API_BASE=http://10.253.100.15:13001/api
REACT_APP_CLICKHOUSE_API=http://clickhouse:8123
```

---

## 📱 Responsividade

Todos os dashboards incluem:
- ✅ Mobile-first design
- ✅ Breakpoints Fibonacci (610px, 987px, 1597px, 2584px)
- ✅ Grid responsivo (5→8→13→21 colunas)
- ✅ Menu colapsável em mobile
- ✅ Touch-friendly interface

---

## 🎨 Bento Grid + Golden Ratio

### O que está implementado

1. **Grid Fibonacci**
   - Colunas: 5 → 8 → 13 → 21 (mobile → desktop)
   - Espaçamento: 13 → 21 → 34 → 55px

2. **Proporção Áurea (φ ≈ 1.618)**
   - Alturas: 89, 144, 233, 377, 610px
   - Ratios: 61.8% para pontos de entrada visuais

3. **Componentes Compactos**
   - Cards agrupados (2x2 grids)
   - Elevação e sombras proporcionais
   - Transições suaves (timing Fibonacci)

---

## 🐛 Troubleshooting

### Imports falhando
- Verifique que `@/` está configurado em `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Estilos não aplicados
- Certifique-se que CSS Modules está habilitado
- Verifique caminhos dos imports (case-sensitive em Linux)
- Clear Next.js cache: `rm -rf .next && npm run build`

### API não conecta
- Verifique `REACT_APP_API_BASE` no `.env.local`
- Confirme que backend está rodando
- Check CORS headers se cross-origin

---

## 📚 Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| `components/NavigationMenu.tsx` | Menu principal (NOVO) |
| `components/ChatAssistant.tsx` | Chat IA integrado |
| `hooks/useGoldenGridLayout.ts` | Cálculos de proporção áurea |
| `services/executive-dashboard.service.ts` | API calls |
| `styles/corelytics-theme.ts` | Sistema de cores/tema |

---

## 🔗 URLs Finais

Após integração, acesse:

```
http://seu-servidor/dashboard/login
http://seu-servidor/dashboard/executive
http://seu-servidor/dashboard/operational-v2
http://seu-servidor/dashboard/predictive-v2
http://seu-servidor/dashboard/dashboard-oficial
```

---

## ✨ Próximos Passos

1. ✅ Copiar pasta `EXPORT_REACT_DASHBOARDS` para seu projeto
2. ✅ Revisar `INTEGRATION_GUIDE.md` (guia detalhado)
3. ✅ Executar `npm install` das dependências
4. ✅ Adaptar services para sua API
5. ✅ Testar cada dashboard
6. ✅ Customizar cores/tema conforme necessário
7. ✅ Deploy em produção

---

## 📞 Support

- **Dashboard URLs**: `/dashboard/*` (legacy compatibility)
- **New Entry**: `/dashboard/executive` (Bento Grid v2)
- **Menu**: Integrado em todas as páginas
- **Chat**: Disponível em todos os dashboards

---

**Versão**: 1.0.0  
**Data**: 2025-11-17  
**Status**: ✅ Production Ready
