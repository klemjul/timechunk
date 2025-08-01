import type { TimeChunkUnit, TimeChunk } from '@/models';
import {
  isUnitInRange,
  isUnitSelected,
  type SelectedTimeChunkUnits,
} from '@/lib/timeframe';

interface TimeChunkUnitBoxProps {
  unit: TimeChunkUnit;
  selectedUnits: SelectedTimeChunkUnits;
  timeframes: TimeChunk['timeframes'];
  timeChunk: TimeChunk;
  previewUnits: TimeChunkUnit[];
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function TimeChunkUnitBox({
  unit,
  selectedUnits,
  timeframes,
  previewUnits,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: TimeChunkUnitBoxProps) {
  const timeframe = timeframes[unit.timeframe];
  const isInPreview = previewUnits.some((pUnit) => pUnit.index === unit.index);

  return (
    <div
      className={`w-6 h-6 rounded border-2 flex items-center justify-center text-xs font-medium hover:scale-110 transition-transform cursor-pointer ${
        isUnitSelected(selectedUnits, unit)
          ? 'border-stone-50 ring-2 ring-stone-950'
          : isUnitInRange(selectedUnits, unit)
            ? 'border-neutral-50 ring-1 ring-neutral-600'
            : isInPreview
              ? 'border-neutral-50 ring-1 ring-neutral-400'
              : 'border-gray-300'
      }`}
      style={{ backgroundColor: timeframe?.color || '#f3f4f6' }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    ></div>
  );
}
