import type { TimeChunk, TimeChunkUnit } from '@/models';
import { Button } from '@/components/ui/button';
import { ColorDisplay } from '@/components/ui/ColorDisplay';
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
import { useMemo, useState } from 'react';
import {
  TimeFrameForm,
  type TimeframeFormData,
} from '../TimeFrameForm/TimeFrameForm';
import {
  timeframesOverlapping,
  type SelectedTimeChunkUnits,
} from '@/lib/timeframe';
import {
  createTimeframe,
  deleteTimeframe,
  updateTimeframe,
} from '@/lib/timechunk';

interface TimeChunkViewerDrawerProps {
  timeChunk: TimeChunk;
  selectedUnits: SelectedTimeChunkUnits;
  previewUnit?: TimeChunkUnit | null;
  isDrawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
  onTimeChunkUpdate?: (timeChunk: TimeChunk) => void;
}

export function TimeChunkViewerDrawer({
  timeChunk,
  selectedUnits,
  previewUnit,
  isDrawerOpen,
  onDrawerOpenChange,
  onTimeChunkUpdate,
}: TimeChunkViewerDrawerProps) {
  const [isEditMode, setIsEditMode] = useState(false);

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

  const selectedTimeframe = useMemo(() => {
    if (selectedUnits.length === 3) {
      return selectedUnits[2];
    }
    return null;
  }, [selectedUnits]);

  const getUnitDate = (unit: TimeChunkUnit) => {
    const unitDate = addUnitToDate(timeChunk.unit, timeChunk.start, unit.index);
    return unitDate;
  };

  const getSelectedDates = (): [Date] | [Date, Date] | [] => {
    if (selectedUnits.length === 0) return [];
    if (selectedUnits.length === 1) {
      if (previewUnit) {
        const selectedDate = getUnitDate(selectedUnits[0]);
        const previewDate = getUnitDate(previewUnit);
        return selectedUnits[0].index <= previewUnit.index
          ? [selectedDate, previewDate]
          : [previewDate, selectedDate];
      }
      return [getUnitDate(selectedUnits[0])];
    }
    return [getUnitDate(selectedUnits[0]), getUnitDate(selectedUnits[1])];
  };

  const handleCreateTimeframe = ({ color, name }: TimeframeFormData) => {
    if (!onTimeChunkUpdate || selectedUnits.length !== 2) {
      return;
    }

    const [startUnit, endUnit] = selectedUnits;
    const updatedTimeChunk = createTimeframe(timeChunk, {
      color,
      name,
      startIndex: startUnit.index,
      endIndex: endUnit.index,
    });

    onTimeChunkUpdate(updatedTimeChunk);
    onDrawerOpenChange(false);
  };

  const handleUpdateTimeframe = (data: TimeframeFormData) => {
    if (!onTimeChunkUpdate || !selectedTimeframe) {
      return;
    }

    const updatedTimeChunk = updateTimeframe(
      timeChunk,
      selectedTimeframe.name,
      {
        name: data.name,
        color: data.color,
        startIndex: selectedTimeframe.startIndex,
        endIndex: selectedTimeframe.endIndex,
      }
    );
    console.log(updatedTimeChunk);

    onTimeChunkUpdate(updatedTimeChunk);
    setIsEditMode(false);
    onDrawerOpenChange(false);
  };

  const handleDeleteTimeframe = () => {
    if (!onTimeChunkUpdate || !selectedTimeframe) {
      return;
    }

    const updatedTimeChunk = deleteTimeframe(timeChunk, selectedTimeframe.name);

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
                return `${formatDateForUnit(dates[0], timeChunk.unit)} to ${formatDateForUnit(dates[1], timeChunk.unit)}`;
              })()}
            </DrawerTitle>
            <DrawerDescription>
              {(() => {
                if (shouldDisplayForm) {
                  return 'Create a timeframe for this date range';
                }
                return '';
              })()}
            </DrawerDescription>
          </DrawerHeader>
          {selectedTimeframe && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                <ColorDisplay
                  text={`${selectedTimeframe.name}`}
                  color={selectedTimeframe.color}
                />
              </div>
            </div>
          )}
          {shouldDisplayForm && (
            <TimeFrameForm
              onSubmit={handleCreateTimeframe}
              timeChunk={timeChunk}
              formId="timeframe-form"
              resetTrigger={selectedUnits}
            />
          )}
          {selectedTimeframe && isEditMode && (
            <TimeFrameForm
              onSubmit={handleUpdateTimeframe}
              timeChunk={timeChunk}
              formId="edit-timeframe-form"
              resetTrigger={[isEditMode]}
              defaultValues={{
                name: selectedTimeframe.name,
                color: selectedTimeframe.color,
              }}
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
                {selectedTimeframe && !isEditMode && (
                  <>
                    <Button
                      type="button"
                      variant="default"
                      className="flex-2"
                      onClick={() => setIsEditMode(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="flex-1"
                      onClick={handleDeleteTimeframe}
                    >
                      Delete
                    </Button>
                  </>
                )}
                {selectedTimeframe && isEditMode && (
                  <>
                    <Button
                      type="submit"
                      form="edit-timeframe-form"
                      variant="default"
                      className="flex-2"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsEditMode(false)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
