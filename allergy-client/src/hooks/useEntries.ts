import { useLiveQuery } from "dexie-react-hooks";
import { getLocalEntries, getLocalEntry } from "../db/entries";

// One day. undefined = loading, null = no entry, Entry = logged
export const useEntry = (date: string) => {
  return useLiveQuery(async () => (await getLocalEntry(date)) ?? null, [date]);
}

// Date range for the 7-day chart
export const useEntries = (dates: string[]) => {
  const key = dates.join(",");
  return useLiveQuery(async () => await getLocalEntries(dates), [key]);
}
