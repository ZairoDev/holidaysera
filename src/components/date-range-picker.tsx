'use client';

import * as React from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (dates: { start: Date | null; end: Date | null }) => void;
  className?: string;
  fieldClassName?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  className = '',
  fieldClassName = '',
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const dateRange: DateRange | undefined = startDate || endDate
    ? {
        from: startDate || undefined,
        to: endDate || undefined,
      }
    : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      // If a new start date is selected that's after the current end date, clear the end date
      if (range.from && endDate && range.from > endDate && !range.to) {
        onDateChange({
          start: range.from,
          end: null,
        });
        return;
      }
      
      onDateChange({
        start: range.from || null,
        end: range.to || null,
      });
    } else {
      onDateChange({ start: null, end: null });
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange({ start: null, end: null });
    setOpen(false);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDate = today;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !dateRange && 'text-muted-foreground',
            fieldClassName
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {startDate ? (
            endDate ? (
              <>
                {format(startDate, 'LLL dd, y')} - {format(endDate, 'LLL dd, y')}
              </>
            ) : (
              format(startDate, 'LLL dd, y')
            )
          ) : (
            <span>Pick a date range</span>
          )}
          {startDate && open && (
            <X
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={startDate || today}
          selected={dateRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={(date) => {
            // Disable dates before today
            if (date < minDate) return true;
            
            // If start date is selected, disable dates before start date for end date selection
            if (startDate && !endDate) {
              const start = new Date(startDate);
              start.setHours(0, 0, 0, 0);
              const checkDate = new Date(date);
              checkDate.setHours(0, 0, 0, 0);
              return checkDate < start;
            }
            
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

