/**
 * Loads the daily allergy entry for a date and exposes a save mutation.
 *
 * If the app is online, it attempts to sync the entry first and falls back to
 * local storage on sync failure.
 *
 * Successful saves new entry/ updates entry will show a success notification;
 * failures show an error notification.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLocalEntry, saveEntry } from "../utils/storage";
import { upsertEntry, getEntry } from "../services/entry";
import { getTodayDate } from "../utils/dates";
import type { EntryInput, EntryLocal } from "../schemas";
import { useNotificationActions } from "./useNotificationStore";
import { ApiError } from "../lib/error";
import { AUTH_USER_KEY } from "./useAuth";

export const useEntry = (date: string = getTodayDate()) => {
  const queryClient = useQueryClient();
  const { show } = useNotificationActions();

  const isSignedIn = () => queryClient.getQueryData(AUTH_USER_KEY) != null;

  const result = useQuery({
    queryKey: ["entry", date],
    // queryFn: () => getLocalEntry(date),
    queryFn: async () => {
      const local = getLocalEntry(date);
      if (local) return local;

      // Nothing local — try the server
      const remote = await getEntry(date); // throws ApiError on real failures, returns null on 404
      if (remote) return saveEntry({ ...remote, _synced: true }); // hydrate localStorage
      return null;
    },
    retry: (failureCount, err) => {
      // 404/400 won't fix itself, no need retry
      if (err instanceof ApiError && err.statusCode < 500) return false;
      return failureCount < 2; // allow up to 2 retries for 5xx failures
    },
    staleTime: 5 * 60 * 1000, // 5 minuteslocal-first, so don't hammer the network re-checking
  });

  const saveMutation = useMutation({
    mutationFn: async (input: EntryInput): Promise<EntryLocal> => {
      if (navigator.onLine && isSignedIn()) {
        try {
          await upsertEntry(input);
          return saveEntry({ ...input, _synced: true });
        } catch (err) {
          console.error("Sync attempt failed:", err);
          return saveEntry(input);
        }
      }
      return saveEntry( {...input, _synced: false});
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(["entry", saved.date], saved);
      if (saved._synced) {
        show("Entry saved and synced", "success");
      } else if (!isSignedIn()) {
        show("Saved on device — please sign in to sync", "success");
      } else {
        show("Saved on device", "success");
      }
    },
    onError: (err) => {
      show(err.message, "error");
    },
  });

  return {
    entry: result.data,
    isPending: result.isPending,
    save: (input: EntryInput) => saveMutation.mutate(input),
  };
};
