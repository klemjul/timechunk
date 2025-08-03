import type { TimeChunk, TimeChunkJSON, TimeFrame } from '@/models';
import { TimeChunkJSONSchema } from '@/models';
import { getChunkCountFromDates } from '@/lib/time';

export function timeChunkToJSON(timeChunk: TimeChunk) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { units, ...timeChunkJSON } = timeChunk;
  return JSON.stringify(timeChunkJSON as TimeChunkJSON);
}

export function timeChunkFromJSON(timeChunk: string): TimeChunk {
  const parsed = JSON.parse(timeChunk);
  const timeChunkJSON = TimeChunkJSONSchema.parse(parsed);

  // Calculate the chunk count based on the date range and unit
  const chunkCount = getChunkCountFromDates(
    timeChunkJSON.unit,
    timeChunkJSON.start,
    timeChunkJSON.end
  );

  // Generate units array and assign timeframes
  const units = Array.from({ length: chunkCount }, (_, index) => {
    // Find which timeframe this unit belongs to
    const timeframeName =
      Object.values(timeChunkJSON.timeframes).find(
        (timeframe) =>
          index >= timeframe.startIndex && index <= timeframe.endIndex
      )?.name || '';

    return {
      index,
      timeframe: timeframeName,
    };
  });

  return {
    ...timeChunkJSON,
    units,
  };
}

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
