import type { TimeChunk, TimeChunkUnit, TimeFrame } from '@/models';

export type SelectedTimeChunkUnits =
  | [TimeChunkUnit]
  | [TimeChunkUnit, TimeChunkUnit]
  | [TimeChunkUnit, TimeChunkUnit, TimeFrame]
  | [];

export function isUnitSelected(
  selectedUnits: SelectedTimeChunkUnits,
  unit: TimeChunkUnit
) {
  return selectedUnits.some(
    (sUnit) => sUnit && 'index' in sUnit && unit.index === sUnit.index
  );
}

export function isUnitInRange(
  selectedUnits: SelectedTimeChunkUnits,
  unit: TimeChunkUnit
) {
  const [startUnit, secondUnit] = selectedUnits;
  if (!startUnit || !secondUnit) {
    return false;
  }
  const minIndex = Math.min(startUnit.index, secondUnit.index);
  const maxIndex = Math.max(startUnit.index, secondUnit.index);
  return unit.index > minIndex && unit.index < maxIndex;
}

export function timeframesOverlapping(
  [start, end]: [TimeChunkUnit, TimeChunkUnit],
  timeframes: TimeFrame[]
) {
  return timeframes.filter(
    (timeframe) =>
      start.index <= timeframe.startIndex && end.index >= timeframe.endIndex
  );
}

export function findUnitsInTimeFrame(
  timeframe: TimeFrame,
  timechunk: TimeChunk
) {
  return timechunk.units
    .filter((u) => u.timeframe === timeframe.name)
    .sort((a, b) => a.index - b.index);
}
