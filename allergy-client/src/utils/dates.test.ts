import { getLast7Days } from './dates'

describe('getLast7Days', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns exactly 7 dates', () => {
    vi.setSystemTime(new Date('2026-06-25'))
    expect(getLast7Days()).toHaveLength(7)
  })

  it('ends with today', () => {
    vi.setSystemTime(new Date('2026-06-25'))
    const days = getLast7Days()
    expect(days[6]).toBe('2026-06-25')
  })

  it('starts 6 days ago', () => {
    vi.setSystemTime(new Date('2026-06-25'))
    const days = getLast7Days()
    expect(days[0]).toBe('2026-06-19')
  })

  it('is sorted oldest to newest', () => {
    vi.setSystemTime(new Date('2026-06-25'))
    const days = getLast7Days()
    expect(days).toEqual([...days].sort())
  })

  it('handles month boundaries correctly', () => {
    vi.setSystemTime(new Date('2026-07-03'))
    const days = getLast7Days()
    expect(days[0]).toBe('2026-06-27')
    expect(days[6]).toBe('2026-07-03')
  })
})