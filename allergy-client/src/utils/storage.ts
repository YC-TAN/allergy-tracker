/**
 * Storage utilities for allergy tracker entries.
 *
 * This module handles save / load operations using browser localStorage.
 * Entries are stored as JSON strings under a key formed from a fixed prefix
 * and the entry date, so each date maps to one saved allergy entry.
 */
import { type Entry } from '../schemas'

// Prefix used for localStorage keys
const PREFIX = 'allergy_entry_'

export function getEntry(date: string): Entry | null {
  try {
    const raw = localStorage.getItem(PREFIX + date)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveEntry(entry: Entry): void {
  try {
    localStorage.setItem(PREFIX + entry.date, JSON.stringify(entry))
  } catch {
    console.error('Failed to save entry')
  }
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}