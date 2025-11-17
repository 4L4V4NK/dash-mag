/**
 * Bento Grid Layout Hook com Golden Ratio
 * 
 * Hook especializado para o estilo Bento Grid combinado com matemática Golden Ratio.
 * Calcula spans dinâmicos para criar layouts compactos e harmoniosos.
 * 
 * Características:
 * - Grid Fibonacci: 5 → 8 → 13 → 21 colunas
 * - Proporções Golden Ratio: 8/13 ≈ Φ⁻¹ (0.618)
 * - Bento Style: KPIs agrupados, charts lado a lado
 * - 7 painéis visíveis simultaneamente
 * 
 * @author Nereidas AI Monitoring - Design System
 * @version 1.0.0
 * @date 16 de Novembro de 2025
 */

import { useGoldenBreakpoint } from './useGoldenBreakpoint';

export interface BentoGridLayout {
  // KPIs spans (4 cards em container Bento)
  getKPISpan: () => number;
  
  // Tabela Events Processed (lado direito no desktop)
  getEventTableSpan: () => number;
  
  // Charts médios/grandes
  getChartSpan: (size: 'large' | 'medium') => number;
  
  // Heights Fibonacci para diferentes tipos de blocos
  heights: {
    kpi: number;      // 89px - KPI cards
    small: number;    // 144px - Small charts/tables
    medium: number;   // 233px - Medium charts ✅ Default
    large: number;    // 377px - Large charts
    xl: number;       // 610px - Extra large
  };
  
  // Gap atual baseado no breakpoint
  gap: number;
  
  // Informações do grid atual
  gridInfo: {
    columns: number;
    gap: number;
    breakpoint: string;
  };
}

/**
 * Hook principal do Bento Grid Layout
 */
export function useBentoGridLayout(): BentoGridLayout {
  const { breakpoint, columns, gap } = useGoldenBreakpoint();
  
  /**
   * Calcula span para KPI cards
   * 
   * Estratégia Bento:
   * - Mobile: Full width (1 card por linha)
   * - Tablet: Half width (2 cards por linha)
   * - Desktop: Quarter width (4 cards em 2x2 grid)
   * - Wide/Ultra: Spacious (mais espaço entre cards)
   */
  const getKPISpan = (): number => {
    switch (breakpoint) {
      case 'mobile':
        return 5;   // Full width (5/5 = 100%)
      
      case 'tablet':
        return 4;   // Half width (4/8 = 50%)
      
      case 'desktop':
        return 3;   // ~Quarter (3/13 = 23%)
                    // 4 KPIs = 12 cols, sobra 1 col
      
      case 'wide':
        return 5;   // Spacious (5/21 = 23.8%)
                    // 4 KPIs = 20 cols, sobra 1 col
      
      case 'ultra':
        return 5;   // Ultra spacious (mesmo que wide)
      
      default:
        return 3;
    }
  };
  
  /**
   * Calcula span para Events Table
   * 
   * Estratégia:
   * - Mobile/Tablet: Full width
   * - Desktop: Lado direito (complementa KPIs)
   * - Wide/Ultra: Destaque maior
   */
  const getEventTableSpan = (): number => {
    switch (breakpoint) {
      case 'mobile':
        return 5;   // Full width
      
      case 'tablet':
        return 8;   // Full width
      
      case 'desktop':
        return 7;   // 7/13 = 53.8%
                    // Complementa 3+3 KPIs (6 cols)
                    // Total row: 6 + 7 = 13 ✅
      
      case 'wide':
        return 13;  // Prominent (13/21 = 61.9% ≈ Φ⁻¹)
      
      case 'ultra':
        return 13;  // Same as wide
      
      default:
        return 7;
    }
  };
  
  /**
   * Calcula span para Charts
   * 
   * Golden Ratio Proportions:
   * - Large: 8/13 ≈ 0.615 ≈ Φ⁻¹ (0.618) ✅
   * - Medium: 5/13 ≈ 0.385 ≈ 1-Φ⁻¹ (0.382) ✅
   * 
   * Juntos formam: 8 + 5 = 13 (row completa)
   */
  const getChartSpan = (size: 'large' | 'medium'): number => {
    if (size === 'large') {
      switch (breakpoint) {
        case 'mobile':
          return 5;   // Full width
        
        case 'tablet':
          return 8;   // Full width
        
        case 'desktop':
          return 8;   // Golden Ratio ✅
                      // 8/13 = 0.615 ≈ Φ⁻¹
        
        case 'wide':
          return 13;  // Prominent
                      // 13/21 = 0.619 ≈ Φ⁻¹
        
        case 'ultra':
          return 13;  // Same as wide
        
        default:
          return 8;
      }
    } else { // medium
      switch (breakpoint) {
        case 'mobile':
          return 5;   // Full width
        
        case 'tablet':
          return 8;   // Full width
        
        case 'desktop':
          return 5;   // Golden complement ✅
                      // 5/13 = 0.385 ≈ 1-Φ⁻¹
                      // 8 + 5 = 13 (row completa)
        
        case 'wide':
          return 8;   // 8/21 = 0.381 ≈ 1-Φ⁻¹
                      // 13 + 8 = 21 (row completa)
        
        case 'ultra':
          return 8;   // Same as wide
        
        default:
          return 5;
      }
    }
  };
  
  /**
   * Heights Fibonacci para diferentes tipos de blocos
   * 
   * Sequência: 89, 144, 233, 377, 610 (F11-F15)
   */
  const heights = {
    kpi: 89,      // F(11) - Compact KPI cards
    small: 144,   // F(12) - Small charts/tables
    medium: 233,  // F(13) - Medium charts (default) ✅
    large: 377,   // F(14) - Large detailed charts
    xl: 610,      // F(15) - Extra large (rare)
  };
  
  return {
    getKPISpan,
    getEventTableSpan,
    getChartSpan,
    heights,
    gap,
    gridInfo: {
      columns,
      gap,
      breakpoint,
    },
  };
}

/**
 * Utilitários auxiliares
 */
export const BentoGridHelpers = {
  /**
   * Verifica se proporção está próxima do Golden Ratio
   */
  isGoldenRatio: (numerator: number, denominator: number): boolean => {
    const PHI_INV = 0.618033988749895;
    const ratio = numerator / denominator;
    const tolerance = 0.01; // 1% tolerance
    
    return Math.abs(ratio - PHI_INV) < tolerance;
  },
  
  /**
   * Calcula quantos blocos cabem em uma row
   */
  blocksPerRow: (span: number, totalColumns: number): number => {
    return Math.floor(totalColumns / span);
  },
  
  /**
   * Valida se soma de spans completa a row sem overflow
   */
  validateRow: (spans: number[], totalColumns: number): boolean => {
    const sum = spans.reduce((a, b) => a + b, 0);
    return sum === totalColumns;
  },
  
  /**
   * Sugere layout para N blocos em grid Fibonacci
   */
  suggestLayout: (blockCount: number, columns: number): string => {
    if (columns === 13) {
      // Desktop: Golden patterns
      if (blockCount === 2) return '8 + 5 (Golden Ratio)';
      if (blockCount === 3) return '5 + 5 + 3';
      if (blockCount === 4) return '3 + 3 + 3 + 4';
    }
    
    return `${blockCount} blocos em ${columns} colunas`;
  },
};

/**
 * Exemplo de uso:
 * 
 * ```tsx
 * const { getKPISpan, getChartSpan, heights, gridInfo } = useBentoGridLayout();
 * 
 * // KPIs em container Bento
 * <div className={styles.kpisContainer}>
 *   <KPICard style={{ gridColumn: `span ${getKPISpan()}` }} />
 *   <KPICard style={{ gridColumn: `span ${getKPISpan()}` }} />
 *   <KPICard style={{ gridColumn: `span ${getKPISpan()}` }} />
 *   <KPICard style={{ gridColumn: `span ${getKPISpan()}` }} />
 * </div>
 * 
 * // Charts com Golden Ratio
 * <ChartBlock 
 *   style={{ 
 *     gridColumn: `span ${getChartSpan('large')}`,
 *     height: `${heights.medium}px`
 *   }} 
 * />
 * <ChartBlock 
 *   style={{ 
 *     gridColumn: `span ${getChartSpan('medium')}`,
 *     height: `${heights.medium}px`
 *   }} 
 * />
 * 
 * // Info do grid
 * <span>{gridInfo.columns} cols • {gridInfo.gap}px gap • {gridInfo.breakpoint}</span>
 * ```
 */
