/**
 * Run Sync on connect and signed in at Shell
 * always sync last 7 days entries, cover today and trend chart
 */
import { ApiError } from "../lib/error";
import { ZodError } from "zod";
import { getCurrentUser } from "./auth";
import { getRemoteEntries, migrateEntries } from "./entry";
import {
  getUnsyncedLocalEntries,
  markLocalEntriesSynced,
  saveRemoteEntries,
} from "../db/entries";
import useNotificationStore from "../stores/useNotificationStore";
import { type PushedRef, type EntryInput, EntrySchema } from "../schemas";

let running: Promise<void> | null = null;

// Single-flight: overlapping triggers (online + visibility + save) share one run
export const syncEntries = () => {
  running ??= doSync().finally(() => {
    running = null;
  });
  return running;
}

const doSync = async () => {
    const { show } = useNotificationStore.getState().actions;
    
  if (!navigator.onLine) return;
  if (!(await getCurrentUser())) return;

  try {
    await pushDirty(); // push BEFORE pull so local edits aren't overwritten
    await pullRecent();
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
      console.warn("Sync rejected", err)
    }
  }
};

const pushDirty = async () => {
  const dirty = await getUnsyncedLocalEntries();

  if (dirty.length === 0) return { status: "Nothing pending" };
  const valid: EntryInput[] = [];
  const sent: PushedRef[] = [];

  for (const row of dirty) {
    const result = EntrySchema.safeParse(row);
    if (result.success) {
      valid.push(result.data);
      sent.push({ date: row.date, _revision: row._revision });
    } else {
      console.error("Skipping invalid local entry", row.date, result.error);
    }
  }
  if (!valid.length) return;
  const response = await migrateEntries(valid);

  if (response.synced.length === 0)
    return { status: "sync failed", failedDates: response.failed };

  const confirmed = new Set(response.synced);

  const syncedRefs = sent.filter(({ date }) => confirmed.has(date));
  await markLocalEntriesSynced(syncedRefs);

  if (response.failed.length === 0) return { status: "sync completed" };

  return { status: "partial", failedDates: response.failed };
};

const pullRecent = async () => {
  const remoteEntries = await getRemoteEntries(7); // last seven days from server
  await saveRemoteEntries(remoteEntries);
}
