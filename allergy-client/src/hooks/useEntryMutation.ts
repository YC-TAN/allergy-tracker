/**
 * Loads the daily allergy entry for a date and exposes a save mutation.
 *
 * When signed in and online, the server is the source of truth.
 * IndexedDB as source if offline or when a network request cannot be completed.
 *
 * Successful saves new entry/ updates entry will show a success notification;
 * failures show an error notification.
 */

import { useMutation } from "@tanstack/react-query";
import { upsertLocalEntry } from "../db/entries";
import { getTodayDate } from "../utils/dates";
import type { EntryInput } from "../schemas";
import { useNotificationActions } from "../stores/useNotificationStore";
import { useIsSignedIn } from "../stores/useAuthStore";
import { syncEntries } from "../services/sync";

export const useEntryMutation = (date: string = getTodayDate()) => {
  const { show } = useNotificationActions();
  const isSignedIn = useIsSignedIn();

  const saveMutation = useMutation({
    networkMode: "always",
    mutationFn: async (input: EntryInput) => {
      await upsertLocalEntry({
        ...input,
        date: date,
        _synced: false,
      });
    },
    onSuccess: () => {
      
      if (isSignedIn) {
        void syncEntries({pull: false})
        show("Entry saved", "success");
      } else {
        show("Saved on device - please sign in to sync", "success");
      }
    },
    onError: (err) => {
      show(err.message, "error");
    },
  });

  return {
    isSaving: saveMutation.isPending,
    save: (input: EntryInput) => saveMutation.mutate(input),
  };
};
