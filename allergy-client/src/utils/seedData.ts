import { EntrySchema } from "../schemas";
import { getRelativeDays } from "./dates";
import { saveEntry, clearAllEntries } from "./storage";

const MOCK_ENTRIES = [
  { severity: 0, symptoms: [], notes: "" },
  { severity: 1, symptoms: ["nose"], notes: "" },
  { severity: 2, symptoms: ["eyes", "nose", "throat"], notes: "Windy" },
  {
    severity: 0,
    symptoms: ["eyes", "nose", "headache"],
    notes: "Drying clothes indoor",
  },
  { severity: 1, symptoms: ["nose"], notes: "" },
  { severity: 3, symptoms: [], notes: "" },
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
