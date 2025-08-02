import type { TimeChunk, TimeChunkUnit } from '@/models';
import type { SelectedTimeChunkUnits } from '@/lib/timeframe';
import { TimeChunkUnitBox } from './TimeChunkUnitBox';
import { TextExtraSmall } from '@/components/ui/typography';
import {
  getYearForUnitIndex,
  formatHistoricalYear,
  addUnitToDate,
  TimeUnit,
  getUnitByLine,
} from '@/lib/time';
import { format } from 'date-fns';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useMemo } from 'react';

interface TimeChunkGridProps {
  timeChunk: TimeChunk;
  selectedUnits: SelectedTimeChunkUnits;
  previewUnits: TimeChunkUnit[];
  unitIndexAttribute: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onUnitPointerDown: (unit: TimeChunkUnit) => void;
  onUnitPointerUp: (unit: TimeChunkUnit) => void;
}

export function TimeChunkGrid({
  timeChunk,
  selectedUnits,
  previewUnits,
  unitIndexAttribute,
  containerRef,
  onUnitPointerDown,
  onUnitPointerUp,
}: TimeChunkGridProps) {
  const breakpoint = useBreakpoint();

  const isDeviceLarge = useMemo(() => {
    return ['lg', 'xl', '2xl'].includes(breakpoint ?? 'sm');
  }, [breakpoint]);

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

        if (timeChunk.unit === TimeUnit.DAY) {
          const lineDate = addUnitToDate(
            timeChunk.unit,
            timeChunk.start,
            unitIndex
          );
          const monthName = format(lineDate, 'MMM');
          return `${formatHistoricalYear(year)} ${monthName}`;
        }

        return formatHistoricalYear(year);
      }
    }
    return null;
  };
  return (
    <div className="flex items-start gap-4">
      {/* Y-axis labels */}
      <div
        className="flex flex-col text-xs text-muted-foreground text-right"
        style={{ gap: '4px' }}
      >
        {Array.from({ length: totalLines }, (_, lineIndex) => {
          const yearMarker = getYearMarkerForLine(lineIndex);
          return (
            <div key={lineIndex} className="h-4 flex items-center justify-end">
              {yearMarker && <TextExtraSmall>{yearMarker}</TextExtraSmall>}
            </div>
          );
        })}
      </div>

      {/* Grid with X-axis labels */}
      <div className="relative">
        {/* X-axis labels */}
        <div
          className="absolute -top-6 left-0 grid gap-1 text-xs text-muted-foreground"
          style={{
            gridTemplateColumns: `repeat(${unitsPerLine}, minmax(0, max-content))`,
            justifyContent: 'center',
          }}
        >
          {Array.from({ length: unitsPerLine }, (_, colIndex) => (
            <div
              key={colIndex}
              className="w-4 h-4 flex items-center justify-center"
            >
              {(colIndex + 1) % 5 === 0 && (
                <TextExtraSmall>{colIndex + 1}</TextExtraSmall>
              )}
            </div>
          ))}
        </div>

        {/* Grid */}
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
              unitIndexAttribute={unitIndexAttribute}
              timeframes={timeChunk.timeframes}
              timeChunk={timeChunk}
              previewUnits={previewUnits}
              onPointerDown={() => onUnitPointerDown(unit)}
              onPointerUp={() => onUnitPointerUp(unit)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
