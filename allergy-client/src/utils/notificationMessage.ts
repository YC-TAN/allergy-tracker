/**Notification message */

export const MSG = {
  localOnly: 'Saved on this device only. Sign in to back up', // signed out
  offline: "Saved on this device, will sync when you're back online", // signed in and offline
  savedOnDevice: 'Saved on this device', // sync is skipped or session expired
  synced: 'Saved and synced', // signed in and online
  willSyncLater: 'Saved on this device, will sync later', // network error, signed in and online
} as const

export type SyncResult =
  | 'confirmed' // server confirmed receipt
  | 'transient-failure' // network/server error, will retry
  | 'rejected' // server permanently rejected the entry
  | 'session-expired' // signed in on paper, but the token is no longer valid
  | 'skipped' // no sync attempted (yet)

export interface MessageInput {
  signedIn: boolean
  online: boolean // navigator.onLine: only a hint
  sync: SyncResult
}

/**
 * Returns the message to show, or null when no snackbar should appear
 * (a permanent rejection is shown by the persistent Today-card notice, AC11).
 */
export function selectNotificationMessage({
  signedIn,
  online,
  sync,
}: MessageInput): string | null {
  // signed out, nothing to sync, whatever the other inputs say.
  if (!signedIn) return MSG.localOnly

  // A real sync result beats navigator.onLine, which can be wrong.
  if (sync === 'confirmed') return MSG.synced
  if (sync === 'rejected') return null

  // signed in but offline.
  if (!online) return MSG.offline

  // signed in, online.
  if (sync === 'transient-failure') return MSG.willSyncLater
  return MSG.savedOnDevice // 'skipped' or 'session-expired'
}