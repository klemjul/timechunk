import type { TimeChunk, TimeFrame } from '@/models';
import { ColorDisplay } from '@/components/ui/ColorDisplay';
import { addUnitToDate, formatDateForUnit } from '@/lib/time';
import type { SelectedTimeChunkUnits } from '@/lib/timeframe';

interface TimeFrameLegendProps {
  timeChunk: TimeChunk;
  onTimeframeClick?: (selectedUnits: SelectedTimeChunkUnits) => void;
}

export function TimeFrameLegend({
  timeChunk,
  onTimeframeClick,
}: TimeFrameLegendProps) {
  const timeframes = Object.values(timeChunk.timeframes).sort(
    (a, b) => a.startIndex - b.startIndex
  );

  const getTimeframeDateRange = (timeframe: TimeFrame) => {
    const startDate = addUnitToDate(
      timeChunk.unit,
      timeChunk.start,
      timeframe.startIndex
    );
    const endDate = addUnitToDate(
      timeChunk.unit,
      timeChunk.start,
      timeframe.endIndex
    );
    return `${formatDateForUnit(startDate, timeChunk.unit)} to ${formatDateForUnit(endDate, timeChunk.unit)}`;
  };

  const handleTimeframeClick = (timeframe: TimeFrame) => {
    if (onTimeframeClick) {
      const startUnit = timeChunk.units.find(
        (u) => u.index === timeframe.startIndex
      )!;
      const endUnit = timeChunk.units.find(
        (u) => u.index === timeframe.endIndex
      )!;
      onTimeframeClick([startUnit, endUnit, timeframe]);
    }
  };

  if (timeframes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      {timeframes.map((timeframe) => (
        <div
          key={timeframe.name}
          className="cursor-pointer transition-colors"
          onClick={() => handleTimeframeClick(timeframe)}
        >
          <ColorDisplay
            text={`${timeframe.name} (${getTimeframeDateRange(timeframe)})`}
            color={timeframe.color}
          />
        </div>
      ))}
    </div>
  );
}
