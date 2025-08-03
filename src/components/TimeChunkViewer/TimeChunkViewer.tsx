import { useEffect, useState, useRef } from 'react';
import type { TimeChunk, TimeChunkUnit } from '@/models';
import { formatDateForUnit, getUnitLabel } from '@/lib/time';
import { TimeFrameSelectDrawer } from './TimeFrameSelectDrawer';
import { TimeFrameLegendDrawer } from './TimeFrameLegendDrawer';
import { TimeChunkGrid } from './TimeChunkGrid';
import { useUnitSelection } from '@/components/TimeChunkViewer/useUnitSelection';
import { useUnitPreview } from '@/components/TimeChunkViewer/useUnitPreview';
import { TextH2, TextMuted } from '../ui/typography';

import { Menubar, MenubarMenu, MenubarTrigger } from '../ui/menubar';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import type { SelectedTimeChunkUnits } from '@/lib/timeframe';
import { Button } from '../ui/button';

interface TimeChunkViewerProps {
  timeChunk: TimeChunk;
  onTimeChunkUpdate?: (timeChunk: TimeChunk) => void;
  onTimeChunkExport?: (timeChunk: TimeChunk) => void;
  onTimeChunkImport?: () => void;
}

const unitIndexAttribute = 'data-unit-index';

export function TimeChunkViewer({
  timeChunk,
  onTimeChunkUpdate,
  onTimeChunkExport,
  onTimeChunkImport,
}: TimeChunkViewerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLegendDrawerOpen, setIsLegendDrawerOpen] = useState(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const unitSelection = useUnitSelection(timeChunk);
  const unitPreview = useUnitPreview({
    timeChunk,
    containerRef: gridContainerRef,
    unitIndexAttribute,
    selectedUnits: unitSelection.selectedUnits,
  });

  const isMobile = useMobileDetection();

  useEffect(() => {
    if (unitSelection.selectedUnits.length === 0 || isLegendDrawerOpen) {
      setIsDrawerOpen(false);
      unitPreview.clearPreview();
    } else {
      setIsDrawerOpen(true);
    }
  }, [unitSelection.selectedUnits, unitPreview, isLegendDrawerOpen]);

  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      unitSelection.clearSelection();
    }
  };

  const handleUnitPointerDown = (unit: TimeChunkUnit) => {
    unitSelection.handleUnitSelection(unit);
    setIsLegendDrawerOpen(false);
  };

  const handleUnitPointerUp = () => {
    if (
      isMobile &&
      unitSelection.selectedUnits.length === 1 &&
      unitPreview.selectedPreviewUnit
    ) {
      unitSelection.handleUnitSelection(unitPreview.selectedPreviewUnit);
      unitPreview.clearPreview();
      setIsLegendDrawerOpen(false);
    }
  };

  const handleLegendTimeframeClick = (
    selectedUnits: SelectedTimeChunkUnits
  ) => {
    unitSelection.setSelectedUnits(selectedUnits);

    // Scroll to the first unit of the selected timeframe
    const firstUnit = selectedUnits[0];

    if (
      selectedUnits.length >= 2 &&
      gridContainerRef.current &&
      firstUnit &&
      gridContainerRef
    ) {
      const targetElement = gridContainerRef.current.querySelector(
        `[${unitIndexAttribute}="${firstUnit.index}"]`
      );

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }
  };

  return (
    <>
      {/* Sticky Menubar */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b ">
        <div className="flex justify-between p-4">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger onClick={() => onTimeChunkExport?.(timeChunk)}>
                Export
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger onClick={() => onTimeChunkImport?.()}>
                Open
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsLegendDrawerOpen(!isLegendDrawerOpen)}
          >
            Legend
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-4 pb-100 pt-20">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="mb-10">
            <TextH2 className="text-center border-b-0 pb-0">
              {timeChunk.name} in {getUnitLabel(timeChunk.unit)}
            </TextH2>
          </div>
          <div className="flex items-center gap-4 mb-10">
            <TextMuted>
              {formatDateForUnit(timeChunk.start, timeChunk.unit)}
            </TextMuted>
          </div>
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
        <TextMuted className="mt-5">
          {formatDateForUnit(timeChunk.end, timeChunk.unit)}
        </TextMuted>
      </div>
      <TimeFrameSelectDrawer
        timeChunk={timeChunk}
        selectedUnits={unitSelection.selectedUnits}
        previewUnit={unitPreview.selectedPreviewUnit}
        isDrawerOpen={isDrawerOpen}
        onDrawerOpenChange={handleDrawerOpenChange}
        onTimeChunkUpdate={onTimeChunkUpdate}
      />
      <TimeFrameLegendDrawer
        timeChunk={timeChunk}
        isDrawerOpen={isLegendDrawerOpen}
        onDrawerOpenChange={setIsLegendDrawerOpen}
        onTimeframeClick={handleLegendTimeframeClick}
      />
    </>
  );
}
