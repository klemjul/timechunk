import type { TimeChunk } from '../../models';
import { Button } from '../ui/button';
import { Drawer, DrawerTrigger } from '../ui/drawer';
import { TimeChunkFormDrawer } from '../TimeChunkForm/TimeChunkFormDrawer';

interface TimeChunkInitializerProps {
  onComplete: (timeChunk: TimeChunk) => void;
}

export function TimeChunkInitializer({
  onComplete,
}: TimeChunkInitializerProps) {
  const handleOpenExisting = () => {
    // TODO: Implement opening existing time chunk
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Drawer>
          <DrawerTrigger asChild>
            <Button size="lg" className="h-16 text-lg">
              Create a new Time Chunk
            </Button>
          </DrawerTrigger>
          <TimeChunkFormDrawer
            title="Create a new Time Chunk"
            onComplete={onComplete}
          />
        </Drawer>

        <Button
          size="lg"
          variant="outline"
          className="h-16 text-lg"
          onClick={handleOpenExisting}
        >
          Open an existing Time Chunk
        </Button>
      </div>
    </div>
  );
}
