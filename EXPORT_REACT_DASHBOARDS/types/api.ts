// Types from backend
export interface SystemHealth {
  total_events: number;
  critical_count: number;
  problems: number;
  active_hosts: number;
  health_percentage: number;
}

export interface EventsTimeline {
  time: string;
  events: number;
}

export interface TopHost {
  hostId: string;
  hostName: string;
  event_count: number;
  critical_events: number;
}

export interface IncidentBySeverity {
  severity: string;
  count: number;
  active: number;
}

export interface PredictionFuture {
  timestamp: string;
  host_id: string;
  metric: string;
  predicted_value: number;
  confidence: number;
  breach_threshold: number;
  prediction_status: string;
}

export interface ModelPerformance {
  metric: string;
  total_predictions: number;
  avg_confidence: number;
  validated_predictions: number;
  avg_error: number;
}

export interface SecurityAlert {
  timestamp: string;
  hostName: string;
  ruleName: string;
  severity: string;
  sourceIp: string;
  message: string;
}

export interface DashboardAllData {
  health: SystemHealth;
  timeline: EventsTimeline[];
  incidents: IncidentBySeverity[];
  activeIncidents: any[];
  topHosts: TopHost[];
  predictions: PredictionFuture[];
  modelPerformance: ModelPerformance[];
  securityAlerts: SecurityAlert[];
  timestamp: string;
}
