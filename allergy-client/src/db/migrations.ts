import {z} from "zod";
import { db } from "./client";
import { loadAll } from "../utils/storage";
import { EntryLocalSchema, ENTRY_LOCAL_SCHEMA_VERSION, type EntryLocal } from "../schemas/entry";


const MIGRATION_KEY = "legacy-localstorage-to-dexie-v1";

/** Reshape a legacy record into the current local shape. Adjust to your real legacy fields. */
const toCurrentShape = (raw: any) => ({
  ...raw,
  _synced: raw._synced ? 1 : 0, // boolean → 0 | 1
  _revision: raw._revision ?? 0, // same rule as AC14
  _v: ENTRY_LOCAL_SCHEMA_VERSION,
});

export const migrateLegacyEntries = async (): Promise<void> => {
  if (localStorage.getItem(MIGRATION_KEY) === "complete") return;

  const valid: EntryLocal[] = [];
  for (const raw of Object.values(loadAll())) {
    const result = EntryLocalSchema.safeParse(toCurrentShape(raw));
    if (result.success) valid.push(result.data);
    else console.warn("Skipped legacy entry", z.flattenError(result.error));
  }

  // Insert only missing dates, so newer Dexie data is never overwritten
  await db.transaction("rw", db.entries, async () => {
    for (const entry of valid) {
      if (!(await db.entries.get(entry.date))) await db.entries.add(entry);
    }
  });

  // 3. Flag only after the write succeeded; legacy data is left in place
  localStorage.setItem(MIGRATION_KEY, "complete");
};