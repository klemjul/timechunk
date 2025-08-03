import type { TimeChunk } from '@/models';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SelectedTimeChunkUnits } from '@/lib/timeframe';
import { TimeFrameLegend } from '@/components/TimeFrameLegend/TimeFrameLegend';

interface TimeFrameLegendDrawerProps {
  timeChunk: TimeChunk;
  isDrawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
  onTimeframeClick?: (selectedUnits: SelectedTimeChunkUnits) => void;
}

export function TimeFrameLegendDrawer({
  timeChunk,
  isDrawerOpen,
  onDrawerOpenChange,
  onTimeframeClick,
}: TimeFrameLegendDrawerProps) {
  return (
    <Drawer open={isDrawerOpen} onOpenChange={onDrawerOpenChange} modal={false}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Timeframe Legend</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="px-2 h-32">
            <TimeFrameLegend
              timeChunk={timeChunk}
              onTimeframeClick={onTimeframeClick}
            />
          </ScrollArea>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="button" variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
