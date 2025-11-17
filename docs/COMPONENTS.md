# 🧩 Catálogo de Componentes

## Visão Geral

Todos os componentes são reutilizáveis, tipados com TypeScript e possuem CSS Modules para scoping local.

---

## 📋 Tabela de Componentes

| Componente | Tipo | Props | Status |
|-----------|------|-------|--------|
| NavigationMenu | Layout | variant, items, onLogout | ✅ Novo |
| ChatAssistant | Feature | onMessage, isOpen | ✅ Completo |
| ChartBlock | Display | data, title, type | ✅ Completo |
| DashboardHeader | Layout | title, subtitle, actions | ✅ Completo |
| DashboardMetricCard | Display | label, value, trend | ✅ Completo |
| HiddenBlocksBar | Control | blocks, onToggle | ✅ Completo |
| ClientLayout | Layout | children | ✅ Completo |
| Navigation | Navigation | items, active | ✅ Completo |
| ChartConfig | Control | chartType, options | ✅ Completo |

---

## 🎨 Componentes Detalhados

### 1. NavigationMenu ⭐ (NOVO)

**Propósito**: Menu de navegação principal com 3 variantes responsivas

**Variantes**:
- `sidebar`: Barra lateral fixa/colapsa
- `header`: Barra superior horizontal
- `drawer`: Drawer mobile (slide-out)

**Props**:
```typescript
interface NavigationMenuProps {
  variant: 'sidebar' | 'header' | 'drawer';
  items: NavItem[];
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}
```

**Uso**:
```tsx
<NavigationMenu 
  variant="sidebar" 
  items={navigationItems}
  onLogout={handleLogout}
/>
```

**Arquivo**: `components/NavigationMenu.tsx`
**CSS Module**: `components/NavigationMenu.module.css`
**Linhas**: 210 linhas

---

### 2. ChatAssistant

**Propósito**: Chat com IA para assistência em tempo real

**Recursos**:
- Conversa bidirecional
- Auto-scroll para mensagens novas
- Indicador de digitação
- Histórico persistente

**Props**:
```typescript
interface ChatAssistantProps {
  onMessage: (message: string) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}
```

**Uso**:
```tsx
<ChatAssistant
  onMessage={sendMessage}
  isOpen={isChatOpen}
  onClose={() => setIsChatOpen(false)}
/>
```

**Arquivo**: `components/ChatAssistant.tsx`
**CSS Module**: `components/ChatAssistant.module.css`

---

### 3. ChartBlock

**Propósito**: Wrapper reutilizável para gráficos Recharts

**Suporta**:
- LineChart, BarChart, PieChart, AreaChart
- Responsivo
- Loading states
- Fallback data

**Props**:
```typescript
interface ChartBlockProps {
  data: any[];
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area';
  config?: ChartConfig;
  loading?: boolean;
}
```

**Uso**:
```tsx
<ChartBlock
  data={chartData}
  title="Revenue Over Time"
  type="line"
  loading={isLoading}
/>
```

**Arquivo**: `components/ChartBlock.tsx`
**CSS Module**: `components/ChartBlock.module.css`

---

### 4. DashboardHeader

**Propósito**: Cabeçalho padrão de todas as páginas

**Inclui**:
- Título e subtítulo
- Breadcrumbs
- Ações rápidas (botões)
- Perfil de usuário

**Props**:
```typescript
interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: HeaderAction[];
}
```

**Uso**:
```tsx
<DashboardHeader
  title="Executive Dashboard"
  subtitle="Real-time business metrics"
  actions={[{ label: 'Export', onClick: handleExport }]}
/>
```

**Arquivo**: `components/DashboardHeader.tsx`
**CSS Module**: `components/DashboardHeader.module.css`

---

### 5. DashboardMetricCard

**Propósito**: Cartão para exibição de KPIs

**Recursos**:
- Valor principal + comparação anterior
- Trending up/down indicator
- Click-through actions
- Dark mode

**Props**:
```typescript
interface DashboardMetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  onClick?: () => void;
}
```

**Uso**:
```tsx
<DashboardMetricCard
  label="Total Revenue"
  value={1250000}
  unit="USD"
  trend={12.5}
  trendLabel="vs last month"
/>
```

**Arquivo**: `components/DashboardMetricCard.tsx`

---

### 6. HiddenBlocksBar

**Propósito**: Barra de controle para show/hide blocos

**Recursos**:
- Toggle individual de blocos
- Reset para padrão
- Salvar preferências (localStorage)
- Compact view

**Props**:
```typescript
interface HiddenBlocksBarProps {
  blocks: BlockDefinition[];
  onToggle: (blockId: string, visible: boolean) => void;
  onReset: () => void;
}
```

**Arquivo**: `components/HiddenBlocksBar.tsx`
**CSS Module**: `components/HiddenBlocksBar.module.css`

---

### 7. ClientLayout

**Propósito**: Layout wrapper com contextos e providers

**Responsabilidades**:
- AuthContext
- ThemeProvider
- GlobalStyles
- Error Boundary

**Props**:
```typescript
interface ClientLayoutProps {
  children: React.ReactNode;
}
```

**Uso**:
```tsx
<ClientLayout>
  {children}
</ClientLayout>
```

**Arquivo**: `components/ClientLayout.tsx`

---

### 8. Navigation

**Propósito**: Componente base de navegação

**Props**:
```typescript
interface NavigationProps {
  items: NavItem[];
  active: string;
  onNavigate: (path: string) => void;
}
```

**Arquivo**: `components/Navigation.tsx`

---

### 9. ChartConfig

**Propósito**: Painel de configuração para gráficos

**Controles**:
- Tipo de gráfico
- Período de tempo
- Filtros
- Exportar dados

**Arquivo**: `components/ChartConfig.tsx`

---

## 🎨 Styling Conventions

Todos os componentes seguem estas regras:

1. **CSS Modules**: Um arquivo `.module.css` por componente
2. **Naming**: Classes em camelCase
3. **Dark Mode**: Suporta ambos os temas
4. **Responsive**: Mobile-first approach
5. **Accessibility**: ARIA labels onde apropriado

### Exemplo de CSS Module

```css
/* components/ChartBlock.module.css */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.chart {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.chart.dark {
  background: var(--bg-dark-secondary);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}
```

---

## 📝 Padrão de Componente

Todos os componentes seguem este padrão:

```typescript
'use client';

import React, { FC } from 'react';
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  // Props aqui
}

const ComponentName: FC<ComponentNameProps> = ({ 
  // destructured props
}) => {
  return (
    <div className={styles.container}>
      {/* JSX aqui */}
    </div>
  );
};

export default ComponentName;
```

---

## 🔗 Dependências de Componentes

```
NavigationMenu
  └── Uses: Lucide icons, CSS Modules

ChatAssistant
  └── Uses: Services, TypeScript

ChartBlock
  └── Uses: Recharts, CSS Modules

DashboardHeader
  └── Uses: CSS Modules

DashboardMetricCard
  └── Uses: CSS Modules

HiddenBlocksBar
  └── Uses: CSS Modules, localStorage

ClientLayout
  └── Uses: Contexts, Providers

Navigation
  └── Uses: Next.js Router

ChartConfig
  └── Uses: CSS Modules, Select inputs
```

---

## ✨ Componentes Próximos

- [ ] DataTable (com sorting, paginação)
- [ ] Export Button (CSV, PDF, Excel)
- [ ] DateRange Picker
- [ ] Custom Select
- [ ] Alert Component
- [ ] Modal/Dialog
- [ ] Toast Notifications

---

**Última atualização**: Nov 17, 2025
**Compatibilidade**: React 18+, Next.js 14+
