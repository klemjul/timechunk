import { z } from 'zod';
import { TimeUnit } from './lib/time';

export const TimeFrameSchema = z.object({
  name: z.string(),
  color: z.string(),
  startIndex: z.number(),
  endIndex: z.number(),
});

export const TimeChunkUnitSchema = z.object({
  index: z.number(),
  timeframe: z.string(),
});

export const TimeChunkSchema = z.object({
  name: z.string(),
  unit: z.enum(TimeUnit),
  start: z.date(),
  end: z.date(),
  units: z.array(TimeChunkUnitSchema),
  timeframes: z.record(z.string(), TimeFrameSchema),
});

export const TimeChunkJSONSchema = TimeChunkSchema.omit({ units: true }).extend(
  {
    start: z.string().transform((str) => new Date(str)),
    end: z.string().transform((str) => new Date(str)),
  }
);

export type TimeChunkJSON = z.infer<typeof TimeChunkJSONSchema>;

export type TimeChunk = z.infer<typeof TimeChunkSchema>;

export type TimeChunkUnit = z.infer<typeof TimeChunkUnitSchema>;

export type TimeFrame = z.infer<typeof TimeFrameSchema>;
