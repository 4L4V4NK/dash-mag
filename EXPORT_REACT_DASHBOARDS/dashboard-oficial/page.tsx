'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { corelyticsTheme } from '@/styles/corelytics-theme';
import { TrendingUp, Calculator, Smile, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { DashboardMetricCard } from '@/components/DashboardMetricCard';
import DashboardHeader from '@/components/DashboardHeader';
import { executiveDashboardService, type ExecutiveDashboardData } from '@/services/executive-dashboard.service';
import { ChartBlock } from '@/components/ChartBlock';
import { useChartBlocks, type BlockInfo } from '@/hooks/useChartBlocks';
import { HiddenBlocksBar } from '@/components/HiddenBlocksBar';
import ChatAssistant from '@/components/ChatAssistant';
import styles from './Dashboard.module.css';
import Image from 'next/image';

// Define all chart blocks for interactive features
const BLOCKS: BlockInfo[] = [
  { id: 'events-processed', title: 'Events Processed' },
  { id: 'incidents-severity', title: 'Incidents by Severity' },
  { id: 'ml-predictions', title: 'ML Predictions Generated' },
  { id: 'top-hosts', title: 'Top Hosts by Activity (24h)' },
  { id: 'incident-trends-type', title: 'Incident Trends by Type' },
  { id: 'incidents-organization', title: 'Incidents by Organization' },
  { id: 'top-metrics-predictions', title: 'Top Metrics by Prediction Volume' },
];

export default function DashboardOficial() {
  const [dashboardData, setDashboardData] = useState<ExecutiveDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Interactive features hook
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
        const data = await executiveDashboardService.getData('24 HOUR');
        setDashboardData(data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Falha ao carregar dados. Usando dados de fallback.');
        // Mesmo com erro, exibir dados de fallback
        const fallbackData = await executiveDashboardService.getData('24 HOUR');
        setDashboardData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className={styles.dashboardContainer}>
        <DashboardHeader onOpenAssistant={() => setIsAssistantOpen(true)} />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '50vh',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '1rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>⏳</div>
            <div>Carregando dados do Executive Dashboard...</div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.7 }}>
              Conectando ao ClickHouse
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { kpis, eventsProcessedChart, incidentsBySeverityChart, mlPredictionsChart, topHosts, incidentTrendsByType, incidentsByOrganization, topMetricsByPredictions } = dashboardData;
  return (
    <div className={styles.dashboardContainer}>
      {/* New Header Component */}
      <DashboardHeader onOpenAssistant={() => setIsAssistantOpen(true)} />

      <main className={styles.dashboardContent}>
        {/* Alert de Erro (se houver) */}
        {error && (
          <div style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            color: 'rgba(251, 191, 36, 0.9)',
            fontSize: '0.875rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Row 1: Metrics Cards */}
        <div className={styles.metricsRow}>
          <DashboardMetricCard
            title="Proactive Incidents"
            value={kpis.proactiveIncidents.value}
            change={kpis.proactiveIncidents.change}
            trend={kpis.proactiveIncidents.trend}
            icon="chart"
          />
          <DashboardMetricCard
            title="Total Incidents"
            value={kpis.totalIncidents.value}
            change={kpis.totalIncidents.change}
            trend={kpis.totalIncidents.trend}
            icon="calculator"
          />
          <DashboardMetricCard
            title="ML Prediction Accuracy"
            value={kpis.mlAccuracy.value}
            change={kpis.mlAccuracy.change}
            trend={kpis.mlAccuracy.trend}
            icon="smile"
          />
          <DashboardMetricCard
            title="Proactive Incident Rate"
            value={kpis.proactiveRate.value}
            icon="sparkles"
            subtext={kpis.proactiveRate.subtext}
          />
        </div>

        {/* Row 2: Charts */}
        <div className={styles.chartsRow}>
          {/* Events Processed Chart (AreaChart) */}
          {!isBlockHidden('events-processed') && (
          <ChartBlock 
            title="Events Processed" 
            id="events-processed"
            onHide={hideBlock}
            onNext={goToNextBlock}
            onPrevious={goToPreviousBlock}
            isExpanded={expandedBlockId === 'events-processed'}
            onExpandChange={(expanded: boolean) => setExpanded(expanded ? 'events-processed' : null)}
            canGoBack={canGoBack()}
            canGoNext={canGoNext()}
          >
            <ResponsiveContainer 
              width="100%" 
              height={expandedBlockId === 'events-processed' ? '100%' : 150}
              key={`area-${expandedBlockId === 'events-processed' ? 'expanded' : 'normal'}`}
            >
              <AreaChart data={eventsProcessedChart} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="eventsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgba(255,255,255,0.05)" 
                    vertical={false}
                  />
                  
                  <XAxis 
                    dataKey="month" 
                    stroke="rgba(255,255,255,0.3)"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  />
                  
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(30, 34, 47, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '12px'
                    }}
                    labelStyle={{ color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}
                    formatter={(value: any) => [value.toLocaleString() + ' events', 'Events']}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="income"
                    stroke="#2DD4BF"
                    strokeWidth={2}
                    fill="url(#eventsGradient)"
                    fillOpacity={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
          </ChartBlock>
          )}

          {/* Incidents by Severity Chart (LineChart) */}
          {!isBlockHidden('incidents-severity') && (
          <ChartBlock 
            title="Incidents by Severity" 
            id="incidents-severity"
            onHide={hideBlock}
            onNext={goToNextBlock}
            onPrevious={goToPreviousBlock}
            isExpanded={expandedBlockId === 'incidents-severity'}
            onExpandChange={(expanded: boolean) => setExpanded(expanded ? 'incidents-severity' : null)}
            canGoBack={canGoBack()}
            canGoNext={canGoNext()}
          >
            <div style={{ 
              width: '100%',
              minHeight: '240px',
              display: 'grid',
              gridTemplateColumns: '140px 1fr',
              gap: '1.5rem',
              alignItems: 'center',
              padding: '1rem'
            }}>
              {/* Legend on the left */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1.25rem',
                justifyContent: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ 
                    width: '3px', 
                    height: '40px', 
                    borderRadius: '2px',
                    background: '#EF4444'
                  }}></div>
                  <div>
                    <div style={{ 
                      fontSize: '0.8125rem', 
                      fontWeight: 500, 
                      color: 'rgba(255,255,255,0.95)',
                      marginBottom: '0.25rem'
                    }}>
                      Critical <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 600 }}>+15%</span>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
                      high priority
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ 
                    width: '3px', 
                    height: '40px', 
                    borderRadius: '2px',
                    background: '#F59E0B'
                  }}></div>
                  <div>
                    <div style={{ 
                      fontSize: '0.8125rem', 
                      fontWeight: 500, 
                      color: 'rgba(255,255,255,0.95)',
                      marginBottom: '0.25rem'
                    }}>
                      High <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 600 }}>-3%</span>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
                      needs attention
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ 
                    width: '3px', 
                    height: '40px', 
                    borderRadius: '2px',
                    background: '#0A4D8C'
                  }}></div>
                  <div>
                    <div style={{ 
                      fontSize: '0.8125rem', 
                      fontWeight: 500, 
                      color: 'rgba(255,255,255,0.95)',
                      marginBottom: '0.25rem'
                    }}>
                      Medium/Low <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>-10%</span>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
                      under control
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chart on the right */}
              <div style={{ 
                width: '100%',
                height: expandedBlockId === 'incidents-severity' ? '100%' : '200px',
                minHeight: '200px',
                position: 'relative',
                zIndex: 1
              }}>
                <ResponsiveContainer width="100%" height="100%" key={`line-${expandedBlockId === 'incidents-severity' ? 'expanded' : 'normal'}`}>
                  <LineChart data={incidentsBySeverityChart} margin={{ top: 5, right: 15, left: 0, bottom: -5 }}>
                    <CartesianGrid 
                      vertical={false} 
                      stroke="rgba(255,255,255,0.05)" 
                      strokeDasharray="3 3" 
                      horizontal={true}
                    />
                    <XAxis 
                      dataKey="month" 
                      stroke="rgba(255,255,255,0.3)"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                    />
                    <YAxis 
                      orientation="right"
                      stroke="rgba(255,255,255,0.3)"
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 400]}
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div style={{
                              background: 'rgba(26, 29, 41, 0.98)',
                              border: '1px solid rgba(10, 77, 140, 0.3)',
                              borderRadius: '12px',
                              padding: '0.75rem 1rem',
                              backdropFilter: 'blur(8px)',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                              minWidth: '140px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <div style={{ 
                                  width: '24px', 
                                  height: '24px', 
                                  borderRadius: '50%',
                                  background: 'rgba(10, 77, 140, 0.15)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '1px solid rgba(10, 77, 140, 0.3)'
                                }}>
                                  <span style={{ fontSize: '0.625rem' }}>📊</span>
                                </div>
                                <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>CSAT</span>
                              </div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'rgba(255,255,255,0.7)', marginBottom: '0.625rem' }}>
                                {label} '24
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {payload.map((entry: any, index: number) => {
                                  const colors: Record<string, string> = {
                                    satisfied: '#0A4D8C',
                                    neutral: '#F59E0B',
                                    unsatisfied: '#EF4444'
                                  };
                                  const percentChanges: Record<string, string> = {
                                    satisfied: '+21%',
                                    neutral: '-8%',
                                    unsatisfied: '-1%'
                                  };
                                  const changeColors: Record<string, string> = {
                                    satisfied: '#10B981',
                                    neutral: '#EF4444',
                                    unsatisfied: '#EF4444'
                                  };
                                  
                                  return (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                      <div style={{ 
                                        width: '8px', 
                                        height: '8px', 
                                        borderRadius: '50%', 
                                        background: colors[entry.dataKey] || entry.color
                                      }}></div>
                                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
                                        {entry.value}
                                      </span>
                                      <span style={{ 
                                        fontSize: '0.6875rem', 
                                        color: changeColors[entry.dataKey] || '#10B981', 
                                        fontWeight: 500 
                                      }}>
                                        {percentChanges[entry.dataKey] || '+0%'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="critical" 
                      stroke="#EF4444"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 6, fill: '#EF4444', stroke: '#fff', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="high" 
                      stroke="#F59E0B"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 6, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="medium" 
                      stroke="#0A4D8C"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: '#0A4D8C', stroke: '#fff', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="low" 
                      stroke="#10B981"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 4, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartBlock>
          )}

          {/* ML Predictions Generated (PieChart + Métricas) */}
          {!isBlockHidden('ml-predictions') && (
          <ChartBlock 
            title="ML Predictions Generated" 
            id="ml-predictions"
            onHide={hideBlock}
            onNext={goToNextBlock}
            onPrevious={goToPreviousBlock}
            isExpanded={expandedBlockId === 'ml-predictions'}
            onExpandChange={(expanded: boolean) => setExpanded(expanded ? 'ml-predictions' : null)}
            canGoBack={canGoBack()}
            canGoNext={canGoNext()}
          >
            <div style={{ 
              width: '100%',
              height: expandedBlockId === 'ml-predictions' ? '100%' : 'auto',
              minHeight: expandedBlockId === 'ml-predictions' ? '100%' : '240px',
              display: 'grid',
              gridTemplateColumns: '140px 1fr 180px',
              gap: '2rem',
              alignItems: 'center',
              padding: '1rem'
            }}>
              {/* Metrics on the left */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.75rem',
                justifyContent: 'center'
              }}>
                {mlPredictionsChart.metrics.map((metric: any, idx: number) => (
                  <div key={idx}>
                    <div style={{ 
                      fontSize: '0.8125rem', 
                      fontWeight: 600, 
                      color: 'rgba(255,255,255,0.95)', 
                      marginBottom: '0.125rem',
                      lineHeight: 1.2
                    }}>
                      {metric.value}
                    </div>
                    <div style={{ 
                      fontSize: '0.6875rem', 
                      color: 'rgba(255,255,255,0.5)', 
                      fontWeight: 300,
                      lineHeight: 1.3
                    }}>
                      {metric.description}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Donut chart in center */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                maxWidth: '200px',
                margin: '0 auto',
                position: 'relative'
              }}>
                <div style={{ 
                  width: expandedBlockId === 'ml-predictions' ? '280px' : '160px', 
                  height: expandedBlockId === 'ml-predictions' ? '280px' : '160px',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <ResponsiveContainer width="100%" height="100%" key={`donut-${expandedBlockId === 'ml-predictions' ? 'expanded' : 'normal'}`}>
                    <PieChart>
                      <Pie
                        data={mlPredictionsChart.chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={expandedBlockId === 'ml-predictions' ? 60 : 45}
                        outerRadius={expandedBlockId === 'ml-predictions' ? 100 : 70}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={8}
                      >
                        {mlPredictionsChart.chartData.map((entry: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke="rgba(15, 17, 23, 0)"
                            strokeWidth={0}
                          />
                        ))}
                      </Pie>
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: '1.5rem', fontWeight: 600, fill: '#fff' }}
                      >
                        {mlPredictionsChart.totalValue}
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
                
                {/* Legend on the right */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.75rem',
                  justifyContent: 'center'
                }}>
                  {mlPredictionsChart.chartData.map((entry: any, index: number) => (
                    <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '3px', 
                        height: '32px',
                        borderRadius: '2px',
                        backgroundColor: entry.color
                      }}></div>
                      <div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: 'rgba(255,255,255,0.95)', 
                          fontWeight: 500, 
                          marginBottom: '0.125rem',
                          lineHeight: 1.2
                        }}>
                          {entry.name}
                        </div>
                        <div style={{ 
                          fontSize: '0.6875rem', 
                          color: 'rgba(255,255,255,0.5)', 
                          fontWeight: 300,
                          lineHeight: 1.3
                        }}>
                          {entry.value > 1000 ? `${(entry.value / 1000).toFixed(0)}K` : entry.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ChartBlock>
          )}
        </div>

        {/* Row 3: Top Hosts Table - Full Width */}
        <div style={{ 
          marginTop: '1.5rem', 
          width: '100%',
          gridColumn: '1 / -1'
        }}>
        {!isBlockHidden('top-hosts') && (
        <ChartBlock 
          title="Top Hosts by Activity (24h)" 
          height="auto" 
          id="top-hosts"
          onHide={hideBlock}
          onNext={goToNextBlock}
          onPrevious={goToPreviousBlock}
          isExpanded={expandedBlockId === 'top-hosts'}
          onExpandChange={(expanded: boolean) => setExpanded(expanded ? 'top-hosts' : null)}
          canGoBack={canGoBack()}
          canGoNext={canGoNext()}
        >
            <div style={{ padding: '1rem 0' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '0.875rem'
              }}>
                <thead>
                  <tr style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'left'
                  }}>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Host ID</th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Event Count</th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Unique Metrics</th>
                  </tr>
                </thead>
                <tbody>
                  {topHosts.slice(0, 6).map((host, index) => (
                    <tr 
                      key={index}
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 500
                      }}>
                        {host.hostId}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(255,255,255,0.7)'
                      }}>
                        {host.formatted_count}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(255,255,255,0.7)'
                      }}>
                        {host.unique_metrics}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </ChartBlock>
        )}

        {/* Incident Trends by Type (LineChart) */}
        {!isBlockHidden('incident-trends-type') && (
        <ChartBlock 
          title="Incident Trends by Type" 
          id="incident-trends-type"
          onHide={hideBlock}
          onNext={goToNextBlock}
          onPrevious={goToPreviousBlock}
          isExpanded={expandedBlockId === 'incident-trends-type'}
          onExpandChange={(expanded: boolean) => setExpanded(expanded ? 'incident-trends-type' : null)}
          canGoBack={canGoBack()}
          canGoNext={canGoNext()}
        >
          <ResponsiveContainer 
            width="100%" 
            height={expandedBlockId === 'incident-trends-type' ? '100%' : 150}
            key={`line-trends-${expandedBlockId === 'incident-trends-type' ? 'expanded' : 'normal'}`}
          >
            <LineChart data={incidentTrendsByType} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="day" 
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(30, 34, 47, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '12px'
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}
              />
              <Line 
                type="monotone" 
                dataKey="proactive" 
                stroke="#2DD4BF"
                name="Proactive"
                strokeWidth={2}
                dot={{ fill: '#2DD4BF', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="reactive" 
                stroke="#F59E0B"
                name="Reactive"
                strokeWidth={2}
                dot={{ fill: '#F59E0B', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartBlock>
        )}

        {/* Incidents by Organization (Table) */}
        {!isBlockHidden('incidents-organization') && (
        <ChartBlock 
          title="Incidents by Organization" 
          id="incidents-organization"
          onHide={hideBlock}
          onNext={goToNextBlock}
          onPrevious={goToPreviousBlock}
          isExpanded={expandedBlockId === 'incidents-organization'}
          onExpandChange={(expanded: boolean) => setExpanded(expanded ? 'incidents-organization' : null)}
          canGoBack={canGoBack()}
          canGoNext={canGoNext()}
        >
            <div style={{ 
              overflowY: 'auto', 
              maxHeight: expandedBlockId === 'incidents-organization' ? 'calc(100% - 20px)' : '150px',
              paddingRight: '0.5rem'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '0.875rem'
              }}>
                <thead style={{ 
                  position: 'sticky', 
                  top: 0, 
                  background: 'rgba(30, 34, 47, 0.95)',
                  zIndex: 1
                }}>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Organization</th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Total</th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Proactive</th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Reactive</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentsByOrganization.slice(0, 10).map((org, index) => (
                    <tr 
                      key={index}
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 500
                      }}>
                        {org.orgId}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(255,255,255,0.7)'
                      }}>
                        {org.total_incidents}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(45, 212, 191, 0.9)'
                      }}>
                        {org.proactive_incidents}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(251, 191, 36, 0.9)'
                      }}>
                        {org.reactive_incidents}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </ChartBlock>
        )}

        {/* Top Metrics by Prediction Volume (Table) */}
        {!isBlockHidden('top-metrics-predictions') && (
        <ChartBlock 
          title="Top Metrics by Prediction Volume" 
          id="top-metrics-predictions"
          onHide={hideBlock}
          onNext={goToNextBlock}
          onPrevious={goToPreviousBlock}
          isExpanded={expandedBlockId === 'top-metrics-predictions'}
          onExpandChange={(expanded: boolean) => setExpanded(expanded ? 'top-metrics-predictions' : null)}
          canGoBack={canGoBack()}
          canGoNext={canGoNext()}
        >
            <div style={{ 
              overflowY: 'auto', 
              maxHeight: expandedBlockId === 'top-metrics-predictions' ? 'calc(100% - 20px)' : '150px',
              paddingRight: '0.5rem'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '0.875rem'
              }}>
                <thead style={{ 
                  position: 'sticky', 
                  top: 0, 
                  background: 'rgba(30, 34, 47, 0.95)',
                  zIndex: 1
                }}>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      textAlign: 'left', 
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Metric</th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Predictions</th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Avg Confidence</th>
                    <th style={{ 
                      padding: '0.75rem 1rem', 
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Proactive</th>
                  </tr>
                </thead>
                <tbody>
                  {topMetricsByPredictions.slice(0, 10).map((metric, index) => (
                    <tr 
                      key={index}
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 500
                      }}>
                        {metric.metric}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(255,255,255,0.7)'
                      }}>
                        {metric.prediction_count}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(147, 197, 253, 0.9)'
                      }}>
                        {(metric.avg_confidence * 100).toFixed(1)}%
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        color: 'rgba(45, 212, 191, 0.9)'
                      }}>
                        {metric.proactive_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </ChartBlock>
        )}
        </div>

        {/* Hidden Blocks Bar */}
        <HiddenBlocksBar 
          hiddenBlocks={getHiddenBlocks()}
          onRestore={showBlock}
          onClearAll={resetHiddenBlocks}
        />

        {/* Chat Assistant */}
        <ChatAssistant 
          dashboardData={dashboardData}
          dashboardType="oficial"
          isOpen={isAssistantOpen}
          onClose={() => setIsAssistantOpen(false)}
        />
      </main>
    </div>
  );
}
