/**
 * Reads and Writes entries into Dexie
 */
import { db } from "./client";
import {
  EntryLocalSchema,
  type EntryInput,
  type EntryLocal,
  type EntryResponse,
  type PushedRef,
} from "../schemas";

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
  input: EntryInput,
): Promise<EntryLocal> => {
  const parsedEntry = EntryLocalSchema.parse(input);
  return await db.transaction("rw", db.entries, async () => {
    const existing = await db.entries.get(parsedEntry.date);

    const next: EntryLocal = {
      ...parsedEntry,
      _revision: (existing?._revision ?? 0) + 1, // update revision for every edit
      _synced: false,
    };

    await db.entries.put(next);
    return next;
  });
};

export const upsertLocalEntries = async (
  entries: EntryInput[],
): Promise<EntryLocal[]> => {
  const parsedEntries = entries.map((entry) => EntryLocalSchema.parse(entry));

  await db.transaction("rw", db.entries, async () => {
    await db.entries.bulkPut(parsedEntries);
  });

  return parsedEntries;
};

export const clearLocalEntries = async (): Promise<void> => {
  await db.entries.clear();
};

export const getUnsyncedLocalEntries = async (): Promise<EntryLocal[]> => {
  const entries = await db.entries
    .filter((entry) => entry._synced === false)
    .toArray();

  return entries.map((entry) => EntryLocalSchema.parse(entry));
};

export const markLocalEntriesSynced = async (
  snapshot: PushedRef[],
): Promise<void> => {
  if (snapshot.length === 0) return;
  // rw - read write transaction
  await db.transaction("rw", db.entries, async () => {
    for (const { date, _revision } of snapshot) {
      await db.entries
        .where("date")
        .equals(date)
        .and((cur) => cur._revision === _revision) // same revision since we read it?
        .modify({ _synced: true });
    }
  });
};

export const saveRemoteEntries = async (remote: EntryResponse[]): Promise<void> => {
  if (remote.length === 0) return;

  await db.transaction("rw", db.entries, async () => {
    const existing = await db.entries.bulkGet(remote.map((r) => r.date));
    const toSave = remote
      .filter((_, i) => !existing[i]) // only dates still missing at write time
      .map((r) => EntryLocalSchema.parse({ ...r, _synced: true }));
    await db.entries.bulkPut(toSave);
  });
};

export const getLocalEntriesByDates = async (dates: string[]): Promise<(EntryLocal | null)[]> => {
  const entries = await db.entries.bulkGet(dates);
  return entries.map(e => e ? EntryLocalSchema.parse(e): null)
}