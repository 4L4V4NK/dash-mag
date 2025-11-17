/**
 * Dashboard API Service - Completo
 * Todas as chamadas necessárias para alimentar os 4 dashboards do Grafana
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class DashboardsApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Método auxiliar para fazer requisições
   */
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
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
      // Silenciado: erro esperado quando backend não existe (usa fallback)
      // console.warn(`⚠️ API unavailable (${endpoint}) - using fallback data`);
      throw error;
    }
  }

  // ========================================
  // EXECUTIVE DASHBOARD
  // ========================================

  async getEventsProcessed(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/events-timeline?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getIncidentCounts(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/incidents/counts?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getTotalIncidents(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/incidents/recent?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getMLPredictionAccuracy(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/stats?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getProactiveIncidents(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/incidents/recent?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getIncidentsBySeverity(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/incidents/trends?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getTopHostsByActivity(limit: number = 10, timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/top-hosts?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getMLPredictionsGenerated(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/predictions/timeline?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getIncidentTrendsByType(timeRange: string = '7 DAY') {
    return this.fetch(`/dashboard/incidents/trends?timeRange=${encodeURIComponent(timeRange)}`);
  }

  // ========================================
  // OPERATIONAL DASHBOARD
  // ========================================

  async getEventProcessingRate(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/events-timeline?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getEvents(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/stats?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getActiveHosts(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/health?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getPredictionPerformanceByType(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/predictions/performance-by-type?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getTopHostsByEventCount(limit: number = 10, timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/top-hosts?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getTopHostsByPredictionVolume(limit: number = 10, timeRange: string = '1 HOUR') {
    return this.fetch(`/dashboard/hosts/top-by-predictions?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getTopMetricsByActivity(limit: number = 10, timeRange: string = '1 HOUR') {
    return this.fetch(`/dashboard/metrics/top-by-activity?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getTopMetricsByPredictionVolume(limit: number = 10, timeRange: string = '1 HOUR') {
    return this.fetch(`/dashboard/metrics/top-by-predictions?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getIncidentCreationRate(timeRange: string = '1 HOUR') {
    return this.fetch(`/dashboard/stats?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getFlappingActivity(timeRange: string = '1 HOUR') {
    return this.fetch(`/dashboard/flapping-activity?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getIncidentTrendsByType(timeRange: string = '7 DAY') {
    return this.fetch(`/dashboard/incidents/trends-by-type?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getIncidentsByOrganization(timeRange: string = '7 DAY') {
    return this.fetch(`/dashboard/incidents/by-organization?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getTopMetricsByPredictionVolume(limit: number = 10, timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/metrics/top-by-predictions?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getTopHostsByLifecycle(limit: number = 10, timeRange: string = '1 HOUR') {
    return this.fetch(`/dashboard/hosts/top-by-lifecycle?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  // ========================================
  // PREDICTIVE ANALYTICS DASHBOARD
  // ========================================

  async getPredictionAccuracyRate(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/stats?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getPredictionsGenerated(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/predictions/timeline?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getProactiveIncidentsCount(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/incidents/recent?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getAverageConfidence(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/stats?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getPredictionsByType(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/predictions/performance-by-type?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getAverageConfidenceTrend(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/predictions/confidence-trend?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getTopHostsByPredictionVolumeAnalytics(limit: number = 10, timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/hosts/top-by-predictions?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getPredictionsBySeverity(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/predictions/by-severity?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getProactiveIncidentTimeline(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/incidents/proactive-timeline?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getPredictionsByModelType(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/predictions/by-model?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getPredictionsByOrganization(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/predictions/by-organization?timeRange=${encodeURIComponent(timeRange)}`);
  }

  // ========================================
  // METRICS ROLLUP DASHBOARD
  // ========================================

  async getHourlyRollupRecords(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/rollups/hourly/count?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getDailyRollupRecords(timeRange: string = '7 DAY') {
    return this.fetch(`/dashboard/rollups/daily/count?timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getUniqueHostsInRollups(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/rollups/stats?timeRange=${encodeURIComponent(timeRange)}&type=hourly`);
  }

  async getUniqueMetricsInRollups(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/rollups/stats?timeRange=${encodeURIComponent(timeRange)}&type=hourly`);
  }

  async getHourlyRollupData(timeRange: string = '24 HOUR', limit: number = 100) {
    return this.fetch(`/dashboard/rollups/data?timeRange=${encodeURIComponent(timeRange)}&type=hourly&limit=${limit}`);
  }

  async getDailyRollupData(timeRange: string = '7 DAY', limit: number = 100) {
    return this.fetch(`/dashboard/rollups/data?timeRange=${encodeURIComponent(timeRange)}&type=daily&limit=${limit}`);
  }

  async getTopHostsByRollupVolume(limit: number = 10, timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/rollups/hosts/top?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getTopMetricsByRollupVolume(limit: number = 10, timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/rollups/metrics/top?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getRollupGenerationRateHourly(timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/rollups/generation-rate?timeRange=${encodeURIComponent(timeRange)}&type=hourly`);
  }

  async getRollupGenerationRateDaily(timeRange: string = '7 DAY') {
    return this.fetch(`/dashboard/rollups/generation-rate?timeRange=${encodeURIComponent(timeRange)}&type=daily`);
  }

  async getTopSeriesBySampleVolume(limit: number = 10, timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/rollups/series/top-by-samples?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  async getTopSeriesByVariability(limit: number = 10, timeRange: string = '24 HOUR') {
    return this.fetch(`/dashboard/rollups/series/top-by-variability?limit=${limit}&timeRange=${encodeURIComponent(timeRange)}`);
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Busca dados completos para Executive Dashboard
   */
  async getExecutiveDashboardData(timeRange: string = '24 HOUR') {
    const [
      eventsProcessed,
      totalIncidents,
      mlAccuracy,
      proactiveIncidents,
      incidentsBySeverity,
      topHosts,
      mlPredictions,
      incidentTrends
    ] = await Promise.all([
      this.getEventsProcessed(timeRange),
      this.getTotalIncidents(timeRange),
      this.getMLPredictionAccuracy(timeRange),
      this.getProactiveIncidents(timeRange),
      this.getIncidentsBySeverity(timeRange),
      this.getTopHostsByActivity(10, timeRange),
      this.getMLPredictionsGenerated(timeRange),
      this.getIncidentTrendsByType('7 DAY')
    ]);

    return {
      eventsProcessed,
      totalIncidents,
      mlAccuracy,
      proactiveIncidents,
      incidentsBySeverity,
      topHosts,
      mlPredictions,
      incidentTrends
    };
  }

  /**
   * Busca dados completos para Operational Dashboard
   */
  async getOperationalDashboardData(timeRange: string = '24 HOUR') {
    const [
      eventProcessingRate,
      events,
      activeHosts,
      predictionPerformance,
      topHostsByEvents,
      topHostsByPredictions,
      incidentCreationRate,
      flappingActivity
    ] = await Promise.all([
      this.getEventProcessingRate(timeRange),
      this.getEvents(timeRange),
      this.getActiveHosts(timeRange),
      this.getPredictionPerformanceByType(timeRange),
      this.getTopHostsByEventCount(10, timeRange),
      this.getTopHostsByPredictionVolume(10, '1 HOUR'),
      this.getIncidentCreationRate('1 HOUR'),
      this.getFlappingActivity(timeRange)
    ]);

    return {
      eventProcessingRate,
      events,
      activeHosts,
      predictionPerformance,
      topHostsByEvents,
      topHostsByPredictions,
      incidentCreationRate,
      flappingActivity
    };
  }

  /**
   * Busca dados completos para Predictive Dashboard
   */
  async getPredictiveDashboardData(timeRange: string = '24 HOUR') {
    const [
      accuracyRate,
      predictionsGenerated,
      proactiveIncidents,
      averageConfidence,
      predictionsByType,
      confidenceTrend,
      topHosts,
      predictionsBySeverity,
      proactiveTimeline,
      predictionsByModel
    ] = await Promise.all([
      this.getPredictionAccuracyRate(timeRange),
      this.getPredictionsGenerated(timeRange),
      this.getProactiveIncidentsCount(timeRange),
      this.getAverageConfidence(timeRange),
      this.getPredictionsByType(timeRange),
      this.getAverageConfidenceTrend(timeRange),
      this.getTopHostsByPredictionVolumeAnalytics(10, timeRange),
      this.getPredictionsBySeverity(timeRange),
      this.getProactiveIncidentTimeline(timeRange),
      this.getPredictionsByModelType(timeRange)
    ]);

    return {
      accuracyRate,
      predictionsGenerated,
      proactiveIncidents,
      averageConfidence,
      predictionsByType,
      confidenceTrend,
      topHosts,
      predictionsBySeverity,
      proactiveTimeline,
      predictionsByModel
    };
  }

  /**
   * Busca dados completos para Metrics Rollup Dashboard
   */
  async getMetricsRollupDashboardData() {
    const [
      hourlyCount,
      dailyCount,
      uniqueStats,
      hourlyData,
      dailyData,
      topHosts,
      topMetrics,
      hourlyRate,
      dailyRate,
      topSeries,
      topVariability
    ] = await Promise.all([
      this.getHourlyRollupRecords('24 HOUR'),
      this.getDailyRollupRecords('7 DAY'),
      this.getUniqueHostsInRollups('24 HOUR'),
      this.getHourlyRollupData('24 HOUR', 100),
      this.getDailyRollupData('7 DAY', 100),
      this.getTopHostsByRollupVolume(10, '24 HOUR'),
      this.getTopMetricsByRollupVolume(10, '24 HOUR'),
      this.getRollupGenerationRateHourly('24 HOUR'),
      this.getRollupGenerationRateDaily('7 DAY'),
      this.getTopSeriesBySampleVolume(10, '24 HOUR'),
      this.getTopSeriesByVariability(10, '24 HOUR')
    ]);

    return {
      hourlyCount,
      dailyCount,
      uniqueStats,
      hourlyData,
      dailyData,
      topHosts,
      topMetrics,
      hourlyRate,
      dailyRate,
      topSeries,
      topVariability
    };
  }
}

export const dashboardsApi = new DashboardsApiService();
