import { parseDate } from 'chrono-node';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import {
  TimeUnit,
  formatDateForUnit,
  getPlaceholderForUnit,
} from '../../lib/time';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { TextMuted } from '../ui/typography';
import { parseHistoricalDate } from './parseHistoricalDate';

const shouldShowCalendar = (unit: TimeUnit): boolean => {
  return [TimeUnit.DAY, TimeUnit.WEEK, TimeUnit.MONTH].includes(unit);
};

interface TimeUnitDatePickerProps {
  label: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  unit: TimeUnit;
  className?: string;
}

export function TimeUnitDatePicker({
  label,
  value,
  onChange,
  unit,
  className,
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
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <div className="relative flex gap-2">
        <FormControl>
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
        </FormControl>

        {showCalendar && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                aria-label={`Open calendar for ${label.toLowerCase()}`}
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
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {value && <TextMuted>From: {formatDateForUnit(value, unit)}</TextMuted>}

      <FormMessage />
    </FormItem>
  );
}
