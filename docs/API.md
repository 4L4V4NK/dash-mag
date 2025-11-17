# 🔌 Guia de API

## Visão Geral

Este projeto usa serviços centralizados para todas as chamadas de API. Todos os serviços são agnósticos à origem de dados e podem ser facilmente adaptados para diferentes backends.

---

## 📡 Arquitetura de Serviços

```
services/
  ├── api.ts                 # Cliente HTTP base
  ├── authService.ts         # Autenticação
  ├── dashboardService.ts    # Dados de dashboard
  ├── metricsService.ts      # KPIs e métricas
  ├── chartService.ts        # Dados de gráficos
  └── aiService.ts           # Integração com IA
```

---

## 🌐 Cliente HTTP Base (`api.ts`)

**Responsabilidade**: Gerenciar requisições HTTP com retry, timeout e error handling

```typescript
// services/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const DEFAULT_TIMEOUT = 30000; // 30 segundos
const MAX_RETRIES = 3;

interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

export async function apiCall<T>(config: RequestConfig): Promise<T> {
  // Implementação com retry logic
}
```

**Recursos**:
- ✅ Retry automático (com exponential backoff)
- ✅ Timeout configurável
- ✅ Error normalization
- ✅ Request/Response logging
- ✅ Token authentication

---

## 🔐 Serviço de Autenticação

```typescript
// services/authService.ts

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'user' | 'viewer';
  };
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiCall({
      method: 'POST',
      url: '/auth/login',
      data: credentials
    });
  }

  async logout(): Promise<void> {
    return apiCall({
      method: 'POST',
      url: '/auth/logout'
    });
  }

  async getProfile(): Promise<User> {
    return apiCall({
      method: 'GET',
      url: '/auth/profile'
    });
  }

  async refreshToken(): Promise<{ token: string }> {
    return apiCall({
      method: 'POST',
      url: '/auth/refresh'
    });
  }
}

export const authService = new AuthService();
```

**Endpoints**:
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/profile` - Perfil atual
- `POST /auth/refresh` - Refresh token
- `PUT /auth/profile` - Atualizar perfil

---

## 📊 Serviço de Dashboard

```typescript
// services/dashboardService.ts

interface DashboardConfig {
  layout: 'default' | 'compact' | 'detailed';
  theme: 'light' | 'dark';
  refreshInterval: number; // milliseconds
}

interface DashboardData {
  title: string;
  description: string;
  metrics: Metric[];
  charts: ChartData[];
  updated: string; // ISO timestamp
}

class DashboardService {
  async getDashboard(pageId: string): Promise<DashboardData> {
    return apiCall({
      method: 'GET',
      url: `/dashboards/${pageId}`
    });
  }

  async getDashboardConfig(): Promise<DashboardConfig> {
    return apiCall({
      method: 'GET',
      url: `/dashboards/config`
    });
  }

  async updateDashboardConfig(config: Partial<DashboardConfig>): Promise<DashboardConfig> {
    return apiCall({
      method: 'PUT',
      url: `/dashboards/config`,
      data: config
    });
  }

  async saveDashboardLayout(layout: any): Promise<{ success: boolean }> {
    return apiCall({
      method: 'POST',
      url: `/dashboards/layout`,
      data: layout
    });
  }
}

export const dashboardService = new DashboardService();
```

**Endpoints**:
- `GET /dashboards/{pageId}` - Dados do dashboard
- `GET /dashboards/config` - Configuração
- `PUT /dashboards/config` - Atualizar config
- `POST /dashboards/layout` - Salvar layout

---

## 📈 Serviço de Métricas

```typescript
// services/metricsService.ts

interface MetricFilter {
  timeRange: 'today' | '7days' | '30days' | '90days' | 'custom';
  startDate?: string;
  endDate?: string;
}

interface Metric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend?: number; // percentual
  threshold?: number;
}

class MetricsService {
  async getMetrics(filters: MetricFilter): Promise<Metric[]> {
    return apiCall({
      method: 'GET',
      url: '/metrics',
      data: filters
    });
  }

  async getMetricHistory(metricId: string, filters: MetricFilter): Promise<any[]> {
    return apiCall({
      method: 'GET',
      url: `/metrics/${metricId}/history`,
      data: filters
    });
  }

  async getMetricAlert(metricId: string): Promise<MetricAlert> {
    return apiCall({
      method: 'GET',
      url: `/metrics/${metricId}/alert`
    });
  }

  async updateMetricAlert(metricId: string, alert: MetricAlert): Promise<MetricAlert> {
    return apiCall({
      method: 'PUT',
      url: `/metrics/${metricId}/alert`,
      data: alert
    });
  }
}

export const metricsService = new MetricsService();
```

**Endpoints**:
- `GET /metrics?timeRange=30days` - Listar métricas
- `GET /metrics/{id}/history` - Histórico de métrica
- `GET /metrics/{id}/alert` - Alertas
- `PUT /metrics/{id}/alert` - Configurar alerta

---

## 📊 Serviço de Gráficos

```typescript
// services/chartService.ts

interface ChartFilter {
  type: 'line' | 'bar' | 'pie' | 'area';
  timeRange: string;
  groupBy?: 'day' | 'week' | 'month';
}

interface ChartPoint {
  timestamp: string;
  value: number;
  label?: string;
}

class ChartService {
  async getChartData(chartId: string, filters: ChartFilter): Promise<ChartPoint[]> {
    return apiCall({
      method: 'GET',
      url: `/charts/${chartId}`,
      data: filters
    });
  }

  async exportChartData(chartId: string, format: 'csv' | 'json' | 'excel'): Promise<Blob> {
    const response = await fetch(
      `${API_BASE}/charts/${chartId}/export?format=${format}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      }
    );
    return response.blob();
  }

  async getChartConfig(chartId: string): Promise<any> {
    return apiCall({
      method: 'GET',
      url: `/charts/${chartId}/config`
    });
  }

  async updateChartConfig(chartId: string, config: any): Promise<any> {
    return apiCall({
      method: 'PUT',
      url: `/charts/${chartId}/config`,
      data: config
    });
  }
}

export const chartService = new ChartService();
```

**Endpoints**:
- `GET /charts/{id}?timeRange=30days` - Dados do gráfico
- `GET /charts/{id}/export?format=csv` - Exportar dados
- `GET /charts/{id}/config` - Configuração
- `PUT /charts/{id}/config` - Atualizar config

---

## 🤖 Serviço de IA

```typescript
// services/aiService.ts

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatRequest {
  message: string;
  context?: {
    dashboard?: string;
    metric?: string;
    timeRange?: string;
  };
}

class AIService {
  async chat(request: ChatRequest): Promise<ChatMessage> {
    return apiCall({
      method: 'POST',
      url: '/ai/chat',
      data: request,
      timeout: 60000 // 60 segundos
    });
  }

  async getInsights(dashboardId: string): Promise<string[]> {
    return apiCall({
      method: 'GET',
      url: `/ai/insights/${dashboardId}`
    });
  }

  async predictTrend(metricId: string): Promise<{
    prediction: number;
    confidence: number;
    explanation: string;
  }> {
    return apiCall({
      method: 'GET',
      url: `/ai/predict/${metricId}`
    });
  }

  async chatHistory(): Promise<ChatMessage[]> {
    return apiCall({
      method: 'GET',
      url: '/ai/history'
    });
  }

  async clearChatHistory(): Promise<{ success: boolean }> {
    return apiCall({
      method: 'DELETE',
      url: '/ai/history'
    });
  }
}

export const aiService = new AIService();
```

**Endpoints**:
- `POST /ai/chat` - Enviar mensagem
- `GET /ai/insights/{dashboardId}` - Gerar insights
- `GET /ai/predict/{metricId}` - Previsão
- `GET /ai/history` - Histórico
- `DELETE /ai/history` - Limpar histórico

---

## 💾 Exemplo de Implementação ClickHouse

Para integrar com ClickHouse, adapte o `api.ts`:

```typescript
// services/api.clickhouse.ts
import axios from 'axios';

const CLICKHOUSE_URL = process.env.CLICKHOUSE_URL || 'http://localhost:8123';
const CLICKHOUSE_USER = process.env.CLICKHOUSE_USER || 'default';
const CLICKHOUSE_PASSWORD = process.env.CLICKHOUSE_PASSWORD || '';

const clickhouseClient = axios.create({
  baseURL: CLICKHOUSE_URL,
  auth: {
    username: CLICKHOUSE_USER,
    password: CLICKHOUSE_PASSWORD
  },
  timeout: 60000
});

// Wrapper para queries SQL
export async function queryClickHouse(sql: string): Promise<any[]> {
  try {
    const response = await clickhouseClient.get('/', {
      params: {
        query: sql,
        format: 'JSON'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('ClickHouse query error:', error);
    throw error;
  }
}

// Adaptador para DashboardService
class DashboardServiceClickHouse {
  async getDashboard(pageId: string): Promise<DashboardData> {
    const results = await queryClickHouse(`
      SELECT * FROM dashboards WHERE id = '${pageId}'
    `);
    return results[0];
  }

  async getMetrics(filters: MetricFilter): Promise<Metric[]> {
    const whereClause = this.buildWhereClause(filters);
    return queryClickHouse(`
      SELECT * FROM metrics WHERE ${whereClause}
    `);
  }

  private buildWhereClause(filters: MetricFilter): string {
    // Construir cláusula WHERE baseado em filtros
    return `time >= now() - INTERVAL 30 DAY`;
  }
}
```

---

## 🔄 Padrão de Uso em Componentes

```typescript
// hooks/useDashboard.ts
import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboardService';

export function useDashboard(dashboardId: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService
      .getDashboard(dashboardId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [dashboardId]);

  return { data, loading, error };
}

// Em componente
export function DashboardPage() {
  const { data, loading } = useDashboard('executive');

  if (loading) return <div>Carregando...</div>;
  
  return <div>{/* renderizar data */}</div>;
}
```

---

## 🛡️ Error Handling

```typescript
// services/errors.ts
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
  }
}

// Em apiCall()
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new APIError(
      response.status,
      response.statusText,
      await response.json()
    );
  }
} catch (error) {
  if (error instanceof APIError) {
    // Handle API error
  }
}
```

---

## 📝 Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_AI_ENDPOINT=http://localhost:8000/api
NEXT_PUBLIC_CLICKHOUSE_URL=http://localhost:8123

# Backend
API_SECRET_KEY=your-secret-key
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=password
AI_API_KEY=your-ai-api-key
```

---

**Última atualização**: Nov 17, 2025
**Versão**: 1.0.0
