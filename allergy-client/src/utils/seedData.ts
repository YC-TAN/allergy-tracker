/**
 * Replaced localStorage with IndexedDB
 */

import { getRelativeDays } from "./dates";
import { upsertLocalEntries, clearLocalEntries } from "../db/entries";

const MOCK_ENTRIES = [
  {
    severity: 0,
    symptoms: [],
    notes: "",
    honey: false,
    location: "Christchurch Central",
  },
  {
    severity: 1,
    symptoms: ["nose"],
    notes: "",
    honey: true,
    location: "Upper Hutt",
  },
  {
    severity: 2,
    symptoms: ["eyes", "nose", "throat"],
    notes: "Windy",
    honey: false,
    location: "Christchurch Central",
  },
  {
    severity: 0,
    symptoms: ["eyes", "nose", "headache"],
    notes: "Drying clothes indoor",
    honey: true,
    location: "Upper Hutt",
  },
  {
    severity: 1,
    symptoms: ["nose"],
    notes: "",
    honey: false,
    location: "Upper Hutt",
  },
  {
    severity: 3,
    symptoms: [],
    notes: "",
    honey: true,
    location: "Christchurch Central",
  },
] as const;

export const seedMockEntries = async (): Promise<void> => {
  const previous7days = getRelativeDays(MOCK_ENTRIES.length, false);

  const entries = MOCK_ENTRIES.map((entry, index) => ({
    date: previous7days[index],
    ...entry,
    symptoms: [...entry.symptoms],
    _synced: true, // set to true during dev so it will not be uploaded to backend
  }));
  
  await upsertLocalEntries(entries);

  console.log(
    "dev mock data seeded",
    entries.length,
    "entries to IndexedDB",
    entries,
  );
};

export const resetMockEntries = async (): Promise<void> => {
  await clearLocalEntries();
  await seedMockEntries();
};
