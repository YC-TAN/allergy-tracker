/**
 * Loads the daily allergy entry for a date and exposes a save mutation.
 *
 * When signed in and online, the server is the source of truth. 
 * IndexedDB as source if offline or when a network request cannot be completed.
 *
 * Successful saves new entry/ updates entry will show a success notification;
 * failures show an error notification.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLocalEntry, upsertLocalEntry } from "../db/entries";
import { upsertRemoteEntry, getRemoteEntry } from "../services/entry";
import { getTodayDate } from "../utils/dates";
import type { EntryInput, EntryLocal } from "../schemas";
import { useNotificationActions } from "../stores/useNotificationStore";
import { ApiError } from "../lib/error";
import { ZodError } from "zod";
import { useIsSignedIn } from "../stores/useAuthStore";

export const useEntryMutation = (date: string = getTodayDate()) => {
  const queryClient = useQueryClient();
  const { show } = useNotificationActions();
  const isSignedIn = useIsSignedIn();

  const result = useQuery({
    queryKey: ["entry", date],
    queryFn: async () => {
      const local = await getLocalEntry(date);

      // Unsynced local edits must not be replaced by an older server value.
      if (!isSignedIn || !navigator.onLine || local?._synced === false) {
        return local;
      }

      try {
        const remote = await getRemoteEntry(date);
        if (remote) {
          return await upsertLocalEntry({ ...remote, _synced: true });
        }
        return null;
      } catch (error) {
        // Keep showing the cached entry when the request failed due to a
        // network outage. API and validation errors should remain visible.
        if (!(error instanceof ApiError) && !(error instanceof ZodError)) {
          return local;
        }
        throw error;
      }
    },
    retry: (failureCount, err) => {
      // 404/400 won't fix itself, no need retry
      if (err instanceof ApiError && err.statusCode < 500) return false;
      if (err instanceof ZodError) return false;
      return failureCount < 2; // allow up to 2 retries for 5xx failures
    },
    staleTime: 5 * 60 * 1000, // Avoid repeatedly checking the server within 5 minutes.
  });

  const saveMutation = useMutation({
    mutationFn: async (input: EntryInput): Promise<EntryLocal> => {
      // local first
      const local = await upsertLocalEntry({
        ...input,
        _synced: false,
      });

      if (!navigator.onLine || !isSignedIn()) {
        return local;
      }

      // Sync if online and signed in
      try {
        const remote = await upsertRemoteEntry(input);
        return await upsertLocalEntry({ ...remote, _synced: true });
      } catch (err) {
        if (err instanceof ZodError) {
          console.error(err.issues);
          throw err;
        }
        console.error("Sync attempt failed:", err);
        return local;
      }
    },
    onSuccess: (savedEntry) => {
      queryClient.setQueryData(["entry", savedEntry.date], savedEntry);
      if (savedEntry._synced) {
        show("Entry saved and synced", "success");
      } else if (!isSignedIn()) {
        show("Saved on device — please sign in to sync", "success");
      } else {
        show("Saved on device", "success");
      }
    },
    onError: (err) => {
      const message =
        err instanceof ZodError
          ? "Something went wrong with the entry data — please try again"
          : err.message;
      show(message, "error");
    },
  });

  return {
    entry: result.data,
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    isSaving: saveMutation.isPending,
    save: (input: EntryInput) => saveMutation.mutate(input),
  };
};
