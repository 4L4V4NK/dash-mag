'use client';

/**
 * 🌟 OPERATIONAL DASHBOARD - GOLDEN RATIO DESIGN
 * 
 * Este dashboard implementa os princípios do Golden Ratio (Φ ≈ 1.618):
 * - Grid: 13 colunas (Fibonacci)
 * - Gaps: 21px (Fibonacci)
 * - Blocos: span 8 (grande) e span 5 (médio) → 8/5 ≈ 1.6 ≈ Φ
 * - Tipografia: escala Fibonacci (8, 13, 21, 34, 55px)
 * - Animações: timing Fibonacci (89ms, 144ms, 233ms, 377ms)
 * - Breakpoints: 377px, 610px, 987px, 1597px (Fibonacci)
 * 
 * Baseado em: Enhanced Operational Dashboard (Grafana)
 * Referência: GOLDEN-RATIO-DASHBOARD-DESIGN.md
 */

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Activity, Server, Zap, TrendingUp, AlertCircle, Cpu, Database } from 'lucide-react';
import { DashboardMetricCard } from '@/components/DashboardMetricCard';
import DashboardHeader from '@/components/DashboardHeader';
import { ChartBlock } from '@/components/ChartBlock';
import { ChartTooltip, chartDefaults, chartColors } from '@/components/ChartConfig';
import { operationalDashboardService, type OperationalDashboardData } from '@/services/operational-dashboard.service';
import { useChartBlocks, type BlockInfo } from '@/hooks/useChartBlocks';
import { useGoldenBreakpoint } from '@/hooks/useGoldenBreakpoint';
import { useGoldenGridLayout } from '@/hooks/useGoldenGridLayout';
import { HiddenBlocksBar } from '@/components/HiddenBlocksBar';
import ChatAssistant from '@/components/ChatAssistant';
import styles from './OperationalV2.module.css';

const BLOCKS: BlockInfo[] = [
  { id: 'event-processing-rate', title: '⚡ Event Processing Rate (Last Hour)' },
  { id: 'prediction-performance', title: '🤖 Prediction Performance by Type (24h)' },
  { id: 'top-metrics-activity', title: '📈 Top Metrics by Activity (Last Hour)' },
  { id: 'incident-creation', title: '🚨 Incident Creation Rate (Last Hour)' },
  { id: 'top-hosts-predictions', title: '🎯 Top Hosts by Prediction Volume (Last Hour)' },
  { id: 'top-metrics-predictions', title: '📊 Top Metrics by Prediction Volume (Last Hour)' },
  { id: 'flapping-detection', title: '🔄 Flapping Detection Activity (Last Hour)' },
  { id: 'top-hosts-lifecycle', title: '🔄 Top Hosts by Lifecycle Activity (Last Hour)' }
];

export default function OperationalDashboardV2() {
  const [dashboardData, setDashboardData] = useState<OperationalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
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

  // Golden Ratio responsive breakpoints - SEMPRE chamado
  const { columns, gap, breakpoint } = useGoldenBreakpoint();
  
  // Golden Grid Layout - spans inteligentes por breakpoint
  const { getSpan } = useGoldenGridLayout();

  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        const data = await operationalDashboardService.getData('24 HOUR');
        setDashboardData(data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Falha ao carregar dados. Usando dados de fallback.');
        const fallbackData = await operationalDashboardService.getData('24 HOUR');
        setDashboardData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Auto-refresh: 377ms × 100 = 37.7 segundos (Fibonacci timing)
    const interval = setInterval(loadData, 37700);
    return () => clearInterval(interval);
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className={styles.container}>
        <DashboardHeader onOpenAssistant={() => setIsAssistantOpen(true)} />
        <div className={styles.loadingState}>
          <div className={styles.loadingContent}>
            <div className={styles.loadingIcon}>⏳</div>
            <div className={styles.loadingText}>Carregando Operational Dashboard...</div>
            <div className={styles.loadingSubtext}>Aplicando Golden Ratio (Φ ≈ 1.618) • Grid {columns} colunas • Gap {gap}px</div>
          </div>
        </div>
      </div>
    );
  }

  const { 
    kpis, 
    eventProcessingRateChart,
    predictionPerformanceChart, 
    topHostsByEvents, 
    topHostsByPredictions, 
    incidentCreationRateChart, 
    flappingActivityChart,
    topMetricsByActivity,
    topMetricsByPredictions,
    topHostsByLifecycle
  } = dashboardData;

  const hiddenBlocks = getHiddenBlocks();

  return (
    <div className={styles.container}>
      <DashboardHeader onOpenAssistant={() => setIsAssistantOpen(true)} />

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* KPIs Row - Golden Ratio Cards */}
      <div className={styles.kpisRow}>
        <DashboardMetricCard
          title="Events (Last Hour)"
          value={kpis.eventsProcessed.value}
          change={kpis.eventsProcessed.change}
          trend={kpis.eventsProcessed.trend}
          icon={<Zap size={21} />}
          colorScheme="blue"
        />
        <DashboardMetricCard
          title="Active Hosts"
          value={kpis.activeHosts.value}
          change={kpis.activeHosts.change}
          trend={kpis.activeHosts.trend}
          icon={<Server size={21} />}
          colorScheme="purple"
        />
        <DashboardMetricCard
          title="Incidents (Last Hour)"
          value={kpis.incidentsCreated.value}
          change={kpis.incidentsCreated.change}
          trend={kpis.incidentsCreated.trend}
          icon={<AlertCircle size={21} />}
          colorScheme="orange"
        />
        <DashboardMetricCard
          title="Predictions (Last Hour)"
          value={kpis.predictionsGenerated.value}
          change={kpis.predictionsGenerated.change}
          trend={kpis.predictionsGenerated.trend}
          icon={<TrendingUp size={21} />}
          colorScheme="green"
        />
      </div>

      {/* Hidden Blocks Bar */}
      {hiddenBlocks.length > 0 && (
        <HiddenBlocksBar
          hiddenBlocks={hiddenBlocks}
          onRestore={showBlock}
          onClearAll={resetHiddenBlocks}
        />
      )}

      <div className={styles.contentArea}>
        <h2 className={styles.sectionTitle}>
          Chart Grid - Golden Ratio Layout
          <span className={styles.gridInfo}>
            {columns} colunas • {gap}px gap • {breakpoint} breakpoint
          </span>
        </h2>

        {/* Charts Grid - 13 colunas Fibonacci com auto-reorganização */}
        <div 
          className={styles.chartsRow}
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap}px`
          }}
        >
          {/* Panel 1: Event Processing Rate - span inteligente (large) */}
          {!isBlockHidden('event-processing-rate') && (
            <ChartBlock
              id="event-processing-rate"
              title="⚡ Event Processing Rate (Last Hour)"
              subtitle="Events processed per minute"
              gridColumn={`span ${getSpan('large')}`}
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'event-processing-rate'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'event-processing-rate' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eventProcessingRateChart} {...chartDefaults}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={13} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={13} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="events_per_minute" 
                    stroke={chartColors.blue} 
                    strokeWidth={2}
                    dot={{ fill: chartColors.blue, r: 3 }}
                    name="Events/min"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartBlock>
          )}

          {/* Panel 2: Prediction Performance - span inteligente (medium) */}
          {!isBlockHidden('prediction-performance') && (
            <ChartBlock
              id="prediction-performance"
              title="🤖 Prediction Performance by Type"
              subtitle="24-hour prediction breakdown"
              gridColumn={`span ${getSpan('medium')}`}
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'prediction-performance'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'prediction-performance' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictionPerformanceChart} {...chartDefaults}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="predictionType" stroke="rgba(255,255,255,0.3)" fontSize={13} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={13} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="total_predictions" fill={chartColors.purple} name="Total Predictions" />
                  <Bar dataKey="validated_predictions" fill={chartColors.green} name="Validated" />
                </BarChart>
              </ResponsiveContainer>
            </ChartBlock>
          )}

          {/* Panel 3: Top Metrics by Activity - span inteligente (large) */}
          {!isBlockHidden('top-metrics-activity') && (
            <ChartBlock
              id="top-metrics-activity"
              title="📈 Top Metrics by Activity"
              subtitle="Last hour - most active metrics"
              gridColumn={`span ${getSpan('large')}`}
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'top-metrics-activity'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'top-metrics-activity' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
            >
              <div className={styles.tableWrapper}>
                <table className={styles.rankingTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Metric</th>
                      <th>Events</th>
                      <th>Hosts</th>
                      <th>Avg Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMetricsByActivity.slice(0, 10).map((item, index) => (
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
                        <td className={styles.number}>{item.formatted_count || item.event_count}</td>
                        <td className={styles.number}>{item.unique_hosts}</td>
                        <td className={styles.number}>{item.avg_value?.toFixed(2) || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartBlock>
          )}

          {/* Panel 4: Incident Creation Rate - span inteligente (medium) */}
          {!isBlockHidden('incident-creation') && (
            <ChartBlock
              id="incident-creation"
              title="🚨 Incident Creation Rate"
              subtitle="Last hour - incidents per minute"
              gridColumn={`span ${getSpan('medium')}`}
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'incident-creation'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'incident-creation' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={incidentCreationRateChart} {...chartDefaults}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={13} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={13} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="incidents_per_minute" 
                    stroke={chartColors.orange} 
                    strokeWidth={2}
                    dot={{ fill: chartColors.orange, r: 3 }}
                    name="Incidents/min"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartBlock>
          )}

          {/* Panel 5: Top Hosts by Prediction - span inteligente (large) */}
          {!isBlockHidden('top-hosts-predictions') && (
            <ChartBlock
              id="top-hosts-predictions"
              title="🎯 Top Hosts by Prediction Volume"
              subtitle="Last hour - ML prediction leaders"
              gridColumn={`span ${getSpan('large')}`}
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'top-hosts-predictions'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'top-hosts-predictions' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
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

          {/* Panel 6: Top Metrics by Predictions - span inteligente (medium) */}
          {!isBlockHidden('top-metrics-predictions') && (
            <ChartBlock
              id="top-metrics-predictions"
              title="📊Top Metrics by Prediction Volume"
              subtitle="Last hour - most predicted metrics"
              gridColumn={`span ${getSpan('medium')}`}
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'top-metrics-predictions'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'top-metrics-predictions' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
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

          {/* Panel 7: Flapping Detection - span inteligente (large) */}
          {!isBlockHidden('flapping-detection') && (
            <ChartBlock
              id="flapping-detection"
              title="🔄 Flapping Detection Activity"
              subtitle="Last hour - state oscillations"
              gridColumn={`span ${getSpan('large')}`}
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'flapping-detection'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'flapping-detection' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flappingActivityChart} {...chartDefaults}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={13} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={13} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="flapping_events" 
                    stroke={chartColors.yellow} 
                    strokeWidth={2}
                    dot={{ fill: chartColors.yellow, r: 3 }}
                    name="Flapping Events"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartBlock>
          )}

          {/* Panel 8: Top Hosts by Lifecycle - span inteligente (medium) */}
          {!isBlockHidden('top-hosts-lifecycle') && (
            <ChartBlock
              id="top-hosts-lifecycle"
              title="🔄 Top Hosts by Lifecycle Activity"
              subtitle="Last hour - state changes"
              gridColumn={`span ${getSpan('medium')}`}
              onHide={hideBlock}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              isExpanded={expandedBlockId === 'top-hosts-lifecycle'}
              onExpandChange={(expanded: boolean) =>
                setExpanded(expanded ? 'top-hosts-lifecycle' : null)
              }
              canGoBack={canGoBack()}
              canGoNext={canGoNext()}
            >
              <div className={styles.tableWrapper}>
                <table className={styles.rankingTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Host ID</th>
                      <th>Lifecycle</th>
                      <th>Flapping</th>
                      <th>Problems</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topHostsByLifecycle.slice(0, 10).map((item, index) => (
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
                        <td className={styles.number}>{item.lifecycle_count}</td>
                        <td className={styles.number}>{item.flapping_count}</td>
                        <td className={styles.number}>{item.problem_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartBlock>
          )}
        </div>
      </div>

      {isAssistantOpen && (
        <ChatAssistant onClose={() => setIsAssistantOpen(false)} />
      )}
    </div>
  );
}
