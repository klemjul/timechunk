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
  /** HTML attribute name for unit identification */
  unitIndexAttribute: string;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
}

export function TimeChunkUnitBox({
  unit,
  selectedUnits,
  timeframes,
  previewUnits,
  unitIndexAttribute,
  onPointerDown,
  onPointerUp,
}: TimeChunkUnitBoxProps) {
  const timeframe = timeframes[unit.timeframe];
  const isInPreview = previewUnits.some((pUnit) => pUnit.index === unit.index);

  return (
    <div
      {...{ [unitIndexAttribute]: unit.index }}
      className={`w-4 h-4 border-1 flex items-center justify-center text-xs font-medium hover:scale-110 transition-transform cursor-pointer ${
        isUnitSelected(selectedUnits, unit)
          ? 'border-stone-50 ring-2 ring-stone-950'
          : isUnitInRange(selectedUnits, unit)
            ? 'border-neutral-50 ring-1 ring-neutral-600'
            : isInPreview
              ? 'border-neutral-50 ring-1 ring-neutral-400'
              : 'border-gray-300'
      }`}
      style={{
        backgroundColor: timeframe?.color || '#f3f4f6',
        // fix default browser drag/scroll
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    ></div>
  );
}
