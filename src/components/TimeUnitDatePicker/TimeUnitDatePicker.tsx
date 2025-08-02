import { parseDate } from 'chrono-node';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { TimeUnit, getPlaceholderForUnit } from '../../lib/time';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { parseHistoricalDate } from './parseHistoricalDate';

const shouldShowCalendar = (unit: TimeUnit): boolean => {
  return [TimeUnit.DAY, TimeUnit.WEEK, TimeUnit.MONTH].includes(unit);
};

interface TimeUnitDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  unit: TimeUnit;
}

export function TimeUnitDatePicker({
  value,
  onChange,
  unit,
}: TimeUnitDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const showCalendar = shouldShowCalendar(unit);
  const placeholder = getPlaceholderForUnit(unit);

  const handleInputChange = (input: string) => {
    setInputValue(input);

    // Try chrono-node first for natural language
    let parsedDate = parseDate(input);

    // Fall back to historical date parsing for BC/BCE
    if (!parsedDate) {
      parsedDate = parseHistoricalDate(input);
    }

    if (parsedDate) {
      onChange(parsedDate);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setOpen(false);
    }
  };

  return (
    <div className="relative flex gap-2">
      <Input
        value={inputValue}
        placeholder={placeholder}
        className="bg-background"
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && showCalendar) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />

      {showCalendar && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              aria-label="Open Calendar"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleCalendarSelect}
              captionLayout="label"
              defaultMonth={value}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
