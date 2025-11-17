import { corelyticsTheme } from './corelytics-theme';

export const dashboardStyles = {
  container: {
    background: corelyticsTheme.colors.background.primary,
    minHeight: '100vh',
    color: corelyticsTheme.colors.text.primary,
    padding: `0 ${corelyticsTheme.spacing.xl}`
  },
  
  card: {
    background: 'rgba(22, 27, 34, 0.7)',
    borderRadius: '12px',
    padding: '24px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },

  tooltip: {
    background: 'rgba(22, 27, 34, 0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    color: corelyticsTheme.colors.text.primary,
    padding: '8px 12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    fontSize: '12px'
  },

  legend: {
    container: {
      position: 'absolute' as const,
      right: '20px',
      top: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(22, 27, 34, 0.7)',
      padding: '4px 12px',
      borderRadius: '4px'
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%'
    }
  },

  chartContainer: {
    height: 'calc(100% - 40px)',
    position: 'relative' as const
  },

  grid: {
    display: 'grid',
    gap: corelyticsTheme.spacing.lg
  }
};