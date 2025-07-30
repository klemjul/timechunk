/* eslint-disable no-case-declarations */
import { format } from 'date-fns';
import type dayjs from 'dayjs';

export enum TimeUnit {
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
  YEAR = 'year',
  YEAR_100 = 'year_100',
}

export const formatHistoricalYear = (year: number): string => {
  if (year < 1) {
    return `${Math.abs(year - 1)} BCE`;
  }
  return `${year} CE`;
};

export const getUnitLabel = (unit: TimeUnit) => {
  const labels: Record<TimeUnit, string> = {
    [TimeUnit.DAY]: 'day(s)',
    [TimeUnit.WEEK]: 'week(s)',
    [TimeUnit.MONTH]: 'month(s)',
    [TimeUnit.YEAR]: 'year(s)',
    [TimeUnit.YEAR_100]: 'century(s)',
  };
  return labels[unit];
};

export const getUnitExample = (unit: TimeUnit) => {
  const labels: Record<TimeUnit, string> = {
    [TimeUnit.DAY]: 'My year',
    [TimeUnit.WEEK]: 'My life',
    [TimeUnit.MONTH]: 'The 80s',
    [TimeUnit.YEAR]: 'The Roman Empire',
    [TimeUnit.YEAR_100]: 'The Humanity',
  };
  return labels[unit];
};

export const getPlaceholderForUnit = (unit: TimeUnit): string => {
  const placeholders: Record<TimeUnit, string> = {
    [TimeUnit.DAY]: 'today, tomorrow, Jan 15, 2025',
    [TimeUnit.WEEK]: 'this week, next week, Jan 2025',
    [TimeUnit.MONTH]: 'this month, Jan 2025, 2025-01, in 3 month',
    [TimeUnit.YEAR]: 'this year, past year, 10 year ago, in 100 year',
    [TimeUnit.YEAR_100]: '2000s, 1900s, 500 BCE',
  };
  return placeholders[unit];
};

export const getOrdinalSuffix = (n: number): string => {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

export const formatDateForUnit = (date: Date, unit: TimeUnit): string => {
  const year = date.getFullYear();
  const isBC = year < 1;

  switch (unit) {
    case TimeUnit.DAY:
      return format(date, 'EEEE, MMMM d, yyyy');

    case TimeUnit.WEEK:
      return `Week of ${format(date, 'MMMM d, yyyy')}`;

    case TimeUnit.MONTH:
      return format(date, 'MMMM yyyy');

    case TimeUnit.YEAR:
      return format(date, 'yyyy');

    case TimeUnit.YEAR_100:
      const century = Math.ceil(Math.abs(year) / 100);
      return isBC
        ? `${century}th century BCE (${year})`
        : `${century}th century CE (${year})`;

    default:
      return format(date, 'EEEE, MMMM d, yyyy');
  }
};

export const addUnitToDate = (
  unit: TimeUnit,
  date: dayjs.Dayjs,
  unitCount: number
) => {
  switch (unit) {
    case TimeUnit.DAY:
      return date.add(unitCount, 'day');
    case TimeUnit.WEEK:
      return date.add(unitCount, 'week');
    case TimeUnit.MONTH:
      return date.add(unitCount, 'month');
    case TimeUnit.YEAR:
      return date.add(unitCount, 'year');
    case TimeUnit.YEAR_100:
      return date.add(unitCount * 100, 'year');
    default:
      return date;
  }
};
