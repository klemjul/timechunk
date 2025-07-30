import type { TimeChunkUnit, TimeChunk } from '@/models';
import type { SelectedUnits } from './TimeChunkViewer';
import { useMemo } from 'react';

interface TimeChunkUnitBoxProps {
  unit: TimeChunkUnit;
  selectedUnits: SelectedUnits;
  timeframes: TimeChunk['timeframes'];
  timeChunk: TimeChunk;
  onClick: () => void;
}

export function TimeChunkUnitBox({
  unit,
  selectedUnits,
  timeframes,
  onClick,
}: TimeChunkUnitBoxProps) {
  const timeframe = timeframes[unit.timeframe];

  const isUnitSelected = useMemo(() => {
    return selectedUnits.some((sUnit) => unit.index === sUnit.index);
  }, [selectedUnits, unit.index]);

  const isUnitInRange = useMemo(() => {
    if (selectedUnits.length !== 2) return false;
    const [first, second] = selectedUnits;
    const minIndex = Math.min(first.index, second.index);
    const maxIndex = Math.max(first.index, second.index);
    return unit.index > minIndex && unit.index < maxIndex;
  }, [selectedUnits, unit.index]);

  return (
    <button
      className={`w-6 h-6 rounded border-2 flex items-center justify-center text-xs font-medium hover:scale-110 transition-transform cursor-pointer ${
        isUnitSelected
          ? 'border-blue-500 ring-2 ring-blue-300 '
          : isUnitInRange
            ? 'border-blue-400 ring-1 ring-blue-200'
            : 'border-gray-300'
      }`}
      style={{ backgroundColor: timeframe?.color || '#f3f4f6' }}
      onClick={onClick}
    ></button>
  );
}
