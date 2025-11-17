import type {
  SystemHealth,
  EventsTimeline,
  TopHost,
  IncidentBySeverity,
  PredictionFuture,
  ModelPerformance,
  SecurityAlert,
  DashboardAllData,
} from '@/types/api';

// Always use direct backend URL - no proxy
const API_BASE_URL = 'http://10.253.100.15:13001/api';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Método auxiliar para fazer requisições
   */
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('[API Service] Fetching:', url);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Health check do backend
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; database: string }> {
    return this.fetch('/health');
  }

  /**
   * Dashboard - Saúde do Sistema
   */
  async getSystemHealth(timeRange: string = '1 HOUR'): Promise<SystemHealth> {
    return this.fetch(`/dashboard/health?timeRange=${encodeURIComponent(timeRange)}`);
  }

  /**
   * Dashboard - Timeline de Eventos
   */
  async getEventsTimeline(timeRange: string = '24 HOUR'): Promise<EventsTimeline[]> {
    return this.fetch(`/dashboard/events-timeline?timeRange=${encodeURIComponent(timeRange)}`);
  }

  /**
   * Dashboard - Incidentes por Severidade
   */
  async getIncidentsBySeverity(timeRange: string = '7 DAY'): Promise<IncidentBySeverity[]> {
    return this.fetch(`/dashboard/incidents/trends?timeRange=${encodeURIComponent(timeRange)}`);
  }

  /**
   * Dashboard - Incidentes Ativos
   */
  async getActiveIncidents(): Promise<any[]> {
    return this.fetch('/dashboard/incidents/active');
  }

  /**
   * Dashboard - Top Hosts
   */
  async getTopHosts(limit: number = 10, timeRange: string = '1 HOUR'): Promise<TopHost[]> {
    return this.fetch(`/dashboard/hosts/top?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  /**
   * Dashboard - Previsões Futuras
   */
  async getPredictions(horizonHours: number = 24, minConfidence: number = 0.7): Promise<PredictionFuture[]> {
    return this.fetch(`/dashboard/predictions?horizonHours=${horizonHours}&minConfidence=${minConfidence}`);
  }

  /**
   * Dashboard - Performance dos Modelos
   */
  async getModelPerformance(timeRange: string = '7 DAY'): Promise<ModelPerformance[]> {
    return this.fetch(`/dashboard/models/performance?timeRange=${encodeURIComponent(timeRange)}`);
  }

  /**
   * Dashboard - Alertas de Segurança
   */
  async getSecurityAlerts(limit: number = 50, timeRange: string = '24 HOUR'): Promise<SecurityAlert[]> {
    return this.fetch(`/dashboard/security/alerts?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  /**
   * Dashboard - Métricas de Sistema
   */
  async getSystemMetrics(metrics: string[] = ['cpu.usage', 'memory.usage', 'disk.usage'], timeRange: string = '1 HOUR'): Promise<any> {
    const metricsParam = metrics.join(',');
    return this.fetch(`/dashboard/metrics/system?metrics=${encodeURIComponent(metricsParam)}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  /**
   * Dashboard - Eventos Recentes
   */
  async getRecentEvents(limit: number = 100, timeRange: string = '1 HOUR'): Promise<any[]> {
    return this.fetch(`/dashboard/events/recent?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  /**
   * Dashboard - Todos os Dados (Single Call)
   * Retorna todos os dados necessários para o dashboard em uma única chamada
   */
  async getAllDashboardData(): Promise<DashboardAllData> {
    return this.fetch('/dashboard/all');
  }
}

// Singleton instance
export const apiService = new ApiService();
