'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Maximize2, Minimize2, EyeOff } from 'lucide-react';
import styles from './ChartBlock.module.css';

interface ChartBlockProps {
  title: string;
  subtitle?: string; // Novo: subtítulo opcional
  children: React.ReactNode;
  action?: boolean;
  onActionClick?: () => void;
  height?: string | number;
  id?: string;
  className?: string;
  gridColumn?: string; // Novo: suporte para grid-column (Golden Ratio)
  onHide?: (id: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  canGoBack?: boolean;
  canGoNext?: boolean;
}

export function ChartBlock({ 
  title,
  subtitle, // Novo
  children, 
  action = true, 
  onActionClick,
  height = '240px',
  id = '',
  className = '',
  gridColumn, // Novo: suporte para Golden Ratio grid
  onHide,
  onNext,
  onPrevious,
  isExpanded: externalExpanded,
  onExpandChange,
  canGoBack = false,
  canGoNext = true
}: ChartBlockProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const isExpanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;

  useEffect(() => {
    if (externalExpanded !== undefined && externalExpanded !== internalExpanded) {
      setInternalExpanded(externalExpanded);
    }
  }, [externalExpanded, internalExpanded]);

  const handleExpand = () => {
    const newExpanded = !isExpanded;
    setInternalExpanded(newExpanded);
    onExpandChange?.(newExpanded);
  };

  const handleHide = () => {
    if (onHide && id) {
      setIsHiding(true);
      // Aguarda a animação antes de ocultar
      setTimeout(() => {
        onHide(id);
        setIsHiding(false);
      }, 400);
    }
  };

  const handleNext = () => {
    if (isExpanded && onNext) {
      onNext();
    } else if (onActionClick) {
      onActionClick();
    }
  };

  const handlePrevious = () => {
    if (isExpanded && onPrevious) {
      onPrevious();
    }
  };

  return (
    <>
      {isExpanded && <div className={styles.backdrop} onClick={handleExpand} />}
      <div 
        className={`${styles.chartBlock} ${isExpanded ? styles.expanded : ''} ${isHiding ? styles.hiding : ''} ${className}`}
        style={isExpanded ? { 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          height: '90vh',
          zIndex: 1001,
          maxWidth: '1600px'
        } : gridColumn ? { gridColumn } : {}} // Aplica gridColumn quando não expandido
      >
        <div className={styles.chartHeader}>
          <div className={styles.chartTitleWrapper}>
            <span className={styles.chartTitle}>{title}</span>
            {subtitle && <span className={styles.chartSubtitle}>{subtitle}</span>}
          </div>
          <div className={styles.chartActions}>
            {onHide && !isExpanded && (
              <button 
                className={styles.chartActionButton} 
                onClick={handleHide}
                title="Ocultar bloco"
              >
                <EyeOff size={14} />
              </button>
            )}
            <button 
              className={styles.chartActionButton} 
              onClick={handleExpand}
              title={isExpanded ? "Minimizar" : "Expandir"}
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            {isExpanded && canGoBack && (
              <button 
                className={`${styles.chartAction} ${styles.chartActionExpanded}`}
                onClick={handlePrevious}
                title="Card anterior"
              >
                <ArrowLeft size={14} />
              </button>
            )}
            {(action || isExpanded) && canGoNext && (
              <button 
                className={`${styles.chartAction} ${isExpanded ? styles.chartActionExpanded : ''}`}
                onClick={handleNext}
                title={isExpanded ? "Próximo card" : "Ver detalhes"}
              >
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
        <div 
          className={styles.chartContainer} 
          style={{ 
            height: isExpanded ? 'calc(100% - 3rem)' : height, 
            minHeight: isExpanded ? 'calc(100% - 3rem)' : height 
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
