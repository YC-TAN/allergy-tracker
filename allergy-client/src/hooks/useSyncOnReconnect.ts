import { useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { migrateEntries } from "../services/entry";
import { useNotificationActions } from "./useNotificationStore";
import { getUnsyncedEntries, saveEntry } from "../utils/storage";
import { AUTH_USER_KEY } from "./useAuth";

export const useSyncOnReconnect = () => {
  const queryClient = useQueryClient();
  const { show } = useNotificationActions();

  const isSignedIn = () => queryClient.getQueryData(AUTH_USER_KEY) != null;

  const syncMutation = useMutation({
    mutationFn: async (): Promise<boolean> => {
      const unsynced = getUnsyncedEntries();

      if (unsynced.length === 0) return false;
      const result = await migrateEntries(unsynced);

      for (const entry of result.synced) {
        try {
          saveEntry({ ...entry, _synced: true });
        } catch (err) {
          console.error(
            `Failed to save synced entry ${entry.date} locally:`,
            err,
          );
        }
      }
      return result.synced.length > 0;
    },
    onSuccess: (synced) => {
      if (!synced) return; // nothing was pending — nothing to tell the user

      queryClient.invalidateQueries({ queryKey: ["entry"] });
      //   queryClient.invalidateQueries({ queryKey: ["entries"] });

      show("All entries synced", "success");
    },
    onError: (err) => {
      console.error("Sync attempt failed:", err);
      show("Entries could not be synced", "error");
    },
  });

  useEffect(() => {
    const handleOnline = () => {
      if (!isSignedIn()) {
        show("Please sign in to sync", "error");
        return;
      }
      syncMutation.mutate();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isSyncing: syncMutation.isPending,
  };
};
