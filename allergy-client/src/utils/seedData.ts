import { EntrySchema } from "../schemas";
import { saveEntry } from "./storage";

const MOCK_ENTRIES = [
  { date: '2026-06-10', severity: 0, symptoms: [], notes: '' },
  { date: '2026-06-11', severity: 1, symptoms: ['nose'], notes: '' },
  { date: '2026-06-12', severity: 2, symptoms: ['eyes', 'nose', 'throat'], notes: 'Windy' },
  { date: '2026-06-13', severity: 3, symptoms: ['eyes', 'nose', 'headache'], notes: 'Drying clothes indoor' },
  { date: '2026-06-14', severity: 1, symptoms: ['nose'], notes: '' },
  // June 15 intentionally missing — simulates a forgotten day (null)
  { date: '2026-06-16', severity: 0, symptoms: [], notes: '' },
] as const;

export const seedMockEntries = () => {
    MOCK_ENTRIES.forEach((data) => {
        const entry = EntrySchema.parse(data);
        saveEntry(entry);
    })
    console.log('dev mock data seeded', MOCK_ENTRIES.length, 'entries to localStorage');
}