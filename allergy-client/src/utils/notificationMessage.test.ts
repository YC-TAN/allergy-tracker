import { MSG, selectNotificationMessage, type SyncResult } from './notificationMessage'

type Row = [
  label: string,
  signedIn: boolean,
  online: boolean,
  sync: SyncResult,
  expected: string | null,
]

const rows: Row[] = [
  // AC3: signed out always gets the local-only message
  ['AC3 signed out, online', false, true, 'skipped', MSG.localOnly],
  ['AC3 signed out, offline', false, false, 'skipped', MSG.localOnly],
  ['AC3 signed out ignores a stray sync result', false, true, 'accepted', MSG.localOnly],

  // AC4: signed in, offline
  ['AC4 signed in, offline, no sync', true, false, 'skipped', MSG.offline],
  ['AC4 signed in, offline, transient failure', true, false, 'transient-failure', MSG.offline],

  // AC5: signed in, online
  ['AC5 immediate message before sync', true, true, 'skipped', MSG.savedOnDevice],
  ['AC5 accepted', true, true, 'accepted', MSG.synced],
  ['AC5 transient failure', true, true, 'transient-failure', MSG.willSyncLater],

  // AC11: rejection is shown by the persistent notice, not a snackbar
  ['AC11 rejected, online', true, true, 'rejected', null],

  // navigator.onLine is only a hint: a real result wins
  ['accepted even if onLine says offline', true, false, 'accepted', MSG.synced],
  ['rejected even if onLine says offline', true, false, 'rejected', null],

  // expired session falls back to the neutral message
  ['session expired, online', true, true, 'session-expired', MSG.savedOnDevice],
]

describe('selectNotificationMessage', () => {
  it.each(rows)('%s', (_label, signedIn, online, sync, expected) => {
    expect(selectNotificationMessage({ signedIn, online, sync })).toBe(expected)
  })

  it('covers every signedIn, online, and sync combination without throwing', () => {
    const syncs: SyncResult[] = [
      'accepted', 'transient-failure', 'rejected', 'session-expired', 'skipped',
    ]
    for (const signedIn of [true, false])
      for (const online of [true, false])
        for (const sync of syncs)
          expect(() => selectNotificationMessage({ signedIn, online, sync })).not.toThrow()
  })
})