import { useEffect, useState, useRef } from 'react';
import type { TimeChunk, TimeChunkUnit } from '@/models';
import { formatDateForUnit, getUnitLabel } from '@/lib/time';
import { TimeChunkViewerDrawer } from './TimeChunkViewerDrawer';
import { TimeChunkGrid } from './TimeChunkGrid';
import { useUnitSelection } from '@/components/TimeChunkViewer/useUnitSelection';
import { useUnitPreview } from '@/components/TimeChunkViewer/useUnitPreview';
import { TextH2, TextMuted } from '../ui/typography';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface TimeChunkViewerProps {
  timeChunk: TimeChunk;
  onTimeChunkUpdate?: (timeChunk: TimeChunk) => void;
}

const unitIndexAttribute = 'data-unit-index';

export function TimeChunkViewer({
  timeChunk,
  onTimeChunkUpdate,
}: TimeChunkViewerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const gridContainerRef = useRef(null);

  const unitSelection = useUnitSelection(timeChunk);
  const unitPreview = useUnitPreview({
    timeChunk,
    containerRef: gridContainerRef,
    unitIndexAttribute,
    selectedUnits: unitSelection.selectedUnits,
  });

  const isMobile = useMobileDetection();

  useEffect(() => {
    if (unitSelection.selectedUnits.length === 0) {
      setIsDrawerOpen(false);
      unitPreview.clearPreview();
    } else {
      setIsDrawerOpen(true);
    }
  }, [unitSelection.selectedUnits, unitPreview]);

  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      unitSelection.clearSelection();
    }
  };

  const handleUnitPointerDown = (unit: TimeChunkUnit) => {
    unitSelection.handleUnitSelection(unit);
  };

  const handleUnitPointerUp = () => {
    if (
      isMobile &&
      unitSelection.selectedUnits.length === 1 &&
      unitPreview.selectedPreviewUnit
    ) {
      unitSelection.handleUnitSelection(unitPreview.selectedPreviewUnit);
      unitPreview.clearPreview();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 pb-100 pt-20">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="mb-10">
            <TextH2 className="text-center border-b-0 pb-0">
              {timeChunk.name} in {getUnitLabel(timeChunk.unit)}
            </TextH2>
          </div>
          <TextMuted className="mb-10">
            {formatDateForUnit(timeChunk.start, timeChunk.unit)}
          </TextMuted>
        </div>
        {/* Grid */}
        <TimeChunkGrid
          timeChunk={timeChunk}
          selectedUnits={unitSelection.selectedUnits}
          unitIndexAttribute={unitIndexAttribute}
          previewUnits={unitPreview.getPreviewUnits()}
          containerRef={gridContainerRef}
          onUnitPointerUp={handleUnitPointerDown}
          onUnitPointerDown={handleUnitPointerUp}
        />
        {/* Footer */}
        <TextMuted>
          {formatDateForUnit(timeChunk.end, timeChunk.unit)}
        </TextMuted>
      </div>
      <TimeChunkViewerDrawer
        timeChunk={timeChunk}
        selectedUnits={unitSelection.selectedUnits}
        previewUnit={unitPreview.selectedPreviewUnit}
        isDrawerOpen={isDrawerOpen}
        onDrawerOpenChange={handleDrawerOpenChange}
        onTimeChunkUpdate={onTimeChunkUpdate}
      />
    </>
  );
}
