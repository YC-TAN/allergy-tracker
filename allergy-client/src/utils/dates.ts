/** 'en-CA' locale formats as YYYY-MM-DD, same as ISO string
 * using NZ time regardless of device timezone.
 */
const NZ_TZ = "Pacific/Auckland";

const isoFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: NZ_TZ });

const longDateFormatter = new Intl.DateTimeFormat("en-NZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: NZ_TZ,
});

const weekdayFormatter = new Intl.DateTimeFormat("en-NZ", {
  weekday: "long",
  timeZone: NZ_TZ,
});

export const formatDateNZ = (d: Date): string => isoFormatter.format(d);
export const getTodayNZ = (): string => formatDateNZ(new Date());

export const getNZTodayDateString = (): string =>
  longDateFormatter.format(new Date());

export const getNZTodayDayOfWeek = (): string => weekdayFormatter.format(new Date());

export const getRelativeDays = (
  numOfDays: number = 7,
  includeToday: boolean = true,
): string[] => {
  const [y, m, d] = getTodayNZ().split("-").map(Number);
  const lastOffset = includeToday ? 0 : 1; // days back for the final entry

  return Array.from({ length: numOfDays }, (_, i) => {
    const offset = numOfDays - 1 - i + lastOffset;
    // Date.UTC handles day underflow (e.g. day 0 or -3 rolls into the previous month)
    return new Date(Date.UTC(y, m - 1, d - offset)).toISOString().slice(0, 10);
  });
};

export const getLast7Days = (): string[] => getRelativeDays(7, true);