'use client';

import React from 'react';
import { Eye, X } from 'lucide-react';
import styles from './HiddenBlocksBar.module.css';

interface HiddenBlock {
  id: string;
  title: string;
}

interface HiddenBlocksBarProps {
  hiddenBlocks: HiddenBlock[];
  onRestore: (id: string) => void;
  onClearAll: () => void;
}

export function HiddenBlocksBar({ hiddenBlocks, onRestore, onClearAll }: HiddenBlocksBarProps) {
  if (hiddenBlocks.length === 0) return null;

  return (
    <div className={styles.hiddenBar}>
      <div className={styles.hiddenBarContent}>
        <div className={styles.hiddenBarHeader}>
          <span className={styles.hiddenBarTitle}>
            Blocos Ocultos ({hiddenBlocks.length})
          </span>
          <button 
            className={styles.clearAllButton}
            onClick={onClearAll}
            title="Restaurar todos"
          >
            Restaurar Todos
          </button>
        </div>
        <div className={styles.hiddenBlocksList}>
          {hiddenBlocks.map((block) => (
            <div key={block.id} className={styles.hiddenBlockItem}>
              <span className={styles.hiddenBlockTitle}>{block.title}</span>
              <button
                className={styles.restoreButton}
                onClick={() => onRestore(block.id)}
                title="Restaurar bloco"
              >
                <Eye size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
