import dayjs from 'dayjs';
import { addUnitToDate, getUnitLabel, TimeUnit } from '../../lib/time';
import type { TimeChunk, TimeChunkUnit } from '../../models';
import { Button } from '../ui/button';
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from '../ui/drawer';
import { useState } from 'react';
import { TextLarge } from '../ui/typography';
import { TimeChunkFormStep1, type Step1Data } from './TimeChunkFormStep1';
import { TimeChunkFormStep2, type Step2Data } from './TimeChunkFormStep2';

interface TimeChunkFormProps {
  onComplete: (timeChunk: TimeChunk) => void;
  onCancel?: () => void;
  title?: string;
}

export function TimeChunkFormDrawer({
  onComplete,
  onCancel,
  title = 'Create Time Chunk',
}: TimeChunkFormProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<Step1Data>({
    name: '',
    unit: TimeUnit.WEEK,
  });

  const handleStep1Submit = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: Step2Data) => {
    const start = dayjs(data.startDate);
    const end = addUnitToDate(step1Data.unit, start, data.chunkCount);

    const units: TimeChunkUnit[] = Array.from(
      { length: data.chunkCount },
      (_, index) => ({
        index,
        timeframe: '',
      })
    );

    const timeChunk: TimeChunk = {
      name: step1Data.name,
      unit: step1Data.unit,
      start,
      end,
      units,
      timeframes: {},
    };

    onComplete(timeChunk);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>
            <TextLarge>{title}</TextLarge>
          </DrawerTitle>

          {currentStep === 1 && (
            <DrawerDescription>1. Choose time unit and name</DrawerDescription>
          )}
          {currentStep === 2 && (
            <DrawerDescription>
              2. Configure {step1Data.name} in {getUnitLabel(step1Data.unit)}
            </DrawerDescription>
          )}
        </DrawerHeader>

        <div className="flex-1 px-4">
          {currentStep === 1 ? (
            <TimeChunkFormStep1 onSubmit={handleStep1Submit} />
          ) : (
            <TimeChunkFormStep2
              onSubmit={handleStep2Submit}
              unit={step1Data.unit}
            />
          )}
        </div>

        <DrawerFooter>
          <div className="flex justify-between w-full">
            {currentStep === 1 ? (
              <>
                {onCancel && (
                  <Button type="button" onClick={onCancel} variant="outline">
                    Cancel
                  </Button>
                )}
                <Button type="submit" form="step1-form" className="ml-auto">
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button type="button" onClick={handleBack} variant="outline">
                  Back
                </Button>
                <Button type="submit" form="step2-form" variant="default">
                  Create Time Chunk
                </Button>
              </>
            )}
          </div>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
}
