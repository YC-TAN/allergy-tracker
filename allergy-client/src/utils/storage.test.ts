import { describe, it, expect, beforeEach } from 'vitest'
import { getEntry, saveEntry, clearAllEntries, getTodayDate } from './storage'
import type { Entry } from '../schemas'

const today: string = getTodayDate();
const key = 'test_allergy_entries'

const mockEntry: Entry = {
  date: today,
  severity: 2,
  symptoms: ['nose', 'eyes'],
  notes: 'taken antihistamine',
}

beforeEach(() => {
  clearAllEntries(key)  // fresh localStorage for every test
})

describe('getEntry', () => {
  it('returns null for a date with no entry', () => {
    expect(getEntry(today, key)).toBeNull()
  })

  it('returns the entry after saving', () => {
    saveEntry(mockEntry, key)
    expect(getEntry(today, key)).toEqual(mockEntry)
  })
})

describe('saveEntry', () => {
  it('overwrites an existing entry for the same date', () => {
    saveEntry(mockEntry, key)
    saveEntry({ ...mockEntry, severity: 1 }, key)
    expect(getEntry(today, key)?.severity).toBe(1)
  })

  it('throws on invalid severity', () => {
    expect(() => saveEntry({ ...mockEntry, severity: 99 as never }, key)).toThrow()
  })
})