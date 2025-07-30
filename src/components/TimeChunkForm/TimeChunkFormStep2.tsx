import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  addUnitToDate,
  formatDateForUnit,
  getUnitLabel,
  TimeUnit,
} from '../../lib/time';
import { Slider } from '../ui/slider';
import { TimeUnitDatePicker } from '../TimeUnitDatePicker/TimeUnitDatePicker';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { TextMuted, TextSmall } from '../ui/typography';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Input } from '../ui/input';

const MAX_TIME_CHUNKS = 5000;

const step2Schema = z.object({
  startDate: z.date({
    message: 'Start date is required',
  }),
  chunkCount: z
    .number()
    .min(1, 'Must have at least 1 chunk')
    .max(MAX_TIME_CHUNKS, `Maximum ${MAX_TIME_CHUNKS} chunks allowed`),
});

export type Step2Data = z.infer<typeof step2Schema>;

interface TimeChunkFormStep2Props {
  defaultValues?: Step2Data;
  onSubmit: (data: Step2Data) => void;
  unit: TimeUnit;
}

export function TimeChunkFormStep2({
  defaultValues,
  onSubmit,
  unit,
}: TimeChunkFormStep2Props) {
  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: defaultValues || {
      startDate: new Date(),
      chunkCount: 0,
    },
  });

  const chunkCount = form.watch('chunkCount');
  const startDate = form.watch('startDate');
  const parsedEndDate = useMemo(() => {
    return addUnitToDate(unit, dayjs(startDate), chunkCount);
  }, [chunkCount, startDate, unit]);

  return (
    <Form {...form}>
      <form id="step2-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <TimeUnitDatePicker
              label="Starting Date"
              value={field.value}
              onChange={field.onChange}
              unit={unit}
              className="mb-4"
            />
          )}
        />

        <FormField
          control={form.control}
          name="chunkCount"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>
                <TextSmall className="w-3/4">
                  Number of {getUnitLabel(unit)}:{' '}
                </TextSmall>
                <Input
                  className="w-1/4"
                  {...field}
                  type="number"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              </FormLabel>
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0] || 1)}
                  min={1}
                  max={MAX_TIME_CHUNKS}
                  step={1}
                  className="w-full"
                />
              </FormControl>
              {startDate && (
                <TextMuted>
                  To: {formatDateForUnit(parsedEndDate.toDate(), unit)}
                </TextMuted>
              )}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
