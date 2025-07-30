import { X } from 'lucide-react';
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
} from '@/components/ui/drawer';
import type { SelectedUnits } from './TimeChunkViewer';

interface TimeChunkViewerDrawerProps {
  timeChunk: TimeChunk;
  selectedUnits: SelectedUnits;
  isDrawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
}

export function TimeChunkViewerDrawer({
  timeChunk,
  selectedUnits,
  isDrawerOpen,
  onDrawerOpenChange,
}: TimeChunkViewerDrawerProps) {
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

  return (
    <Drawer open={isDrawerOpen} onOpenChange={onDrawerOpenChange} modal={false}>
      <DrawerContent>
        <DrawerHeader className="relative">
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>

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
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
