import { describe, it, expect } from "vitest";
import { getLocalEntry, upsertLocalEntry } from "./entries";
import { db } from "./client";
import { getTodayDate } from "../utils/dates";
import { EntryLocalSchema, type EntryInput, ENTRY_LOCAL_SCHEMA_VERSION } from "../schemas";

const today = getTodayDate();

const input: EntryInput = {
  date: today,
  severity: 2,
  symptoms: ["nose"],
  notes: "",
  honey: false,
  location: "Christchurch Central",
};

const createTestEntry = async () => {
  const parsed = EntryLocalSchema.parse(input);
  await db.entries.add(parsed);
  return parsed;
};

describe("getLocalEntry", () => {
  it("returns null if not exists", async () => {
    const nonExistingEntry = await getLocalEntry(today);
    expect(nonExistingEntry).toBeNull();
  });

  it("returns entry if exists", async () => {
    const entry = await createTestEntry();
    const existingEntry = await getLocalEntry(today);
    expect(existingEntry).toEqual(entry);
  });
});

describe("UpsertLocalEntry", () => {
  it("stores the entry with local fields filled in", async () => {
    const saved = await upsertLocalEntry(input as EntryInput);
    const row = await db.entries.get(saved.date);

    expect(row).toEqual(saved);
    expect(row).toMatchObject({ _synced: false, _v: ENTRY_LOCAL_SCHEMA_VERSION });
  });
  it("creates one row per date, saving same date overwrites it", async () => {
    await upsertLocalEntry(input as EntryInput);
    expect(await db.entries.count()).toBe(1);

    const second = await upsertLocalEntry({ ...input, severity: 3 });

    expect(await db.entries.count()).toBe(1);
    expect(second.severity).toBe(3);
  });

  it("stores severity 0 as 0, not dropped", async () => {
    const entry = await upsertLocalEntry({ ...input, severity: 0 });
    const localEntry = await db.entries.get(entry.date);
    expect(localEntry?.severity).toBe(0);
  });

  it("does not create duplicates on concurrent calls", async () => {
    await Promise.all([upsertLocalEntry(input), upsertLocalEntry(input)]);
    expect(await db.entries.count()).toBe(1);
  });

  it("rejects invalid input and writes nothing", async () => {
    await expect(
      upsertLocalEntry({ ...input, severity: 9 }),
    ).rejects.toThrow();
    expect(await db.entries.count()).toBe(0);
  });

  it("stores no symptoms if severity is 0", async () => {
    const entry = await upsertLocalEntry({ ...input, severity: 0 });
    expect(entry.severity).toBe(0);
    expect(entry.symptoms).toHaveLength(0);
  });

  //   it("marks new and edited records unsynced", async () => {
  //     const e = await entriesDb.upsert(input);
  //     await entriesDb.markSynced([e.id]);
  //     await entriesDb.upsert({ ...input, severity: 1 });
  //     expect(await entriesDb.unsynced()).toHaveLength(1);
  //   });
});
