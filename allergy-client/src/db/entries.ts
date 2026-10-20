/**
 * Reads and Writes entries into Dexie
 */

import { db } from "./client";
import { EntryLocalSchema, type EntryInput, type EntryLocal } from "../schemas";

export const getLocalEntry = async (
  date: string,
): Promise<EntryLocal | null> => {
  const entry = await db.entries.get(date);
  return entry ? EntryLocalSchema.parse(entry) : null;
};

/**
 * Error will be handled by tanStack Query
 * @param entry submitted by user
 * @returns parsed entry
 */
export const upsertLocalEntry = async (
  entry: EntryInput,
): Promise<EntryLocal> => {
  const parsedEntry = EntryLocalSchema.parse(entry);
  await db.entries.put(parsedEntry);
  return parsedEntry;
};

export const upsertLocalEntries = async (
  entries: EntryInput[],
): Promise<EntryLocal[]> => {
  const parsedEntries = entries.map((entry) =>
    EntryLocalSchema.parse(entry),
  );

  await db.transaction("rw", db.entries, async () => {
    await db.entries.bulkPut(parsedEntries);
  });

  return parsedEntries;
};

export const clearLocalEntries = async (): Promise<void> => {
  await db.entries.clear();
};

export const getUnsyncedEntries = async (): Promise<EntryLocal[]> => {
  const entries = await db.entries.filter((entry) => entry._synced === false).toArray();

  return entries.map((entry) => EntryLocalSchema.parse(entry));
};

export const markEntriesSynced = async (dates: string[]): Promise<void> => {
  if (dates.length === 0) return;
  // rw - read write transaction
  await db.transaction("rw", db.entries, async () => {
    for (const date of dates) {
      const entry = await db.entries.get(date);

      if (!entry) continue;

      const parsedEntry = EntryLocalSchema.parse({
        ...entry,
        _synced: true,
      });

      await db.entries.put(parsedEntry);
    }
  });
};
