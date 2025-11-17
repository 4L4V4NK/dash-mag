'use client';

import { useState, useCallback } from 'react';

export interface BlockInfo {
  id: string;
  title: string;
}

export function useChartBlocks(blocks: BlockInfo[]) {
  const [hiddenBlocks, setHiddenBlocks] = useState<Set<string>>(new Set());
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);

  const hideBlock = useCallback((id: string) => {
    setHiddenBlocks(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  const showBlock = useCallback((id: string) => {
    setHiddenBlocks(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const isBlockHidden = useCallback((id: string) => {
    return hiddenBlocks.has(id);
  }, [hiddenBlocks]);

  const getVisibleBlocks = useCallback(() => {
    return blocks.filter(block => !hiddenBlocks.has(block.id));
  }, [blocks, hiddenBlocks]);

  const getHiddenBlocks = useCallback(() => {
    return blocks.filter(block => hiddenBlocks.has(block.id));
  }, [blocks, hiddenBlocks]);

  const goToNextBlock = useCallback(() => {
    const visibleBlocks = getVisibleBlocks();
    if (!expandedBlockId || visibleBlocks.length === 0) return;

    const currentIndex = visibleBlocks.findIndex(b => b.id === expandedBlockId);
    if (currentIndex >= 0 && currentIndex < visibleBlocks.length - 1) {
      const nextBlock = visibleBlocks[currentIndex + 1];
      setExpandedBlockId(nextBlock.id);
      return nextBlock.id;
    }
    return null;
  }, [expandedBlockId, getVisibleBlocks]);

  const goToPreviousBlock = useCallback(() => {
    const visibleBlocks = getVisibleBlocks();
    if (!expandedBlockId || visibleBlocks.length === 0) return;

    const currentIndex = visibleBlocks.findIndex(b => b.id === expandedBlockId);
    if (currentIndex > 0) {
      const previousBlock = visibleBlocks[currentIndex - 1];
      setExpandedBlockId(previousBlock.id);
      return previousBlock.id;
    }
    return null;
  }, [expandedBlockId, getVisibleBlocks]);

  const canGoNext = useCallback(() => {
    const visibleBlocks = getVisibleBlocks();
    if (!expandedBlockId) return false;
    const currentIndex = visibleBlocks.findIndex(b => b.id === expandedBlockId);
    return currentIndex >= 0 && currentIndex < visibleBlocks.length - 1;
  }, [expandedBlockId, getVisibleBlocks]);

  const canGoBack = useCallback(() => {
    const visibleBlocks = getVisibleBlocks();
    if (!expandedBlockId) return false;
    const currentIndex = visibleBlocks.findIndex(b => b.id === expandedBlockId);
    return currentIndex > 0;
  }, [expandedBlockId, getVisibleBlocks]);

  const setExpanded = useCallback((id: string | null) => {
    setExpandedBlockId(id);
  }, []);

  const resetHiddenBlocks = useCallback(() => {
    setHiddenBlocks(new Set());
  }, []);

  return {
    hiddenBlocks,
    hideBlock,
    showBlock,
    isBlockHidden,
    goToNextBlock,
    goToPreviousBlock,
    canGoNext,
    canGoBack,
    resetHiddenBlocks,
    expandedBlockId,
    setExpanded,
    getVisibleBlocks,
    getHiddenBlocks,
    visibleBlocksCount: blocks.length - hiddenBlocks.size
  };
}
