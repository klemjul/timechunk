import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  addUnitToDate,
  formatDateForUnit,
  getUnitLabel,
  getChunkCountFromDates,
  TimeUnit,
} from '../../lib/time';
import { Slider } from '../ui/slider';
import { TimeUnitDatePicker } from '../TimeUnitDatePicker/TimeUnitDatePicker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { TextMedium, TextMuted, TextSmall } from '../ui/typography';
import { useMemo } from 'react';
import { Input } from '../ui/input';

const MAX_TIME_CHUNKS = 10000;
const MAX_TIME_CHUNKS_SLIDER = 5000;

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
    return addUnitToDate(unit, startDate, chunkCount);
  }, [chunkCount, startDate, unit]);

  return (
    <Form {...form}>
      <form id="step2-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>
                <TextMedium>Starting Date</TextMedium>
              </FormLabel>
              <FormControl>
                <TimeUnitDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  unit={unit}
                />
              </FormControl>

              {field.value && (
                <TextMuted>
                  From: {formatDateForUnit(field.value, unit)}
                </TextMuted>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chunkCount"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>
                <TextMedium>End Date</TextMedium>
              </FormLabel>
              <FormControl>
                <div>
                  <TimeUnitDatePicker
                    value={addUnitToDate(unit, startDate, field.value)}
                    onChange={(endDate) => {
                      if (endDate) {
                        const chunkCount = getChunkCountFromDates(
                          unit,
                          startDate,
                          endDate
                        );
                        field.onChange(chunkCount);
                      }
                    }}
                    unit={unit}
                  />
                  <TextMuted>
                    To: {formatDateForUnit(parsedEndDate, unit)}
                  </TextMuted>
                  <div className="flex items-center gap-2 mb-2">
                    <TextSmall className="flex-1">
                      Number of {getUnitLabel(unit)}:
                    </TextSmall>
                    <Input
                      className="w-20"
                      {...field}
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 1)
                      }
                    />
                  </div>
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0] || 1)}
                    min={1}
                    max={MAX_TIME_CHUNKS_SLIDER}
                    step={1}
                    className="w-full"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
