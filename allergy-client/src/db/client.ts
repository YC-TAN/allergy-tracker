/**
 * Dexie is a wrapper of IndexedDB, it create and open IndexedDB database.
 * EntityTable is a type that describes a table containing object with a known primary key.
 */

import Dexie, { type EntityTable } from "dexie";
import type { EntryLocal } from "../schemas";

/**
 * Create new IndexedDB with name "allergy-tracker" and assert the instance as a Dexie object
 * The instance has entries table and its shape and primary key
 */
export const db = new Dexie("allergy-tracker") as Dexie & {
    entries: EntityTable<EntryLocal, "date">;
};

/** Version 1 
 * entries table is keyed by date and indexed by sync status
 */
db.version(1).stores({
    entries: "date, _synced",
});

