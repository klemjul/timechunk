import { useEffect, useState } from 'react';
import type { TimeChunk, TimeChunkUnit, TimeFrame } from '@/models';
import { TextH2, TextMuted } from '@/components/ui/typography';
import { getUnitLabel } from '@/lib/time';
import { TimeChunkUnitBox } from './TimeChunkUnitBox';
import { TimeChunkViewerDrawer } from './TimeChunkViewerDrawer';
import {
  findUnitsInTimeFrame,
  isUnitSelected,
  type SelectedTimeChunkUnits,
} from '@/lib/timeframe';

interface TimeChunkViewerProps {
  timeChunk: TimeChunk;
  onTimeChunkUpdate?: (timeChunk: TimeChunk) => void;
}

export function TimeChunkViewer({
  timeChunk,
  onTimeChunkUpdate,
}: TimeChunkViewerProps) {
  const [selectedUnits, setSelectedUnits] = useState<SelectedTimeChunkUnits>(
    []
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hoveredUnit, setHoveredUnit] = useState<TimeChunkUnit | null>(null);

  const getPreviewUnits = (): TimeChunkUnit[] => {
    if (selectedUnits.length === 1 && hoveredUnit) {
      const firstSelected = selectedUnits[0];
      const minIndex = Math.min(firstSelected.index, hoveredUnit.index);
      const maxIndex = Math.max(firstSelected.index, hoveredUnit.index);

      return timeChunk.units.filter(
        (unit) => unit.index >= minIndex && unit.index <= maxIndex
      );
    }
    return [];
  };

  useEffect(() => {
    if (selectedUnits.length === 0) {
      setIsDrawerOpen(false);
    } else {
      setIsDrawerOpen(true);
    }
  }, [selectedUnits]);

  const handleUnitClick = (unit: TimeChunkUnit) => {
    setSelectedUnits((current): SelectedTimeChunkUnits => {
      const isSelected = isUnitSelected(current, unit);

      if (isSelected) {
        return [];
      }

      const unitTimeFrame = timeChunk.timeframes[unit.timeframe];
      if (unitTimeFrame) {
        const unitsInTimeframe = findUnitsInTimeFrame(unitTimeFrame, timeChunk);
        if (unitsInTimeframe.length > 2) {
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
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setSelectedUnits([]);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 pb-100 pt-20">
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
                previewUnits={getPreviewUnits()}
                onClick={() => handleUnitClick(unit)}
                onMouseEnter={() => setHoveredUnit(unit)}
                onMouseLeave={() => setHoveredUnit(null)}
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
        onTimeChunkUpdate={onTimeChunkUpdate}
      />
    </>
  );
}
