import type { TimeChunk, TimeFrame } from '@/models';

export function createTimeframe(
  timeChunk: TimeChunk,
  timeframe: TimeFrame
): TimeChunk {
  const updatedTimeframes = {
    ...timeChunk.timeframes,
    [timeframe.name]: timeframe,
  };

  const updatedUnits = timeChunk.units.map((unit) => {
    if (
      unit.index >= timeframe.startIndex &&
      unit.index <= timeframe.endIndex
    ) {
      return { ...unit, timeframe: timeframe.name };
    }
    return unit;
  });

  return {
    ...timeChunk,
    timeframes: updatedTimeframes,
    units: updatedUnits,
  };
}

export function deleteTimeframe(
  timeChunk: TimeChunk,
  timeframeName: string
): TimeChunk {
  const remainingTimeframes = Object.fromEntries(
    Object.entries(timeChunk.timeframes).filter(
      ([name]) => name !== timeframeName
    )
  );

  const updatedUnits = timeChunk.units.map((unit) => {
    if (unit.timeframe === timeframeName) {
      return { ...unit, timeframe: '' };
    }
    return unit;
  });

  return {
    ...timeChunk,
    timeframes: remainingTimeframes,
    units: updatedUnits,
  };
}

export function updateTimeframe(
  timeChunk: TimeChunk,
  existingName: string,
  timeframe: TimeFrame
): TimeChunk {
  const existingTimeframe = timeChunk.timeframes[existingName];
  if (!existingTimeframe) {
    throw new Error(`Timeframe ${existingName} does not exist`);
  }

  if (existingTimeframe.name !== timeframe.name) {
    const updatedTimeChunk = deleteTimeframe(timeChunk, existingTimeframe.name);

    return createTimeframe(updatedTimeChunk, {
      ...timeframe,
      startIndex: existingTimeframe.startIndex,
      endIndex: existingTimeframe.endIndex,
    });
  }

  const updatedTimeframes = {
    ...timeChunk.timeframes,
    [timeframe.name]: {
      name: existingTimeframe.name,
      color: timeframe.color,
      startIndex: existingTimeframe.startIndex,
      endIndex: existingTimeframe.endIndex,
    },
  };

  return {
    ...timeChunk,
    timeframes: updatedTimeframes,
  };
}
