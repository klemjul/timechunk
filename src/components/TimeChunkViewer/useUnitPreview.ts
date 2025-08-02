import { useState, useEffect, useCallback } from 'react';
import type { TimeChunk, TimeChunkUnit } from '@/models';
import type { SelectedTimeChunkUnits } from '@/lib/timeframe';

interface useUnitPreviewOptions {
  timeChunk: TimeChunk;
  selectedUnits: SelectedTimeChunkUnits;
  containerRef: React.RefObject<HTMLDivElement | null>;
  unitIndexAttribute: string;
}

export function useUnitPreview({
  selectedUnits,
  timeChunk,
  containerRef,
  unitIndexAttribute,
}: useUnitPreviewOptions) {
  const [selectedPreviewUnit, setSelectedPreviewUnit] =
    useState<TimeChunkUnit | null>(null);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (selectedUnits.length === 1) {
        const element = document.elementFromPoint(e.clientX, e.clientY);
        const unitIndex = element?.getAttribute(unitIndexAttribute);

        if (unitIndex) {
          const unit = timeChunk.units.find(
            (u) => u.index === parseInt(unitIndex)
          );
          if (unit) {
            setSelectedPreviewUnit(unit);
          }
        }
      }
    },
    [selectedUnits, timeChunk.units, unitIndexAttribute]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('pointermove', handlePointerMove);
    }
    return () => {
      container?.removeEventListener('pointermove', handlePointerMove);
    };
  }, [handlePointerMove, containerRef]);

  const getPreviewUnits = useCallback((): TimeChunkUnit[] => {
    if (selectedUnits.length === 1 && selectedPreviewUnit) {
      const firstSelected = selectedUnits[0];
      const minIndex = Math.min(firstSelected.index, selectedPreviewUnit.index);
      const maxIndex = Math.max(firstSelected.index, selectedPreviewUnit.index);

      return timeChunk.units.filter(
        (unit) => unit.index >= minIndex && unit.index <= maxIndex
      );
    }
    return [];
  }, [selectedUnits, selectedPreviewUnit, timeChunk.units]);

  const clearPreview = useCallback(() => {
    setSelectedPreviewUnit(null);
  }, []);

  return {
    selectedPreviewUnit,
    getPreviewUnits,
    clearPreview,
  };
}
