/**
 * Persistent storage helpers for allergy tracker data.
 *
 * This module abstracts access to browser localStorage for allergy entries.
 * It provides functions to read and write entries by date, validate data with
 * Zod, query ranges, delete entries, and reset stored data.
 */
import { EntryLocalSchema, SettingsSchema, type EntryLocal, type EntryInput, type Settings, type SettingsInput } from '../schemas'

// Prefix used for localStorage keys
const KEYS = {
  entry: 'allergy_entries',
  settings: 'allergy_settings'
} as const;

// Returns all entries from localStorage, or empty object if none
export const loadAll = (key: string = KEYS.entry): Record<string, EntryLocal>  => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Saves the full entries map back to localStorage
export const saveAll = (entries: Record<string, EntryLocal>, key: string = KEYS.entry): void => {
  localStorage.setItem(key, JSON.stringify(entries))
}

// Get a single entry by ISO date string ('YYYY-MM-DD')
export const getLocalEntry = (date: string, key: string = KEYS.entry): EntryLocal | null => {
  const entries = loadAll(key)
  return entries[date] ?? null
}

// Save or overwrite an entry for its date
// Validates with Zod before saving — throws if invalid
export const saveEntry = (entry: EntryInput, key: string = KEYS.entry): EntryLocal => {
  const parsed = EntryLocalSchema.parse(entry)
  const entries = loadAll(key)
  // if (entries[parsed.date]) {
  //   throw new Error(`Entry for ${parsed.date} already exists`)
  // }
  entries[parsed.date] = parsed
  saveAll(entries, key)
  return parsed
}

export const getUnsyncedEntries = (key: string = KEYS.entry): EntryLocal[] => {
  const entries = loadAll(key);
  return Object.values(entries).filter((entry) => !entry._synced);
}

// export const updateEntry(entry: Entry): Entry {
//   const parsed = EntrySchema.parse(entry)
//   const entries = loadAll()

//   if (!entries[parsed.date]) {
//     throw new Error(`No entry found for ${parsed.date}`)
//   }

//   entries[parsed.date] = parsed
//   saveAll(entries)
//   return parsed
// }

// Get entries for a date range (inclusive), sorted oldest → newest
export function getEntriesInRange(from: string, to: string): EntryLocal[] {
  const entries = loadAll()
  return Object.values(entries)
    .filter(e => e.date >= from && e.date <= to)
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Delete an entry by date (e.g. for correcting a mistake)
export function deleteEntry(date: string): void {
  const entries = loadAll()
  delete entries[date]
  saveAll(entries)
}

// Clear everything — useful for testing / logout
export const clearAllEntries = (key: string = KEYS.entry): void  => {
  localStorage.removeItem(key)
}

// Notification 
export const getSettings = (key: string = KEYS.settings): Settings => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return SettingsSchema.parse(JSON.parse(raw));
    
    // First run — write defaults to localStorage
    const defaults = SettingsSchema.parse({});
    localStorage.setItem(KEYS.settings, JSON.stringify(defaults));
    return defaults;
  } catch {
    return SettingsSchema.parse({});
  }
}

export const setSettings = (settings: SettingsInput, key: string = KEYS.settings): Settings => {
  const parsed = SettingsSchema.parse(settings);
  localStorage.setItem(key, JSON.stringify(parsed));
  return parsed
}


export const clearSettings = (key: string = KEYS.settings): void => {
  localStorage.removeItem(key);
}