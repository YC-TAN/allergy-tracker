import { db } from "./client";
import { EntryLocalSchema, type EntryLocal } from "../schemas";

export const getLocalEntry = async (
  date: string,
): Promise<EntryLocal | null> => {
  const entry = await db.entries.get(date);
  return entry ? EntryLocalSchema.parse(entry) : null;
};
