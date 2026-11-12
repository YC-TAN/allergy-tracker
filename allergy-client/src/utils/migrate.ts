/** Run this before every send to server to ensure the shape is up-to-date
 *  To handle cases where records might be saved offline for a while and the schema shape has changed in between saved and synced
 */

import { z } from "zod";
import { ENTRY_LOCAL_SCHEMA_VERSION, EntryLocalSchema, type EntryLocal } from "../schemas/entry";

export type MigrateResult =
  | { ok: true; entry: EntryLocal }
  | { ok: false; error: string };

/**
 * Brings one stored record up to the current schema version.
 * Pure: takes unknown data, returns a result, never throws, never touches Dexie.
 * Does not change `date`.
 */
export function migrateEntry(input: unknown): MigrateResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "Record is not an object" };
  }

  // Work on a copy so the caller's record is never mutated
  let r: Record<string, unknown> = { ...(input as Record<string, unknown>) };

  // Records from before _v existed are treated as version 0
  const startVersion = typeof r._v === "number" ? r._v : 0;

  if (startVersion > ENTRY_LOCAL_SCHEMA_VERSION) {
    return { ok: false, error: `Record version ${startVersion} is newer than ${ENTRY_LOCAL_SCHEMA_VERSION}` };
  }

  if (r._v === undefined || r._v === 0 || r._v === 1) {
    r = {
      ...r,
      _synced: r._synced ? 1 : 0,   
      _revision: r._revision ?? 0,
      _v: ENTRY_LOCAL_SCHEMA_VERSION,
    };
  }

  const result = EntryLocalSchema.safeParse(r);
  if (!result.success) {
    return { ok: false, error: JSON.stringify(z.flattenError(result.error)) };
  }
  return { ok: true, entry: result.data };
}