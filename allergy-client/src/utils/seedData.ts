import { EntrySchema } from "../schemas";
import { saveEntry, clearAllEntries } from "./storage";

const MOCK_ENTRIES = [
  { date: '2026-08-28', severity: 0, symptoms: [], notes: '' },
  { date: '2026-08-29', severity: 1, symptoms: ['nose'], notes: '' },
  { date: '2026-08-30', severity: 2, symptoms: ['eyes', 'nose', 'throat'], notes: 'Windy' },
  { date: '2026-08-31', severity: 3, symptoms: ['eyes', 'nose', 'headache'], notes: 'Drying clothes indoor' },
  { date: '2026-09-01', severity: 1, symptoms: ['nose'], notes: '' },
  { date: '2026-06-16', severity: 0, symptoms: [], notes: '' },
] as const;

export const seedMockEntries = () => {
    MOCK_ENTRIES.forEach((data) => {
        const entry = EntrySchema.parse(data);
        saveEntry(entry);
    })
    console.log('dev mock data seeded', MOCK_ENTRIES.length, 'entries to localStorage');
}

export const resetMockEntries = () => {
  clearAllEntries();
  seedMockEntries();
}