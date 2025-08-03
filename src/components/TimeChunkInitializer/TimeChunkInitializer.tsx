import type { TimeChunk } from '../../models';
import { Button } from '../ui/button';
import { Drawer, DrawerTrigger } from '../ui/drawer';
import { TimeChunkFormDrawer } from './TimeChunkInitializerDrawer';

interface TimeChunkInitializerProps {
  onTimeChunkCreate: (timeChunk: TimeChunk) => void;
  onTimeChunkImport: () => void;
}

export function TimeChunkInitializer({
  onTimeChunkCreate,
  onTimeChunkImport,
}: TimeChunkInitializerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-10">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img
            src="/timechunk-icon-units.svg"
            alt="TimeChunk Logo"
            className="w-24 h-24"
          />
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <Button size="lg" className="h-16 text-lg">
              Create a new Time Chunk
            </Button>
          </DrawerTrigger>
          <TimeChunkFormDrawer
            title="Create a new Time Chunk"
            onComplete={onTimeChunkCreate}
          />
        </Drawer>

        <Button
          size="lg"
          variant="outline"
          className="h-16 text-lg"
          onClick={onTimeChunkImport}
        >
          Open an existing Time Chunk
        </Button>
      </div>
    </div>
  );
}
