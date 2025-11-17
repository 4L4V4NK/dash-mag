export const corelyticsTheme = {
  colors: {
    // Cores principais - Paleta Azul Nereidas
    primary: '#0A4D8C',     // Azul escuro Nereidas
    secondary: '#1E5FA8',   // Azul médio Nereidas
    success: '#10B981',     // Verde para indicadores positivos
    danger: '#EF4444',      // Vermelho para alertas/negativos
    
    // Backgrounds
    background: {
      primary: '#0F1117',   // Background principal (navy escuro)
      secondary: '#13151D', // Background secundário
      card: 'rgba(26, 29, 41, 0.7)',  // Background dos cards com transparência
      hover: 'rgba(26, 29, 41, 0.9)', // Hover states
    },
    
    // Texto
    text: {
      primary: 'rgba(255, 255, 255, 0.9)',   // Texto principal
      secondary: 'rgba(255, 255, 255, 0.7)', // Texto secundário
      muted: 'rgba(255, 255, 255, 0.5)',     // Texto desativado
    },

    // Charts - Paleta Azul Nereidas
    chart: {
      grid: 'rgba(255, 255, 255, 0.05)',  // Linhas de grid
      tooltip: 'rgba(26, 29, 41, 0.95)',  // Background do tooltip
      series: [
        '#0A4D8C',  // Série 1 - Azul escuro Nereidas
        '#1E5FA8',  // Série 2 - Azul médio Nereidas
        '#3B7BC4',  // Série 3 - Azul claro Nereidas
        '#4A90E2',  // Série 4 - Azul destaque Nereidas
        '#10B981',  // Série 5 - Verde
        '#3B82F6',  // Série 6 - Azul info
      ]
    }
  },

  // Tipografia
  typography: {
    fontFamily: 'Inter, sans-serif',
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    }
  },

  // Espaçamento
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '2.5rem', // 40px
  },

  // Bordas
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    full: '9999px',
  },

  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },

  // Transições
  transitions: {
    default: '150ms ease-in-out',
    fast: '100ms ease-in-out',
    slow: '300ms ease-in-out',
  },

  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  }
};