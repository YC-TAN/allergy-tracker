/**
 * Persistent storage helpers for allergy tracker data.
 *
 * This module abstracts access to browser localStorage for allergy entries.
 * It provides functions to read and write entries by date, validate data with
 * Zod, query ranges, delete entries, and reset stored data.
 */
import { EntrySchema, type Entry, type EntryInput } from '../schemas'

// Prefix used for localStorage keys
const ENTRIES_KEY = 'allergy_entries'

// Returns all entries from localStorage, or empty object if none
const loadAll = (key: string = ENTRIES_KEY): Record<string, Entry>  => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Saves the full entries map back to localStorage
const saveAll = (entries: Record<string, Entry>, key: string = ENTRIES_KEY): void => {
  localStorage.setItem(key, JSON.stringify(entries))
}

// Get a single entry by ISO date string ('YYYY-MM-DD')
export const getEntry = (date: string, key: string = ENTRIES_KEY): Entry | null => {
  const entries = loadAll(key)
  return entries[date] ?? null
}

// Save or overwrite an entry for its date
// Validates with Zod before saving — throws if invalid
export const saveEntry = (entry: EntryInput, key: string = ENTRIES_KEY): Entry => {
  const parsed = EntrySchema.parse(entry)
  const entries = loadAll(key)
  // if (entries[parsed.date]) {
  //   throw new Error(`Entry for ${parsed.date} already exists`)
  // }
  entries[parsed.date] = parsed
  saveAll(entries, key)
  return parsed
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
export function getEntriesInRange(from: string, to: string): Entry[] {
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
export function clearAllEntries(key: string = ENTRIES_KEY): void {
  localStorage.removeItem(key)
}

export const getTodayDate = (): string => {
  const d = new Date()
  const year  = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day   = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}