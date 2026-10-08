import { EntrySchema } from "../schemas";
import { getRelativeDays } from "./dates";
import { saveEntry, clearAllEntries } from "./storage";

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

export const seedMockEntries = () => {
  const previous7days = getRelativeDays(MOCK_ENTRIES.length, false);

  const entries = MOCK_ENTRIES.map((entry, index) => ({
    date: previous7days[index],
    ...entry,
  }));
  entries.forEach((e) => {
    const entry = EntrySchema.parse(e);
    saveEntry(entry);
  });
  console.log(
    "dev mock data seeded",
    MOCK_ENTRIES.length,
    "entries to localStorage",
    entries
  );
};

export const resetMockEntries = () => {
  clearAllEntries();
  seedMockEntries();
};
