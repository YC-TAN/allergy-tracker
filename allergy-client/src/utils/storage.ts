/**
 * Persistent storage helpers for allergy tracker data.
 *
 * This module abstracts access to browser localStorage for allergy entries.
 * It provides functions to read and write entries by date, validate data with
 * Zod, query ranges, delete entries, and reset stored data.
 */
import { EntrySchema, type Entry } from '../schemas'

// Prefix used for localStorage keys
const ENTRIES_KEY = 'allergy_entries'

// Returns all entries from localStorage, or empty object if none
function loadAll(): Record<string, Entry> {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Saves the full entries map back to localStorage
function saveAll(entries: Record<string, Entry>): void {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
}

// Get a single entry by ISO date string ('YYYY-MM-DD')
export function getEntry(date: string): Entry | null {
  const entries = loadAll()
  return entries[date] ?? null
}

// Save or overwrite an entry for its date
// Validates with Zod before saving — throws if invalid
export function saveEntry(entry: Entry): Entry {
  const parsed = EntrySchema.parse(entry)
  const entries = loadAll()
  entries[parsed.date] = parsed
  saveAll(entries)
  return parsed
}

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
export function clearAllEntries(): void {
  localStorage.removeItem(ENTRIES_KEY)
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}