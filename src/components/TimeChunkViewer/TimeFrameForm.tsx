import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect } from 'react';

const timeframeSchema = z.object({
  name: z
    .string()
    .min(1, 'Timeframe name is required')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Please select a valid color'),
});

export type TimeframeFormData = z.infer<typeof timeframeSchema>;

interface TimeFrameFormProps {
  onSubmit: (data: TimeframeFormData) => void;
  formId: string;
  resetTrigger?: unknown;
}

export function TimeFrameForm({
  onSubmit,
  formId,
  resetTrigger,
}: TimeFrameFormProps) {
  const form = useForm<TimeframeFormData>({
    resolver: zodResolver(timeframeSchema),
    defaultValues: {
      name: '',
      color: '#3b82f6',
    },
  });

  useEffect(() => {
    form.reset();
  }, [resetTrigger, form]);

  const handleSubmit = (data: TimeframeFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="px-4 pb-4"
        id={formId}
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeframe Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter timeframe name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input type="color" className="h-10 w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
