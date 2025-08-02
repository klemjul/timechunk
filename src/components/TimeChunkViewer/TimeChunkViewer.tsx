import { useEffect, useState, useRef, useCallback } from 'react';
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
import { useMobileDetection } from '@/hooks/useMobileDetection';

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
  const [selectedPreviewUnit, setSelectedPreviewUnit] =
    useState<TimeChunkUnit | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();

  // manage drawer opening
  useEffect(() => {
    if (selectedUnits.length === 0) {
      setIsDrawerOpen(false);
      setSelectedPreviewUnit(null);
    } else {
      setIsDrawerOpen(true);
    }
  }, [selectedUnits]);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (selectedUnits.length === 1) {
        const element = document.elementFromPoint(e.clientX, e.clientY);
        const unitIndex = element?.getAttribute('data-unit-index');

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
    [selectedUnits, timeChunk.units]
  );

  // manage preview unit selection
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('pointermove', handlePointerMove);
    }
    return () => {
      container?.removeEventListener('pointermove', handlePointerMove);
    };
  }, [handlePointerMove]);

  const handleUnitSelection = (unit: TimeChunkUnit) => {
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
        setSelectedPreviewUnit(null);
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

  const handlePointerDown = (unit: TimeChunkUnit) => {
    handleUnitSelection(unit);
  };

  const handlePointerUp = () => {
    if (isMobile && selectedUnits.length === 1 && selectedPreviewUnit) {
      handleUnitSelection(selectedPreviewUnit);
      setSelectedPreviewUnit(null);
    }
  };

  const getPreviewUnits = (): TimeChunkUnit[] => {
    if (selectedUnits.length === 1 && selectedPreviewUnit) {
      const firstSelected = selectedUnits[0];
      const minIndex = Math.min(firstSelected.index, selectedPreviewUnit.index);
      const maxIndex = Math.max(firstSelected.index, selectedPreviewUnit.index);

      return timeChunk.units.filter(
        (unit) => unit.index >= minIndex && unit.index <= maxIndex
      );
    }
    return [];
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

          <div
            ref={containerRef}
            className="flex flex-wrap justify-center gap-2 w-full"
          >
            {timeChunk.units.map((unit) => (
              <TimeChunkUnitBox
                key={unit.index}
                unit={unit}
                selectedUnits={selectedUnits}
                timeframes={timeChunk.timeframes}
                timeChunk={timeChunk}
                previewUnits={getPreviewUnits()}
                onPointerDown={() => handlePointerDown(unit)}
                onPointerUp={handlePointerUp}
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
