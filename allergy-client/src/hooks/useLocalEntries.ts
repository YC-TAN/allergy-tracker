import { useLiveQuery } from "dexie-react-hooks";
import { getTodayNZ } from "../utils/dates";
import { getLocalEntriesByDates, getLocalEntry } from "../db/entries";
import type { EntryLocal } from "../schemas/entry";

// One day. undefined = loading, null = no entry, Entry = logged
export const useEntry = (date: string = getTodayNZ()): EntryLocal | undefined | null => {
  return useLiveQuery(async () => (await getLocalEntry(date)) ?? null, [date]);
}

// Date range for the 7-day chart
export const useEntries = (dates: string[]) => {
  const key = dates.join(",");
  return useLiveQuery(async () => await getLocalEntriesByDates(dates), [key]);
}
