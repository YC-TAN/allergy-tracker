import { renderHook, act, waitFor } from '@testing-library/react'
import { useSettings } from './useSettings'
import { createWrapper } from '../test-utils'

beforeEach(() => localStorage.clear())

describe('useSettings', () => {
  it('returns schema defaults when nothing is stored', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isPending).toBe(false))
    expect(result.current.settings).toEqual({ notify: false, notify_time: '20:00' })
  })

  it('updates settings and reflects in query cache', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isPending).toBe(false))

    act(() => { result.current.update({ notify: true, notify_time: '08:00' }) })

    await waitFor(() =>
      expect(result.current.settings).toEqual({ notify: true, notify_time: '08:00' })
    )
  })

  it('persists settings to localStorage', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isPending).toBe(false))

    act(() => { result.current.update({ notify: true, notify_time: '07:00' }) })
    await waitFor(() => expect(result.current.settings?.notify).toBe(true))

    const stored = JSON.parse(localStorage.getItem('allergy_settings')!)
    expect(stored.notify_time).toBe('07:00')
  })
})