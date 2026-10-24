/**
 * Run Sync on connect and signed in at Shell
 * always sync last 7 days entries, cover today and trend chart
 */
import { ApiError } from "../lib/error";
import { ZodError } from "zod";
import { getRemoteEntries, migrateEntries } from "./entry";
import {
  getUnsyncedLocalEntries,
  markLocalEntriesSynced,
  saveRemoteEntries,
} from "../db/entries";
import useNotificationStore from "../stores/useNotificationStore";
import { type PushedRef, type EntryInput, EntrySchema } from "../schemas";
import useSyncStore from "../stores/useSyncStore";
import useAuthStore from "../stores/useAuthStore";

type SyncOptions = { pull?: boolean };

type InvalidEntry = { date: string; issues: string[] };

type PushResult = {
  pushed: number; // confirmed by server
  failedDates: string[]; // server rejected these
  invalid: InvalidEntry[]; // failed local Zod validation, never sent
};

let running: Promise<void> | null = null;

// Single-flight: overlapping triggers (online + visibility + save) share one run
export const syncEntries = ({ pull = true }: SyncOptions = {}) => {
  running ??= doSync(pull).finally(() => {
    running = null;
  });
  return running;
};

//NOTE: if an upsert happen during sync, local _synced will remain false 
// because the version is different
// and happen in transaction

const doSync = async (pull: boolean) => {
  const { show } = useNotificationStore.getState().actions;
  const user = useAuthStore.getState().user;

  if (!navigator.onLine) return;
  if (!user) return;

  try {
    const push = await pushDirty();
    if (push.invalid.length > 0) {
      console.error("Invalid local entries", push.invalid); // full field-level detail
      show("Some entries have invalid data and weren't synced.", "error");
    }
    if (push.failedDates.length > 0) {
      console.warn("Server rejected entries", push.failedDates);
      show("Some entries couldn't sync. We'll retry.", "warning");
    } // push BEFORE pull so local edits aren't overwritten
    if (pull) {
      await pullRecent();
      useSyncStore.setState({ hydrated: true });
    }
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 401) {
      show("Session expired. Please sign in again to sync.", "warning");
    } else if (
      err instanceof ZodError ||
      (err instanceof ApiError && err.statusCode < 500)
    ) {
      // Retrying won't fix this, so make it visible during development
      console.error("Sync rejected", err);
      show("Couldn't sync your entries.", "error");
    } else {
      console.warn("Sync rejected", err);
    }
  }
};

const formatIssues = (error: ZodError) =>
  error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`);

const pushDirty = async (): Promise<PushResult> => {
  const out: PushResult = { pushed: 0, failedDates: [], invalid: [] };

  const dirty = await getUnsyncedLocalEntries();
  if (dirty.length === 0) return out;

  const valid: EntryInput[] = [];
  const sent: PushedRef[] = [];

  for (const row of dirty) {
    const result = EntrySchema.safeParse(row);
    if (result.success) {
      valid.push(result.data);
      sent.push({ date: row.date, _revision: row._revision });
    } else {
      out.invalid.push({ date: row.date, issues: formatIssues(result.error) });
    }
  }
  if (valid.length === 0) return out;
  const response = await migrateEntries(valid);

  const confirmed = new Set(response.synced);

  const syncedRefs = sent.filter(({ date }) => confirmed.has(date));
  await markLocalEntriesSynced(syncedRefs);

  out.pushed = response.synced.length;
  out.failedDates = response.failed;
  return out;
};

const pullRecent = async () => {
  const remoteEntries = await getRemoteEntries(7); // last seven days from server
  await saveRemoteEntries(remoteEntries);
};

// services/sync.ts
// import { getAuthUser } from "../stores/useAuthStore";

// const doSync = async () => {
//   // ...
//   if (!navigator.onLine) return sync.skip();
//   if (!getAuthUser()) return; // sync, no await

//   try {
//     sync.setSyncing();
//     await pushDirty();
//     await pullRecent();
//     if (!getAuthUser()) return sync.skip(); // signed out mid-sync
//     sync.setSuccess();
//   } catch (err) { /* unchanged */ }
// };
