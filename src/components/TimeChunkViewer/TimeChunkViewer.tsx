import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import type { TimeChunk, TimeChunkUnit, TimeFrame } from '@/models';
import { TextH2, TextMuted } from '@/components/ui/typography';
import {
  getUnitLabel,
  getUnitByLine,
  getYearForUnitIndex,
  formatHistoricalYear,
} from '@/lib/time';
import { format } from 'date-fns';
import { TimeChunkUnitBox } from './TimeChunkUnitBox';
import { TimeChunkViewerDrawer } from './TimeChunkViewerDrawer';
import {
  findUnitsInTimeFrame,
  isUnitSelected,
  type SelectedTimeChunkUnits,
} from '@/lib/timeframe';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useBreakpoint } from '@/hooks/useBreakpoint';

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
  const breakpoint = useBreakpoint();

  const isDeviceLarge = useMemo(() => {
    return ['lg', 'xl', '2xl'].includes(breakpoint ?? 'sm');
  }, [breakpoint]);

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

  const unitsPerLine = getUnitByLine(timeChunk.unit)[isDeviceLarge ? 0 : 1];
  const totalLines = Math.ceil(timeChunk.units.length / unitsPerLine);

  const getYearMarkerForLine = (lineIndex: number): string | null => {
    if (lineIndex % 5 === 0) {
      const unitIndex = lineIndex * unitsPerLine;
      if (unitIndex < timeChunk.units.length) {
        const year = getYearForUnitIndex(
          timeChunk.start,
          timeChunk.unit,
          unitIndex,
          unitsPerLine
        );
        return formatHistoricalYear(year);
      }
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 pb-100 pt-20">
        <div className="mb-6">
          <TextH2 className="text-center border-b-0 pb-0">
            {timeChunk.name} in {getUnitLabel(timeChunk.unit)}
          </TextH2>
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <TextMuted>{format(timeChunk.start, 'MMM d, yyyy')}</TextMuted>

          <div className="flex items-start gap-4">
            <div
              className="flex flex-col text-xs text-muted-foreground  text-right"
              style={{ gap: '4px' }}
            >
              {Array.from({ length: totalLines }, (_, lineIndex) => {
                const yearMarker = getYearMarkerForLine(lineIndex);
                return (
                  <div
                    key={lineIndex}
                    className="h-4 flex items-center justify-end"
                  >
                    {yearMarker && (
                      <span className="font-medium">{yearMarker}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              ref={containerRef}
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${unitsPerLine}, minmax(0, max-content))`,
                justifyContent: 'center',
              }}
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
          </div>

          <TextMuted>{format(timeChunk.end, 'MMM d, yyyy')}</TextMuted>
        </div>
      </div>
      <TimeChunkViewerDrawer
        timeChunk={timeChunk}
        selectedUnits={selectedUnits}
        previewUnit={selectedPreviewUnit}
        isDrawerOpen={isDrawerOpen}
        onDrawerOpenChange={handleDrawerOpenChange}
        onTimeChunkUpdate={onTimeChunkUpdate}
      />
    </>
  );
}
