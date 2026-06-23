/**
 * Persistent storage helpers for allergy tracker data.
 *
 * This module abstracts access to browser localStorage for allergy entries.
 * It provides functions to read and write entries by date, validate data with
 * Zod, query ranges, delete entries, and reset stored data.
 */
import { EntrySchema, type Entry, type EntryInput } from '../schemas'

// Prefix used for localStorage keys
const KEYS = {
  entry: 'allergy_entries',
  notifyTime: 'allergy_notify_time'
} as const;

// Returns all entries from localStorage, or empty object if none
export const loadAll = (key: string = KEYS.entry): Record<string, Entry>  => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Saves the full entries map back to localStorage
export const saveAll = (entries: Record<string, Entry>, key: string = KEYS.entry): void => {
  localStorage.setItem(key, JSON.stringify(entries))
}

// Get a single entry by ISO date string ('YYYY-MM-DD')
export const getEntry = (date: string, key: string = KEYS.entry): Entry | null => {
  const entries = loadAll(key)
  return entries[date] ?? null
}

// Save or overwrite an entry for its date
// Validates with Zod before saving — throws if invalid
export const saveEntry = (entry: EntryInput, key: string = KEYS.entry): Entry => {
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
export function clearAllEntries(key: string = KEYS.entry): void {
  localStorage.removeItem(key)
}

// Notification 
export function getNotifyTime(): string {
  return localStorage.getItem(KEYS.notifyTime) ?? '20:00';
}

export function setNotifyTime(time: string): void {
  localStorage.setItem(KEYS.notifyTime, time);
}