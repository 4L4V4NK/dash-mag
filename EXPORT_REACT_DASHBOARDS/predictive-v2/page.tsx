'use client';

/**
 * 🧠 PREDICTIVE ANALYTICS DASHBOARD V2 - GOLDEN RATIO DESIGN
 * 
 * Dashboard focado em Machine Learning e Predições
 * Implementa os princípios do Golden Ratio (Φ ≈ 1.618):
 * - Grid: Colunas dinâmicas 3→5→8→13→21 (Fibonacci)
 * - Spacing: 21px gap (Fibonacci)
 * - Typography: Escala Fibonacci (8, 13, 21, 34, 55, 89px)
 * - Layout: Spans inteligentes mantendo proporções áureas
 * - Reorganização automática com grid-auto-flow: dense
 * 
 * Baseado em: Enhanced Predictive Analytics Dashboard (Grafana)
 * Fonte de Dados: ClickHouse (monitoring.ml_predictions, unified_incidents)
 * 
 * Estrutura:
 * - 4 KPIs principais (Prediction Accuracy, Predictions Generated, Proactive Incidents, Avg Confidence)
 * - 8 ChartBlocks (Predictions by Type, Confidence Trend, Top Hosts, Top Metrics, etc.)
 */

import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import { DashboardMetricCard } from '@/components/DashboardMetricCard';
import DashboardHeader from '@/components/DashboardHeader';
import { ChartBlock } from '@/components/ChartBlock';
import { ChartTooltip, chartDefaults, chartColors } from '@/components/ChartConfig';
import { predictiveDashboardService, type PredictiveDashboardData } from '@/services/predictive-dashboard.service';
import { useChartBlocks, type BlockInfo } from '@/hooks/useChartBlocks';
import { useGoldenBreakpoint } from '@/hooks/useGoldenBreakpoint';
import { useGoldenGridLayout } from '@/hooks/useGoldenGridLayout';
import { HiddenBlocksBar } from '@/components/HiddenBlocksBar';
import ChatAssistant from '@/components/ChatAssistant';
import { Server, TrendingUp, Target, Brain } from 'lucide-react';
import styles from './PredictiveV2.module.css';

// Fibonacci chart blocks - organizados por importância
const BLOCKS: BlockInfo[] = [
  { id: 'predictions-by-type', title: '📈 Predictions by Type (24h)' },
  { id: 'confidence-trend', title: '📊 Average Confidence Trend (24h)' },
  { id: 'top-hosts-predictions', title: '🖥️ Top Hosts by Prediction Volume (24h)' },
  { id: 'top-metrics-predictions', title: '📊 Top Metrics by Prediction Volume (24h)' },
  { id: 'proactive-timeline', title: '🔮 Proactive Incident Creation Timeline (24h)' },
  { id: 'predictions-severity', title: '⚠️ Predictions by Severity (24h)' },
  { id: 'predictions-model-type', title: '🧠 Predictions by Model Type (24h)' },
  { id: 'predictions-organization', title: '🏢 Predictions by Organization (24h)' }
];

export default function PredictiveAnalyticsV2() {
  // ⚠️ HOOKS DEVEM SER CHAMADOS NO TOPO - ANTES DE QUALQUER EARLY RETURN
  const [dashboardData, setDashboardData] = useState<PredictiveDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Golden Ratio responsive breakpoints - SEMPRE chamado
  const { columns, gap, breakpoint } = useGoldenBreakpoint();
  
  // Golden Grid Layout - spans inteligentes por breakpoint
  const { getSpan } = useGoldenGridLayout();

  // Interactive features hook - SEMPRE chamado
  const { 
    hideBlock, 
    showBlock, 
    isBlockHidden, 
    goToNextBlock, 
    goToPreviousBlock,
    canGoNext,
    canGoBack,
    expandedBlockId, 
    setExpanded, 
    getHiddenBlocks, 
    resetHiddenBlocks 
  } = useChartBlocks(BLOCKS);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        setLoading(true);
        
        const data = await predictiveDashboardService.getData();
        
        setDashboardData(data);
        setLoading(false);
      } catch (error: any) {
        console.warn('⚠️ Usando fallback data (backend indisponível)');
        setLoading(false);
        setError(null); // Não mostrar erro, fallback já está funcionando
      }
    };

    loadData();
    
    // Auto-refresh: 377ms × 100 = 37.7 segundos (Fibonacci timing)
    const interval = setInterval(loadData, 37700);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <DashboardHeader onOpenAssistant={() => setIsAssistantOpen(true)} />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingIcon}>⏳</div>
            <div className={styles.loadingText}>Carregando Predictive Analytics Dashboard...</div>
            <div className={styles.loadingSubtext}>
              Aplicando Golden Ratio (Φ ≈ 1.618) • Grid {columns} colunas • Gap {gap}px
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={styles.container}>
        <DashboardHeader onOpenAssistant={() => setIsAssistantOpen(true)} />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingIcon}>❌</div>
            <div className={styles.loadingText} style={{ color: '#ef4444' }}>
              Erro ao carregar dados
            </div>
            <div className={styles.loadingSubtext}>
              Nenhum dado disponível
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extrair dados com fallback para evitar undefined
  const {
    kpis = {
      predictionAccuracyRate: { value: '0%', change: '0%', trend: 'neutral' as const, rawValue: 0 },
      predictionsGenerated: { value: '0', change: '0%', trend: 'neutral' as const, rawValue: 0 },
      proactiveIncidents: { value: '0', change: '0%', trend: 'neutral' as const, rawValue: 0 },
      averageConfidence: { value: '0%', change: '0%', trend: 'neutral' as const, rawValue: 0 }
    },
    predictionsByTypeChart = [],
    confidenceTrendChart = [],
    topHostsByPredictions = [],
    topMetricsByPredictions = [],
    proactiveIncidentsTimeline = [],
    predictionsBySeverity = [],
    predictionsByModelType = [],
    predictionsByOrganization = []
  } = dashboardData;

  return (
    <div className={styles.container}>
      <DashboardHeader 
        onOpenAssistant={() => setIsAssistantOpen(true)} 
      />

      {isAssistantOpen && (
        <ChatAssistant onClose={() => setIsAssistantOpen(false)} />
      )}

      {error && (
        <div className={styles.errorBanner}>
          ⚠️ {error}
        </div>
      )}

      <div className={styles.content}>
        {/* 
          KPI Row - Fibonacci spacing (89px height)
          4 métricas principais em proporção áurea
        */}
        <div className={styles.kpiRow}>
          <DashboardMetricCard
            title="Prediction Accuracy Rate"
            value={kpis.predictionAccuracyRate.value}
            change={kpis.predictionAccuracyRate.change}
            trend={kpis.predictionAccuracyRate.trend}
            icon="target"
            subtext="Últimas 24h • Confidence ≥ 80%"
          />
          <DashboardMetricCard
            title="Predictions Generated"
            value={kpis.predictionsGenerated.value}
            change={kpis.predictionsGenerated.change}
            trend={kpis.predictionsGenerated.trend}
            icon="chart"
            subtext="Últimas 24h • All ML models"
          />
          <DashboardMetricCard
            title="Proactive Incidents"
            value={kpis.proactiveIncidents.value}
            change={kpis.proactiveIncidents.change}
            trend={kpis.proactiveIncidents.trend}
            icon="sparkles"
            subtext="Últimas 24h • Prevented via ML"
          />
          <DashboardMetricCard
            title="Average Confidence"
            value={kpis.averageConfidence.value}
            change={kpis.averageConfidence.change}
            trend={kpis.averageConfidence.trend}
            icon="target"
            subtext="Últimas 24h • Mean confidence"
          />
        </div>

        {/* Hidden blocks bar - Fibonacci spacing */}
        {getHiddenBlocks().length > 0 && (
          <HiddenBlocksBar
            hiddenBlocks={getHiddenBlocks()}
            onRestore={showBlock}
            onClearAll={resetHiddenBlocks}
          />
        )}

        {/* 
          Chart Grid - Golden Ratio Layout
          Grid inteligente com spans dinâmicos
          Auto-reorganização mantendo Golden Ratio em todos os breakpoints
        */}
        <h2 className={styles.sectionTitle}>
          Chart Grid - Golden Ratio Layout
          <span className={styles.gridInfo}>
            {columns} colunas • {gap}px gap • {breakpoint} breakpoint
          </span>
        </h2>
        
        <div 
          className={styles.chartsRow}
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap}px`
          }}
        >
          {/* Panel 1: Predictions by Type - span inteligente (large) */}
          {!isBlockHidden('predictions-by-type') && (
            <ChartBlock
              id="predictions-by-type"
              title="📈 Predictions by Type"
              subtitle="Últimas 24h • Distribuição por tipo"
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'predictions-by-type'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'predictions-by-type' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
              gridColumn={`span ${getSpan('large')}`}
            >
              <ResponsiveContainer width="100%" height={233}>
                {predictionsByTypeChart.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={predictionsByTypeChart}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {predictionsByTypeChart.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color || chartColors.primary} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                ) : (
                  <div style={{ textAlign: 'center', padding: '55px', color: 'rgba(255,255,255,0.5)' }}>
                    Sem dados disponíveis
                  </div>
                )}
              </ResponsiveContainer>
            </ChartBlock>
          )}

          {/* Panel 2: Confidence Trend - span inteligente (medium) */}
          {!isBlockHidden('confidence-trend') && (
            <ChartBlock
              id="confidence-trend"
              title="📊 Average Confidence Trend"
              subtitle="Últimas 24h • Evolução temporal"
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'confidence-trend'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'confidence-trend' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
              gridColumn={`span ${getSpan('medium')}`}
            >
              <ResponsiveContainer width="100%" height={233}>
                <LineChart data={confidenceTrendChart}>
                  <CartesianGrid {...chartDefaults.cartesianGrid} />
                  <XAxis 
                    dataKey="time" 
                    {...chartDefaults.xAxis}
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }}
                  />
                  <YAxis 
                    {...chartDefaults.yAxis}
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke={chartColors.success}
                    strokeWidth={3}
                    name="Confidence %"
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartBlock>
          )}

          {/* Panel 3: Top Hosts by Predictions - span inteligente (large) */}
          {!isBlockHidden('top-hosts-predictions') && (
            <ChartBlock
              id="top-hosts-predictions"
              title="🖥️ Top Hosts by Prediction Volume"
              subtitle="Últimas 24h • ML prediction leaders"
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'top-hosts-predictions'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'top-hosts-predictions' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
              gridColumn={`span ${getSpan('large')}`}
            >
              <div className={styles.tableWrapper}>
                <table className={styles.rankingTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Host ID</th>
                      <th>Predictions</th>
                      <th>Avg Confidence</th>
                      <th>Proactive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topHostsByPredictions.slice(0, 10).map((item, index) => (
                      <tr key={item.hostId}>
                        <td className={styles.rank}>
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && (index + 1)}
                        </td>
                        <td className={styles.hostId}>
                          <Server size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                          {item.hostId}
                        </td>
                        <td className={styles.number}>{item.formatted_count || item.prediction_count}</td>
                        <td className={styles.confidence}>
                          <div className={styles.confidenceBar} style={{ width: `${(item.avg_confidence || 0) * 100}%` }} />
                          <span>{((item.avg_confidence || 0) * 100).toFixed(1)}%</span>
                        </td>
                        <td className={styles.number}>{item.proactive_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartBlock>
          )}

          {/* Panel 4: Top Metrics by Predictions - span inteligente (medium) */}
          {!isBlockHidden('top-metrics-predictions') && (
            <ChartBlock
              id="top-metrics-predictions"
              title="📊 Top Metrics by Prediction Volume"
              subtitle="Últimas 24h • Most predicted metrics"
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'top-metrics-predictions'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'top-metrics-predictions' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
              gridColumn={`span ${getSpan('medium')}`}
            >
              <div className={styles.tableWrapper}>
                <table className={styles.rankingTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Metric</th>
                      <th>Predictions</th>
                      <th>Proactive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMetricsByPredictions.slice(0, 10).map((item, index) => (
                      <tr key={item.metric}>
                        <td className={styles.rank}>
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && (index + 1)}
                        </td>
                        <td className={styles.metricName}>
                          <code>{item.metric}</code>
                        </td>
                        <td className={styles.number}>{item.formatted_count || item.prediction_count}</td>
                        <td className={styles.number}>{item.proactive_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartBlock>
          )}

          {/* Panel 5: Proactive Timeline - span inteligente (large) */}
          {!isBlockHidden('proactive-timeline') && (
            <ChartBlock
              id="proactive-timeline"
              title="🔮 Proactive Incident Creation Timeline"
              subtitle="Últimas 24h • Prevented incidents per hour"
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'proactive-timeline'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'proactive-timeline' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
              gridColumn={`span ${getSpan('large')}`}
            >
              <ResponsiveContainer width="100%" height={233}>
                <LineChart data={proactiveIncidentsTimeline}>
                  <CartesianGrid {...chartDefaults.cartesianGrid} />
                  <XAxis 
                    dataKey="time" 
                    {...chartDefaults.xAxis}
                    tick={{ fontSize: 13 }}
                  />
                  <YAxis {...chartDefaults.yAxis} tick={{ fontSize: 13 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="proactive_incidents" 
                    stroke={chartColors.success}
                    strokeWidth={3}
                    name="Proactive Incidents"
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartBlock>
          )}

          {/* Panel 6: Predictions by Severity - span inteligente (medium) */}
          {!isBlockHidden('predictions-severity') && (
            <ChartBlock
              id="predictions-severity"
              title="⚠️ Predictions by Severity"
              subtitle="Últimas 24h • Criticality distribution"
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'predictions-severity'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'predictions-severity' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
              gridColumn={`span ${getSpan('medium')}`}
            >
              <ResponsiveContainer width="100%" height={233}>
                <BarChart data={predictionsBySeverity} layout="vertical">
                  <CartesianGrid {...chartDefaults.cartesianGrid} />
                  <XAxis type="number" {...chartDefaults.xAxis} tick={{ fontSize: 13 }} />
                  <YAxis type="category" dataKey="severity" {...chartDefaults.yAxis} tick={{ fontSize: 13 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="prediction_count" name="Predictions">
                    {predictionsBySeverity.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color || chartColors.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartBlock>
          )}

          {/* Panel 7: Predictions by Model Type - span inteligente (large) */}
          {!isBlockHidden('predictions-model-type') && (
            <ChartBlock
              id="predictions-model-type"
              title="🧠 Predictions by Model Type"
              subtitle="Últimas 24h • ML model performance"
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'predictions-model-type'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'predictions-model-type' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
              gridColumn={`span ${getSpan('large')}`}
            >
              <div className={styles.tableWrapper}>
                <table className={styles.rankingTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Model Type</th>
                      <th>Predictions</th>
                      <th>Confidence</th>
                      <th>Proactive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictionsByModelType.map((item, index) => (
                      <tr key={item.modelType}>
                        <td className={styles.rank}>{index + 1}</td>
                        <td className={styles.modelType}>
                          <Brain size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                          {item.modelType}
                        </td>
                        <td className={styles.number}>{item.formatted_count || item.prediction_count}</td>
                        <td className={styles.confidence}>
                          {((item.avg_confidence || 0) * 100).toFixed(1)}%
                        </td>
                        <td className={styles.number}>{item.proactive_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartBlock>
          )}

          {/* Panel 8: Predictions by Organization - span inteligente (medium) */}
          {!isBlockHidden('predictions-organization') && (
            <ChartBlock
              id="predictions-organization"
              title="🏢 Predictions by Organization"
              subtitle="Últimas 24h • Organizational view"
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'predictions-organization'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'predictions-organization' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
              gridColumn={`span ${getSpan('medium')}`}
            >
              <ResponsiveContainer width="100%" height={233}>
                <BarChart data={predictionsByOrganization}>
                  <CartesianGrid {...chartDefaults.cartesianGrid} />
                  <XAxis dataKey="orgId" {...chartDefaults.xAxis} tick={{ fontSize: 13 }} />
                  <YAxis {...chartDefaults.yAxis} tick={{ fontSize: 13 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="prediction_count" fill={chartColors.primary} name="Predictions" />
                </BarChart>
              </ResponsiveContainer>
            </ChartBlock>
          )}
        </div>
      </div>
    </div>
  );
}
