import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';

export enum TimeUnit {
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
  YEAR = 'year',
}

export const formatHistoricalYear = (year: number): string => {
  if (year < 1) {
    return `-${Math.abs(year - 1)}`;
  }
  return `${year}`;
};

export const getUnitLabel = (unit: TimeUnit) => {
  const labels: Record<TimeUnit, string> = {
    [TimeUnit.DAY]: 'day(s)',
    [TimeUnit.WEEK]: 'week(s)',
    [TimeUnit.MONTH]: 'month(s)',
    [TimeUnit.YEAR]: 'year(s)',
  };
  return labels[unit];
};

/** Return unit by lines for web and mobile devices */
export const getUnitByLine = (unit: TimeUnit) => {
  const labels: Record<TimeUnit, [number, number]> = {
    [TimeUnit.DAY]: [30, 15],
    [TimeUnit.WEEK]: [52, 17],
    [TimeUnit.MONTH]: [12, 12],
    [TimeUnit.YEAR]: [25, 10],
  };
  return labels[unit];
};

export const getUnitExample = (unit: TimeUnit) => {
  const labels: Record<TimeUnit, string> = {
    [TimeUnit.DAY]: 'My year',
    [TimeUnit.WEEK]: 'My life',
    [TimeUnit.MONTH]: 'The 80s',
    [TimeUnit.YEAR]: 'The Roman Empire',
  };
  return labels[unit];
};

export const getPlaceholderForUnit = (unit: TimeUnit): string => {
  const placeholders: Record<TimeUnit, string> = {
    [TimeUnit.DAY]: 'today, tomorrow, Jan 15, 2025',
    [TimeUnit.WEEK]: 'this week, next week, Jan 2025',
    [TimeUnit.MONTH]: 'this month, Jan 2025, 2025-01, in 3 month',
    [TimeUnit.YEAR]: 'this year, past year, 10 year ago, in 100 year',
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
  const historicalYear = formatHistoricalYear(year);

  switch (unit) {
    case TimeUnit.DAY:
      return `${format(date, 'dd MMM')} ${historicalYear}`;

    case TimeUnit.WEEK:
      return `${historicalYear} week ${format(date, 'w')}`;

    case TimeUnit.MONTH:
      return `${format(date, 'MMM')} ${historicalYear}`;

    case TimeUnit.YEAR:
      return historicalYear;

    default:
      throw new Error(`formatDateForUnit: unit ${unit} not supported`);
  }
};

export const addUnitToDate = (
  unit: TimeUnit,
  date: Date,
  unitCount: number
) => {
  switch (unit) {
    case TimeUnit.DAY:
      return addDays(date, unitCount);
    case TimeUnit.WEEK:
      return addWeeks(date, unitCount);
    case TimeUnit.MONTH:
      return addMonths(date, unitCount);
    case TimeUnit.YEAR:
      return addYears(date, unitCount);
    default:
      throw new Error(`addUnitToDate: unit ${unit} not supported`);
  }
};

export const getYearForUnitIndex = (
  startDate: Date,
  unit: TimeUnit,
  unitIndex: number,
  unitsPerLine: number
): number => {
  const lineIndex = Math.floor(unitIndex / unitsPerLine);
  const unitsToAdd = lineIndex * unitsPerLine;
  const targetDate = addUnitToDate(unit, startDate, unitsToAdd);
  return targetDate.getFullYear();
};

export const getChunkCountFromDates = (
  unit: TimeUnit,
  startDate: Date,
  endDate: Date
): number => {
  switch (unit) {
    case TimeUnit.DAY:
      return Math.max(1, differenceInDays(endDate, startDate) + 1);
    case TimeUnit.WEEK:
      return Math.max(1, differenceInWeeks(endDate, startDate) + 1);
    case TimeUnit.MONTH:
      return Math.max(1, differenceInMonths(endDate, startDate) + 1);
    case TimeUnit.YEAR:
      return Math.max(1, differenceInYears(endDate, startDate) + 1);
    default:
      throw new Error(`getChunkCountFromDates: unit ${unit} not supported`);
  }
};
