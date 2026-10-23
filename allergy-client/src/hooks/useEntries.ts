import { useLiveQuery } from "dexie-react-hooks";
import { getLocalEntries, getLocalEntry } from "../db/entries";
import { getRelativeDays } from "../utils/dates";

// One day. undefined = loading, null = no entry, Entry = logged
export const useEntry = (date: string) => {
  return useLiveQuery(async () => (await getLocalEntry(date)) ?? null, [date]);
}

// Date range for the 7-day chart
export const useEntries = (days: number = 7) => {
  const dates = getRelativeDays(days);
  const key = dates.join(",");
  return useLiveQuery(async () => await getLocalEntries(dates), [key]);
}
