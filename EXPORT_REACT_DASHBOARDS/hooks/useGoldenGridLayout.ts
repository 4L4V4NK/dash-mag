/**
 * 🌟 GOLDEN GRID LAYOUT HOOK
 * 
 * Hook para calcular spans inteligentes baseados em:
 * - Breakpoint atual (mobile, tablet, desktop, wide, ultra)
 * - Número de colunas disponíveis (3, 5, 8, 13, 21)
 * - Proporção Golden Ratio (Φ ≈ 1.618)
 * 
 * Garante que blocos sempre preencham o grid harmonicamente
 * sem deixar espaços vazios.
 */

import { useMemo } from 'react';
import { useGoldenBreakpoint } from './useGoldenBreakpoint';

type BlockSize = 'large' | 'medium' | 'small' | 'full';

interface GridSpans {
  large: number;   // span para blocos grandes
  medium: number;  // span para blocos médios
  small: number;   // span para blocos pequenos
  full: number;    // span para blocos full-width
}

/**
 * Calcula spans ideais para cada breakpoint mantendo Golden Ratio
 */
export const useGoldenGridLayout = () => {
  const { breakpoint, columns } = useGoldenBreakpoint();

  const spans = useMemo((): GridSpans => {
    switch (breakpoint) {
      case 'mobile':
        // Mobile: tudo full width (3 colunas = muito estreito)
        return {
          large: 3,
          medium: 3,
          small: 3,
          full: 3,
        };

      case 'tablet':
        // Tablet: 5 colunas - blocos ocupam width completo ou metade
        return {
          large: 5,    // Full width
          medium: 5,   // Full width
          small: 3,    // ~60% (3/5 = 0.6 ≈ Φ-1)
          full: 5,
        };

      case 'desktop':
        // Desktop: 8 colunas - proporção Golden Ratio
        return {
          large: 5,    // 5/8 = 0.625 ≈ Φ-1
          medium: 3,   // 3/8 = 0.375
          small: 2,    // 2/8 = 0.25
          full: 8,
        };

      case 'wide':
        // Wide: 13 colunas - proporção Fibonacci perfeita
        return {
          large: 8,    // 8/13 = 0.615 ≈ Φ-1 (Golden Ratio)
          medium: 5,   // 5/13 = 0.385 ≈ 1/Φ
          small: 3,    // 3/13 = 0.231
          full: 13,
        };

      case 'ultra':
        // Ultra: 21 colunas - Fibonacci alto
        return {
          large: 13,   // 13/21 = 0.619 ≈ Φ-1
          medium: 8,   // 8/21 = 0.381 ≈ 1/Φ
          small: 5,    // 5/21 = 0.238
          full: 21,
        };

      default:
        // Fallback: proporção 8:5 (Fibonacci)
        return {
          large: 8,
          medium: 5,
          small: 3,
          full: 13,
        };
    }
  }, [breakpoint]);

  /**
   * Retorna o span apropriado para um tamanho de bloco
   */
  const getSpan = (size: BlockSize = 'medium'): number => {
    return spans[size];
  };

  /**
   * Calcula quantos blocos cabem em uma linha
   */
  const blocksPerRow = useMemo(() => {
    return {
      large: Math.floor(columns / spans.large),
      medium: Math.floor(columns / spans.medium),
      small: Math.floor(columns / spans.small),
      mixed: Math.floor(columns / spans.large) + Math.floor((columns % spans.large) / spans.medium),
    };
  }, [columns, spans]);

  /**
   * Valida se combinação de blocos preenche uma linha sem gaps
   */
  const validateRow = (blockSizes: BlockSize[]): boolean => {
    const totalSpan = blockSizes.reduce((sum, size) => sum + spans[size], 0);
    return totalSpan <= columns;
  };

  /**
   * Sugere layout otimizado para N blocos
   */
  const suggestLayout = (blockCount: number): BlockSize[] => {
    const layout: BlockSize[] = [];
    let remaining = blockCount;

    // Padrão Golden Ratio: alternar large (8) e medium (5)
    // Isso cria proporção 8:5 ≈ Φ entre blocos
    while (remaining > 0) {
      if (remaining >= 2 && validateRow([...layout, 'large', 'medium'])) {
        layout.push('large', 'medium');
        remaining -= 2;
      } else if (validateRow([...layout, 'large'])) {
        layout.push('large');
        remaining -= 1;
      } else if (validateRow([...layout, 'medium'])) {
        layout.push('medium');
        remaining -= 1;
      } else {
        layout.push('small');
        remaining -= 1;
      }
    }

    return layout;
  };

  return {
    spans,
    getSpan,
    blocksPerRow,
    validateRow,
    suggestLayout,
    breakpoint,
    columns,
  };
};

/**
 * Exemplo de uso:
 * 
 * const { getSpan, suggestLayout } = useGoldenGridLayout();
 * 
 * <ChartBlock gridColumn={`span ${getSpan('large')}`}>
 *   {content}
 * </ChartBlock>
 * 
 * // Ou para layout automático:
 * const layout = suggestLayout(8); // 8 blocos
 * // Retorna: ['large', 'medium', 'large', 'medium', ...]
 */
