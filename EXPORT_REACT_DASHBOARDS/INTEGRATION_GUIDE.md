# 📖 Guia Detalhado de Integração

**Como integrar os dashboards React ao seu projeto original**

---

## 📋 Pré-requisitos

- Node.js 16+
- Next.js 14+ ou React 18+
- TypeScript habilitado
- CSS Modules configurado
- API backend rodando (ClickHouse + Node.js)

---

## 🔧 Passo a Passo

### 1. Preparar o Projeto

```bash
# Copiar toda a pasta para seu projeto
cp -r EXPORT_REACT_DASHBOARDS /seu-projeto/

# Entrar no diretório
cd /seu-projeto/

# Instalar dependências
npm install recharts lucide-react
```

### 2. Estrutura de Diretórios

Seu projeto deve ter essa estrutura:

```
seu-projeto/
├── src/
│   ├── app/
│   │   ├── dashboard/          ← Rotas de dashboard
│   │   │   ├── login/
│   │   │   ├── executive/
│   │   │   ├── operational-v2/
│   │   │   ├── predictive-v2/
│   │   │   └── dashboard-oficial/
│   │   └── layout.tsx          ← Layout principal
│   │
│   ├── components/             ← Componentes reutilizáveis
│   │   ├── NavigationMenu.tsx  (NOVO)
│   │   ├── ChatAssistant.tsx
│   │   └── ...
│   │
│   ├── hooks/                  ← Custom hooks
│   │   ├── useGoldenGridLayout.ts
│   │   └── ...
│   │
│   ├── services/               ← API calls
│   │   ├── executive-dashboard.service.ts
│   │   └── api-client.ts
│   │
│   └── styles/                 ← Estilos globais
│       └── corelytics-theme.ts
│
├── tsconfig.json               ← Alias @/ configurado
├── next.config.js              ← Configuração Next.js
└── .env.local                  ← Variáveis de ambiente
```

### 3. Configurar TypeScript

Verifique `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 4. Configurar Next.js

`next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    missingSuspenseWithCSRBailout: true,
  },
};

module.exports = nextConfig;
```

### 5. Variáveis de Ambiente

Crie `.env.local`:

```bash
# API Endpoints
REACT_APP_API_BASE=http://seu-servidor:13001/api
REACT_APP_CLICKHOUSE_HOST=seu-clickhouse-host
REACT_APP_CLICKHOUSE_PORT=8123

# Chat Assistant (se usar)
REACT_APP_N8N_WEBHOOK=http://seu-servidor:15678/webhook/chat-ia

# Environment
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://seu-servidor:13001/api
```

### 6. Integrar Menu de Navegação

No seu layout principal (`src/app/layout.tsx`):

```tsx
'use client';

import React from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import '@/styles/global.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <head>
        <title>AI Monitoring Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {/* Sidebar Navigation */}
        <NavigationMenu variant="sidebar" />

        {/* Main Content */}
        <main style={{
          marginLeft: '80px',
          minHeight: '100vh',
          transition: 'margin-left 300ms ease',
        }}>
          {children}
        </main>

        {/* Mobile Navigation (optional) */}
        <div style={{ display: 'none', '@media (max-width: 768px)': { display: 'block' } }}>
          <NavigationMenu variant="header" />
        </div>
      </body>
    </html>
  );
}
```

### 7. Adaptar Services para sua API

`src/services/executive-dashboard.service.ts`:

```typescript
/**
 * Executive Dashboard Service
 * Adapte para seu endpoint ClickHouse/API
 */

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:13001/api';

export interface ExecutiveDashboardData {
  eventsProcessed: number;
  incidentsSeverity: Array<{ severity: string; count: number }>;
  mlPredictions: number;
  topHosts: Array<{ host: string; activity: number }>;
  // ... adicione campos conforme sua API
}

export const executiveDashboardService = {
  /**
   * Fetch executive dashboard data
   * Conecta à sua API do ClickHouse
   */
  async getExecutiveDashboard(): Promise<ExecutiveDashboardData | null> {
    try {
      const response = await fetch(
        `${API_BASE}/dashboard/executive-dashboard`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Se usar auth
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching executive dashboard:', error);
      // Retornar dados fallback
      return {
        eventsProcessed: 0,
        incidentsSeverity: [],
        mlPredictions: 0,
        topHosts: [],
      };
    }
  },

  /**
   * Fetch operational v2 data
   */
  async getOperationalV2() {
    const response = await fetch(`${API_BASE}/dashboard/operational-v2`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },

  /**
   * Fetch predictive v2 data
   */
  async getPredictiveV2() {
    const response = await fetch(`${API_BASE}/dashboard/predictive-v2`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },
};
```

### 8. Configurar Autenticação (se necessário)

`src/app/dashboard/login/page.tsx` já está incluído. Adapte a chamada de API:

```typescript
// No login handler
const handleLogin = async (username: string, password: string) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }
    );

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('token', token);
      window.location.href = '/dashboard/executive';
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 9. Testar Localmente

```bash
# Build
npm run build

# Dev server
npm run dev

# Abrir navegador
# http://localhost:3000/dashboard/login
```

### 10. Deploy em Produção

```bash
# Build otimizado
npm run build

# Verificar build
npm run start

# Ou usar Docker
docker build -t seu-dashboard .
docker run -p 3000:3000 seu-dashboard
```

---

## 🎨 Customização

### 1. Mudar Cores do Tema

Edite `src/styles/corelytics-theme.ts`:

```typescript
export const corelyticsTheme = {
  colors: {
    primary: '#0a4d8c',      // Azul escuro
    secondary: '#1a1d29',    // Cinza escuro
    accent: '#0a4d8c',       // Destaque
    success: '#4ade80',      // Verde
    warning: '#f59e0b',      // Laranja
    error: '#ef4444',        // Vermelho
    background: '#0a0e1a',   // Fundo escuro
    surface: '#1a1d29',      // Superfície
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.4)',
    },
  },
};
```

### 2. Customizar Menu

Edite `src/components/NavigationMenu.tsx` para adicionar seus items:

```typescript
const NAV_ITEMS: NavItem[] = [
  {
    label: 'Seu Dashboard',
    href: '/dashboard/seu-dashboard',
    icon: <YourCustomIcon size={20} />,
    description: 'Descrição',
  },
  // ...adicione mais
];
```

### 3. Adaptar Layout dos Dashboards

Cada página está em sua pasta. Exemplo: `dashboard-oficial/page.tsx`

```typescript
// Edite o componente para adicionar seus gráficos/dados
export default function DashboardOficial() {
  // Seu código aqui
}
```

---

## 🔌 Integração com ClickHouse

### Exemplo: Consultar dados direto

```typescript
// src/services/clickhouse.service.ts
export async function queryClickHouse(sql: string) {
  const response = await fetch(
    `http://seu-clickhouse:8123/?query=${encodeURIComponent(sql)}`,
    {
      method: 'POST',
      body: sql,
    }
  );
  return response.json();
}

// Usar em um dashboard
useEffect(() => {
  queryClickHouse(`
    SELECT 
      event_type,
      COUNT(*) as count
    FROM events
    WHERE date >= today() - 7
    GROUP BY event_type
  `).then(setChartData);
}, []);
```

---

## 📱 Responsividade

Todos os componentes já incluem media queries. Se precisar adicionar breakpoints:

```typescript
// useGoldenBreakpoint.ts já incluído
const breakpoint = useGoldenBreakpoint();

// Returns:
// - 'mobile' (≤ 609px)
// - 'tablet' (610-986px)
// - 'desktop' (987-1596px)
// - 'ultrawide' (≥ 1597px)
```

---

## 🐛 Troubleshooting Comum

| Problema | Solução |
|----------|---------|
| `@/ imports failing` | Check `tsconfig.json` paths |
| `CSS not applying` | Verify CSS Modules enabled |
| `API 404` | Check `REACT_APP_API_BASE` env var |
| `"React not defined"` | Add `'use client'` no topo |
| `Port already in use` | `npm run dev -- -p 3001` |

---

## 📊 Estrutura das URLs

```
Seu Servidor:
├── /dashboard/login             → page: login/page.tsx
├── /dashboard/executive         → page: bento-grid-v2/page.tsx
├── /dashboard/operational-v2    → page: operational-v2/page.tsx
├── /dashboard/predictive-v2     → page: predictive-v2/page.tsx
└── /dashboard/dashboard-oficial → page: dashboard-oficial/page.tsx
```

---

## ✅ Checklist de Integração

- [ ] Copiar pasta EXPORT_REACT_DASHBOARDS
- [ ] Instalar dependências (recharts, lucide-react)
- [ ] Configurar tsconfig.json (paths)
- [ ] Configurar next.config.js
- [ ] Adicionar .env.local com endpoints
- [ ] Integrar NavigationMenu no layout
- [ ] Adaptar services para sua API
- [ ] Testar cada dashboard
- [ ] Customizar cores/tema
- [ ] Build e deploy

---

## 🚀 Próximas Etapas

1. Integrar com seu ClickHouse
2. Configurar autenticação
3. Adicionar seus gráficos personalizados
4. Deploy em produção
5. Coletar feedback de usuários

---

**Última atualização**: 2025-11-17  
**Versão**: 1.0.0
