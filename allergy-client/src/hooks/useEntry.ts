/**
 * useEntry is a shared hook for loading and saving daily entry.
 *
 * To be updated with api endpoints.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLocalEntry, saveEntry } from "../utils/storage";
import { upsertEntry } from "../services/entry";
import { getTodayDate } from "../utils/dates";
import type { EntryInput, EntryLocal } from "../schemas";
import { useNotificationActions } from "./useNotificationStore";

export const useEntry = (date: string = getTodayDate()) => {
  const queryClient = useQueryClient();
  const { show } = useNotificationActions();

  const result = useQuery({
    queryKey: ["entry", date],
    queryFn: () => getLocalEntry(date),
  });

  const saveMutation = useMutation({
    mutationFn: async (input: EntryInput): Promise<EntryLocal> => {
      if (navigator.onLine) {
        try {
          await upsertEntry(input);
          return saveEntry({ ...input, _synced: true });
        } catch (err) {
          console.error("Sync attempt failed:", err);
          return saveEntry(input);
        }
      }
      return saveEntry(input);
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(["entry", saved.date], saved);

      show(
        saved._synced ? "Entry saved and synced" : "Saved offline",
        "success"
      );
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
