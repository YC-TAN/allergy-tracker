import { db } from "./client";
import { loadAll } from "../utils/storage";
import { EntryLocalSchema } from "../schemas";


const MIGRATION_KEY = "legacy-localstorage-to-dexie-v1";

export const migrateLegacyEntries = async (): Promise<void> => {
  if (localStorage.getItem(MIGRATION_KEY) === "complete") {
    return;
  }

  const legacyEntries = loadAll();

  await db.transaction("rw", db.entries, async () => {
    for (const entry of Object.values(legacyEntries)) {
      const parsed = EntryLocalSchema.parse(entry);
      await db.entries.put(parsed);
    }
  });

  localStorage.setItem(MIGRATION_KEY, "complete");
}