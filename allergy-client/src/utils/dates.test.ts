import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getLast7Days,
  getRelativeDays,
  getTodayNZ,
  getNZTodayDateString,
  getNZTodayDayOfWeek,
} from './dates'

describe('NZ date helpers', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  describe('getLast7Days', () => {
    it('returns the exact 7 days, oldest first, ending today', () => {
      vi.setSystemTime(new Date('2026-06-25T00:00:00Z'))
      expect(getLast7Days()).toEqual([
        '2026-06-19', '2026-06-20', '2026-06-21', '2026-06-22',
        '2026-06-23', '2026-06-24', '2026-06-25',
      ])
    })

    it('crosses a month boundary', () => {
      vi.setSystemTime(new Date('2026-07-03T00:00:00Z'))
      const days = getLast7Days()
      expect(days[0]).toBe('2026-06-27')
      expect(days[6]).toBe('2026-07-03')
    })
  })

  describe('NZ vs UTC date', () => {
    it('is still the 25th in NZ at 23:59', () => {
      vi.setSystemTime(new Date('2026-06-25T11:59:00Z')) // 23:59 NZST
      expect(getTodayNZ()).toBe('2026-06-25')
    })

    it('flips to the 26th in NZ at midnight, while UTC is still the 25th', () => {
      vi.setSystemTime(new Date('2026-06-25T12:00:00Z')) // 00:00 NZST
      expect(getTodayNZ()).toBe('2026-06-26')
      expect(getLast7Days()[6]).toBe('2026-06-26')
    })
  })

  describe('getRelativeDays', () => {
    it('defaults to 7 days including today', () => {
      vi.setSystemTime(new Date('2026-06-25T00:00:00Z'))
      expect(getRelativeDays()).toEqual(getLast7Days())
    })

    it('excludes today when includeToday is false', () => {
      vi.setSystemTime(new Date('2026-06-25T00:00:00Z'))
      expect(getRelativeDays(3, false)).toEqual([
        '2026-06-22', '2026-06-23', '2026-06-24',
      ])
    })

    it('handles 1 and 0 days', () => {
      vi.setSystemTime(new Date('2026-06-25T00:00:00Z'))
      expect(getRelativeDays(1)).toEqual(['2026-06-25'])
      expect(getRelativeDays(0)).toEqual([])
    })

    it('crosses a year boundary', () => {
      vi.setSystemTime(new Date('2027-01-02T00:00:00Z'))
      expect(getRelativeDays(4)).toEqual([
        '2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02',
      ])
    })

    it('includes Feb 29 in a leap year', () => {
      vi.setSystemTime(new Date('2028-03-01T00:00:00Z'))
      expect(getRelativeDays(3)).toEqual([
        '2028-02-28', '2028-02-29', '2028-03-01',
      ])
    })

    it('is correct across DST start (NZDT begins 27 Sep 2026)', () => {
      vi.setSystemTime(new Date('2026-09-30T00:00:00Z'))
      expect(getRelativeDays(7)).toEqual([
        '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27',
        '2026-09-28', '2026-09-29', '2026-09-30',
      ])
    })

    it('is correct across DST end (NZST begins 5 Apr 2026)', () => {
      vi.setSystemTime(new Date('2026-04-08T00:00:00Z'))
      expect(getRelativeDays(7)).toEqual([
        '2026-04-02', '2026-04-03', '2026-04-04', '2026-04-05',
        '2026-04-06', '2026-04-07', '2026-04-08',
      ])
    })
  })

  describe('display helpers', () => {
    it('formats the long date and weekday in NZ time', () => {
      vi.setSystemTime(new Date('2026-11-12T12:00:00Z')) // 13 Nov 01:00 NZDT
      expect(getNZTodayDateString()).toBe('13 November 2026')
      expect(getNZTodayDayOfWeek()).toBe('Friday')
    })
  })
})