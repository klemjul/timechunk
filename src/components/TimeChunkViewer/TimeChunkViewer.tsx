import { useEffect, useState } from 'react';
import type { TimeChunk, TimeChunkUnit } from '@/models';
import { TextH2, TextMuted } from '@/components/ui/typography';
import { getUnitLabel } from '@/lib/time';
import { TimeChunkUnitBox } from './TimeChunkUnitBox';
import { TimeChunkViewerDrawer } from './TimeChunkViewerDrawer';

interface TimeChunkViewerProps {
  timeChunk: TimeChunk;
}

export type SelectedUnits =
  | [TimeChunkUnit]
  | [TimeChunkUnit, TimeChunkUnit]
  | [];

export function TimeChunkViewer({ timeChunk }: TimeChunkViewerProps) {
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnits>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (selectedUnits.length === 0) {
      setIsDrawerOpen(false);
    } else {
      setIsDrawerOpen(true);
    }
  }, [selectedUnits]);

  const handleUnitClick = (unit: TimeChunkUnit) => {
    setSelectedUnits((current): SelectedUnits => {
      const isSelected = current.some((u) => u.index === unit.index);

      if (isSelected) {
        return [];
      }

      if (current.length === 1) {
        const sorted = [current[0], unit].sort((a, b) => a.index - b.index);
        return [sorted[0], sorted[1]] as [TimeChunkUnit, TimeChunkUnit];
      }

      return [unit];
    });
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setSelectedUnits([]);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 pb-30">
        <div className="mb-6">
          <TextH2 className="text-center border-b-0 pb-0">
            {timeChunk.name} in {getUnitLabel(timeChunk.unit)}
          </TextH2>
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-4xl mx-auto px-2">
          <TextMuted>{timeChunk.start.format('MMM D, YYYY')}</TextMuted>

          <div className="flex flex-wrap justify-center gap-2 w-full">
            {timeChunk.units.map((unit) => (
              <TimeChunkUnitBox
                key={unit.index}
                unit={unit}
                selectedUnits={selectedUnits}
                timeframes={timeChunk.timeframes}
                timeChunk={timeChunk}
                onClick={() => handleUnitClick(unit)}
              />
            ))}
          </div>

          <TextMuted>{timeChunk.end.format('MMM D, YYYY')}</TextMuted>
        </div>
      </div>
      <TimeChunkViewerDrawer
        timeChunk={timeChunk}
        selectedUnits={selectedUnits}
        isDrawerOpen={isDrawerOpen}
        onDrawerOpenChange={handleDrawerOpenChange}
      />
    </>
  );
}
