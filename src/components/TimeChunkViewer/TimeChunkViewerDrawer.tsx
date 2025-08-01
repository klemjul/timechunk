import type { TimeChunk, TimeChunkUnit } from '@/models';
import { Button } from '@/components/ui/button';
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
import { useMemo } from 'react';
import { TimeFrameForm, type TimeframeFormData } from './TimeFrameForm';
import {
  timeframesOverlapping,
  type SelectedTimeChunkUnits,
} from '@/lib/timeframe';

interface TimeChunkViewerDrawerProps {
  timeChunk: TimeChunk;
  selectedUnits: SelectedTimeChunkUnits;
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
  const overlappingTimeframes = useMemo(() => {
    const [start, end] = selectedUnits;
    if (start && end) {
      return timeframesOverlapping(
        [start, end],
        Object.values(timeChunk.timeframes)
      );
    }
    return [];
  }, [selectedUnits, timeChunk.timeframes]);

  const shouldDisplayForm = useMemo(() => {
    return selectedUnits.length == 2 && overlappingTimeframes.length == 0;
  }, [selectedUnits, overlappingTimeframes]);

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

    const [startUnit, endUnit] = selectedUnits;

    const updatedTimeframes = {
      ...timeChunk.timeframes,
      [data.name]: {
        name: data.name,
        color: data.color,
        startIndex: startUnit.index,
        endIndex: endUnit.index,
      },
    };

    const updatedUnits = timeChunk.units.map((unit) => {
      if (unit.index >= startUnit.index && unit.index <= endUnit.index) {
        return { ...unit, timeframe: data.name };
      }
      return unit;
    });

    const updatedTimeChunk = {
      ...timeChunk,
      timeframes: updatedTimeframes,
      units: updatedUnits,
    };

    onTimeChunkUpdate(updatedTimeChunk);
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
              {shouldDisplayForm
                ? 'Create a timeframe for this date range'
                : ''}
            </DrawerDescription>
          </DrawerHeader>
          {shouldDisplayForm && (
            <TimeFrameForm
              onSubmit={handleCreateTimeframe}
              formId="timeframe-form"
              resetTrigger={selectedUnits}
            />
          )}
          <DrawerFooter>
            <div className="flex justify-between w-full gap-2">
              <>
                <DrawerClose asChild>
                  <Button type="button" variant="outline" className="flex-1">
                    Close
                  </Button>
                </DrawerClose>
                {shouldDisplayForm && (
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
