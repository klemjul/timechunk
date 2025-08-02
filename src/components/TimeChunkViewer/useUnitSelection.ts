import { useState, useCallback } from 'react';
import type { TimeChunk, TimeChunkUnit, TimeFrame } from '@/models';
import {
  findUnitsInTimeFrame,
  isUnitSelected,
  type SelectedTimeChunkUnits,
} from '@/lib/timeframe';

export function useUnitSelection(timeChunk: TimeChunk) {
  const [selectedUnits, setSelectedUnits] = useState<SelectedTimeChunkUnits>(
    []
  );

  const handleUnitSelection = useCallback(
    (unit: TimeChunkUnit) => {
      setSelectedUnits((current): SelectedTimeChunkUnits => {
        const isSelected = isUnitSelected(current, unit);

        if (isSelected) {
          return [];
        }

        const unitTimeFrame = timeChunk.timeframes[unit.timeframe];
        if (unitTimeFrame) {
          const unitsInTimeframe = findUnitsInTimeFrame(
            unitTimeFrame,
            timeChunk
          );
          if (unitsInTimeframe.length >= 2) {
            return [
              unitsInTimeframe.at(0),
              unitsInTimeframe.at(-1),
              unitTimeFrame,
            ] as [TimeChunkUnit, TimeChunkUnit, TimeFrame];
          }
        }

        if (current.length === 1) {
          const sorted = [current[0], unit].sort((a, b) => a.index - b.index);
          return [sorted[0], sorted[1]] as [TimeChunkUnit, TimeChunkUnit];
        }

        return [unit];
      });
    },
    [timeChunk]
  );

  const clearSelection = useCallback(() => {
    setSelectedUnits([]);
  }, []);

  return {
    selectedUnits,
    handleUnitSelection,
    clearSelection,
  };
}
