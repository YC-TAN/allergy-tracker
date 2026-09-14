/** 'en-CA' locale formats as YYYY-MM-DD, same as ISO string
 * using NZ time regardless of device timezone.
 */
const formatLocalDate = (d: Date): string => {
  return d.toLocaleDateString("en-CA", { timeZone: "Pacific/Auckland" });
};

export const getTodayDate = (): string => {
  return formatLocalDate(new Date());
};

export const getNZTodayDateString = (): string => {
  return new Date().toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Pacific/Auckland",
  });
};

export const getNZTodayDayOfWeek = (): string => {
  return new Date().toLocaleDateString("en-NZ", {
    weekday: "long",
    timeZone: "Pacific/Auckland",
  });
};

export const getLast7Days = (): string[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return formatLocalDate(d);
  });
};

export const getRelativeDays = (
  numOfDays: number = 7,
  includeToday: boolean = true
): string[] => {
  return Array.from({length: numOfDays}, (_, i) => {
    const d = new Date();
    const offset = includeToday ? numOfDays - 1- i: numOfDays - i;
    d.setDate(d.getDate() - offset);
    return formatLocalDate(d);
  })
}
