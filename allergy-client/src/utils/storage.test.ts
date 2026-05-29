import { describe, it, expect, beforeEach } from 'vitest'
import { getEntry, saveEntry, clearAllEntries, getTodayDate } from './storage'
import type { Entry } from '../schemas'

const today: string = getTodayDate();

const mockEntry: Entry = {
  date: today,
  severity: 2,
  symptoms: ['nose', 'eyes'],
  notes: 'taken antihistamine',
}

beforeEach(() => {
  clearAllEntries()  // fresh localStorage for every test
})

describe('getEntry', () => {
  it('returns null for a date with no entry', () => {
    expect(getEntry(today)).toBeNull()
  })

  it('returns the entry after saving', () => {
    saveEntry(mockEntry)
    expect(getEntry(today)).toEqual(mockEntry)
  })
})

describe('saveEntry', () => {
  it('overwrites an existing entry for the same date', () => {
    saveEntry(mockEntry)
    saveEntry({ ...mockEntry, severity: 1 })
    expect(getEntry(today)?.severity).toBe(1)
  })

  it('throws on invalid severity', () => {
    expect(() => saveEntry({ ...mockEntry, severity: 99 as never })).toThrow()
  })
})