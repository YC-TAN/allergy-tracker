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
