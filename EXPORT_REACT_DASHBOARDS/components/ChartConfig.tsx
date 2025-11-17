import React from 'react';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  valueFormatter?: (value: number) => string;
}

export const ChartTooltip = ({ active, payload, label, valueFormatter }: TooltipProps) => {
  if (!active || !payload || !payload.length) return null;

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
      {label && (
        <div style={{ 
          fontSize: '0.75rem', 
          fontWeight: 600, 
          color: 'rgba(255,255,255,0.9)', 
          marginBottom: '0.5rem' 
        }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: entry.color || '#0A4D8C' 
            }}></div>
            <span style={{ 
              fontSize: '0.6875rem', 
              color: 'rgba(255,255,255,0.6)', 
              fontWeight: 300 
            }}>
              {entry.name}
            </span>
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: 'rgba(255,255,255,0.95)',
              marginLeft: 'auto'
            }}>
              {valueFormatter ? valueFormatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Configurações padrão para os gráficos seguindo o Design System
export const chartDefaults = {
  cartesianGrid: {
    vertical: false,
    stroke: 'rgba(255,255,255,0.05)',
    strokeDasharray: '2 2'
  },
  xAxis: {
    stroke: 'rgba(255,255,255,0.3)',
    axisLine: false,
    tickLine: false,
    tick: { fill: 'rgba(255,255,255,0.5)', fontSize: 12 }
  },
  yAxis: {
    stroke: 'rgba(255,255,255,0.3)',
    axisLine: false,
    tickLine: false,
    tick: { fill: 'rgba(255,255,255,0.5)', fontSize: 12 }
  },
  tooltip: {
    cursor: { fill: 'rgba(255,255,255,0.05)' }
  }
};

// Cores padrão para gráficos seguindo a paleta Nereidas
export const chartColors = {
  primary: '#0A4D8C',
  secondary: '#1E5FA8',
  accent1: '#3B7BC4',
  accent2: '#4A90E2',
  accent3: '#6BA5E7',
  accent4: '#87BFEC',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6'
};

// Array de cores para séries múltiplas
export const chartSeriesColors = [
  chartColors.primary,
  chartColors.secondary,
  chartColors.accent1,
  chartColors.accent2,
  chartColors.accent3,
  chartColors.accent4
];
