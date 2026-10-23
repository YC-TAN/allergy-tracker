import { useLiveQuery } from "dexie-react-hooks";
import { getTodayDate } from "../utils/dates";
import { getLocalEntriesByDates, getLocalEntry } from "../db/entries";

// One day. undefined = loading, null = no entry, Entry = logged
export const useEntry = (date: string = getTodayDate()) => {
  return useLiveQuery(async () => (await getLocalEntry(date)) ?? null, [date]);
}

// Date range for the 7-day chart
export const useEntries = (dates: string[]) => {
  const key = dates.join(",");
  return useLiveQuery(async () => await getLocalEntriesByDates(dates), [key]);
}
