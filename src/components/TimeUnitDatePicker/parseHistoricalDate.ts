export const parseHistoricalDate = (input: string): Date | null => {
  const bcRegex = /^(\d+)\s*(BC|BCE)$/i;
  const adRegex = /^(\d+)\s*(AD|CE)?$/i;

  const bcMatch = input.match(bcRegex);
  if (bcMatch && bcMatch[1]) {
    const year = -(parseInt(bcMatch[1]) - 1);
    return new Date(year, 0, 1);
  }

  const adMatch = input.match(adRegex);
  if (adMatch && adMatch[1]) {
    const year = parseInt(adMatch[1]);
    return new Date(year, 0, 1);
  }

  const date = new Date(input);
  return isNaN(date.getTime()) ? null : date;
};
