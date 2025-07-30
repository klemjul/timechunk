import dayjs from 'dayjs';
import { z } from 'zod';
import { TimeUnit } from './lib/time';

const dateSchema = z
  .string()
  .refine((val) => dayjs(val).isValid(), { message: 'Invalid date' })
  .transform((val) => dayjs(val));

export const TimeFrameSchema = z.object({
  name: z.string(),
  color: z.string(),
});

export const TimeChunkUnitSchema = z.object({
  index: z.number(),
  timeframe: z.string(),
});

export const TimeChunkSchema = z.object({
  name: z.string(),
  unit: z.enum(TimeUnit),
  start: dateSchema,
  end: dateSchema,
  units: z.array(TimeChunkUnitSchema),
  timeframes: z.record(z.string(), TimeFrameSchema),
});

export type TimeChunk = z.infer<typeof TimeChunkSchema>;

export type TimeChunkUnit = z.infer<typeof TimeChunkUnitSchema>;

export type TimeFrame = z.infer<typeof TimeFrameSchema>;
