/**
 * 🌟 GOLDEN BREAKPOINT HOOK
 * 
 * Hook para responsividade baseada em Fibonacci
 * Retorna configurações de grid adaptativas por breakpoint
 * 
 * Breakpoints Fibonacci: 377px, 610px, 987px, 1597px, 2584px
 * Colunas Fibonacci: 3, 5, 8, 13, 21
 * Gap Fibonacci: 8px, 13px, 21px, 34px
 */

import { useState, useEffect } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide' | 'ultra';

interface BreakpointConfig {
  name: Breakpoint;
  minWidth: number;
  columns: number; // Fibonacci
  gap: number;     // Fibonacci (px)
}

// Configurações Fibonacci para cada breakpoint
const BREAKPOINT_CONFIGS: BreakpointConfig[] = [
  { name: 'mobile', minWidth: 0, columns: 3, gap: 8 },       // Fibonacci
  { name: 'tablet', minWidth: 610, columns: 5, gap: 13 },    // Fibonacci
  { name: 'desktop', minWidth: 987, columns: 8, gap: 21 },   // Fibonacci
  { name: 'wide', minWidth: 1597, columns: 13, gap: 21 },    // Fibonacci
  { name: 'ultra', minWidth: 2584, columns: 21, gap: 34 },   // Fibonacci
];

interface GoldenBreakpointReturn {
  breakpoint: Breakpoint;
  columns: number;
  gap: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  isUltra: boolean;
  width: number;
}

/**
 * Hook para gerenciar breakpoints Golden Ratio
 * 
 * @example
 * ```tsx
 * const { columns, gap, isDesktop } = useGoldenBreakpoint();
 * 
 * return (
 *   <div style={{
 *     display: 'grid',
 *     gridTemplateColumns: `repeat(${columns}, 1fr)`,
 *     gap: `${gap}px`
 *   }}>
 *     {children}
 *   </div>
 * );
 * ```
 */
export const useGoldenBreakpoint = (): GoldenBreakpointReturn => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointConfig>(
    BREAKPOINT_CONFIGS[0]
  );
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    // Função para atualizar breakpoint baseado na largura
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      // Encontra o breakpoint correto (maior que ainda atende a largura)
      const newBreakpoint = BREAKPOINT_CONFIGS
        .slice()
        .reverse()
        .find(bp => width >= bp.minWidth) || BREAKPOINT_CONFIGS[0];
      
      if (newBreakpoint.name !== currentBreakpoint.name) {
        setCurrentBreakpoint(newBreakpoint);
      }
    };

    // Atualiza na montagem
    updateBreakpoint();

    // Listener para resize com debounce Fibonacci (144ms)
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateBreakpoint, 144); // Fibonacci timing
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [currentBreakpoint.name]);

  return {
    breakpoint: currentBreakpoint.name,
    columns: currentBreakpoint.columns,
    gap: currentBreakpoint.gap,
    isMobile: currentBreakpoint.name === 'mobile',
    isTablet: currentBreakpoint.name === 'tablet',
    isDesktop: currentBreakpoint.name === 'desktop',
    isWide: currentBreakpoint.name === 'wide',
    isUltra: currentBreakpoint.name === 'ultra',
    width: windowWidth,
  };
};

/**
 * Calcula colunas ideais baseado em largura
 * Retorna sempre um número Fibonacci
 */
export const calculateFibonacciColumns = (
  containerWidth: number,
  minColumnWidth: number = 144 // Fibonacci
): number => {
  const fibSequence = [3, 5, 8, 13, 21, 34];
  const idealColumns = Math.floor(containerWidth / minColumnWidth);
  
  // Encontra o Fibonacci mais próximo
  return fibSequence.reduce((prev, curr) =>
    Math.abs(curr - idealColumns) < Math.abs(prev - idealColumns) ? curr : prev
  );
};

/**
 * Calcula gap proporcional baseado no número de elementos
 */
export const calculateGoldenGap = (
  elementCount: number,
  baseGap: number = 21 // Fibonacci
): number => {
  const fibonacciGaps = [34, 21, 13, 8, 5];
  
  if (elementCount <= 4) return fibonacciGaps[0]; // 34px
  if (elementCount <= 6) return fibonacciGaps[1]; // 21px
  if (elementCount <= 8) return fibonacciGaps[2]; // 13px
  if (elementCount <= 12) return fibonacciGaps[3]; // 8px
  return fibonacciGaps[4]; // 5px
};

/**
 * Calcula altura proporcional mantendo Golden Ratio
 */
export const calculateGoldenHeight = (width: number): number => {
  return Math.round(width / 1.618);
};

/**
 * Retorna font size responsivo baseado em viewport
 */
export const getResponsiveFontSize = (
  baseFontSize: number,
  viewportWidth: number
): number => {
  const fibonacciSizes = [8, 13, 21, 34, 55, 89];
  
  // Escala baseada em viewport
  let scale = 1;
  if (viewportWidth < 610) scale = 0.618; // Mobile: reduz para Φ-1
  else if (viewportWidth < 987) scale = 0.8;
  else if (viewportWidth >= 1597) scale = 1.2;
  
  const targetSize = baseFontSize * scale;
  
  // Encontra Fibonacci mais próximo
  return fibonacciSizes.reduce((prev, curr) =>
    Math.abs(curr - targetSize) < Math.abs(prev - targetSize) ? curr : prev
  );
};
