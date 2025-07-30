import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getUnitExample, getUnitLabel, TimeUnit } from '../../lib/time';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { TextMuted } from '../ui/typography';

const NAME_MAX_LENGTH = 100;

const step1Schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(
      NAME_MAX_LENGTH,
      `Name must be less than ${NAME_MAX_LENGTH} characters`
    ),
  unit: z.enum(TimeUnit),
});

export type Step1Data = z.infer<typeof step1Schema>;

interface TimeChunkFormStep1Props {
  defaultValues?: Step1Data;
  onSubmit: (data: Step1Data) => void;
}

export function TimeChunkFormStep1({
  defaultValues,
  onSubmit,
}: TimeChunkFormStep1Props) {
  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: defaultValues || {
      name: '',
      unit: TimeUnit.WEEK,
    },
  });

  const unit = form.watch('unit');

  return (
    <Form {...form}>
      <form id="step1-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormItem>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder={getUnitExample(unit)}
                      {...field}
                      maxLength={NAME_MAX_LENGTH}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <TextMuted>in</TextMuted>
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TimeUnit).map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {getUnitLabel(unit)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </FormItem>
      </form>
    </Form>
  );
}
