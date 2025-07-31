import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TimeChunk, TimeChunkUnit } from '@/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addUnitToDate, formatDateForUnit } from '@/lib/time';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { SelectedUnits } from './TimeChunkViewer';
import { useEffect } from 'react';

const timeframeSchema = z.object({
  name: z
    .string()
    .min(1, 'Timeframe name is required')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Please select a valid color'),
});

type TimeframeFormData = z.infer<typeof timeframeSchema>;

interface TimeChunkViewerDrawerProps {
  timeChunk: TimeChunk;
  selectedUnits: SelectedUnits;
  isDrawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
  onTimeChunkUpdate?: (timeChunk: TimeChunk) => void;
}

export function TimeChunkViewerDrawer({
  timeChunk,
  selectedUnits,
  isDrawerOpen,
  onDrawerOpenChange,
  onTimeChunkUpdate,
}: TimeChunkViewerDrawerProps) {
  const form = useForm<TimeframeFormData>({
    resolver: zodResolver(timeframeSchema),
    defaultValues: {
      name: '',
      color: '#3b82f6',
    },
  });

  useEffect(() => {
    form.reset();
  }, [selectedUnits, form]);

  const getUnitDate = (unit: TimeChunkUnit) => {
    const unitDate = addUnitToDate(timeChunk.unit, timeChunk.start, unit.index);
    return unitDate.toDate();
  };

  const getSelectedDates = (): [Date] | [Date, Date] | [] => {
    if (selectedUnits.length === 0) return [];
    if (selectedUnits.length === 1) {
      return [getUnitDate(selectedUnits[0])];
    }
    return [getUnitDate(selectedUnits[0]), getUnitDate(selectedUnits[1])];
  };

  const handleCreateTimeframe = (data: TimeframeFormData) => {
    if (!onTimeChunkUpdate || selectedUnits.length !== 2) {
      return;
    }

    const timeframeId = `timeframe-${Date.now()}`;
    const [startUnit, endUnit] = selectedUnits;

    const updatedTimeframes = {
      ...timeChunk.timeframes,
      [timeframeId]: {
        name: data.name,
        color: data.color,
      },
    };

    const updatedUnits = timeChunk.units.map((unit) => {
      if (unit.index >= startUnit.index && unit.index <= endUnit.index) {
        return { ...unit, timeframe: timeframeId };
      }
      return unit;
    });

    const updatedTimeChunk = {
      ...timeChunk,
      timeframes: updatedTimeframes,
      units: updatedUnits,
    };

    onTimeChunkUpdate(updatedTimeChunk);
    form.reset();
    onDrawerOpenChange(false);
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={onDrawerOpenChange} modal={false}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              {(() => {
                const dates = getSelectedDates();
                if (dates.length === 0) return '';
                if (dates.length === 1) {
                  return formatDateForUnit(dates[0], timeChunk.unit);
                }
                return `${formatDateForUnit(dates[0], timeChunk.unit)} - ${formatDateForUnit(dates[1], timeChunk.unit)}`;
              })()}
            </DrawerTitle>
            <DrawerDescription>
              {selectedUnits.length === 2
                ? 'Create a timeframe for this date range'
                : ''}
            </DrawerDescription>
          </DrawerHeader>
          {selectedUnits.length === 2 && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateTimeframe)}
                className="px-4 pb-4"
                id="timeframe-form"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeframe Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter timeframe name"
                            {...field}
                          />
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
                          <Input
                            type="color"
                            className="h-10 w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          )}
          <DrawerFooter>
            <div className="flex justify-between w-full gap-2">
              <>
                <DrawerClose asChild>
                  <Button type="button" variant="outline" className="flex-1">
                    Close
                  </Button>
                </DrawerClose>
                {selectedUnits.length === 2 && (
                  <Button
                    type="submit"
                    form="timeframe-form"
                    variant="default"
                    className="flex-2"
                  >
                    Create Time Chunk
                  </Button>
                )}
              </>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
