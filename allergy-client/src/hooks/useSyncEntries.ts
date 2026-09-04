import { useQueryClient, useMutation } from "@tanstack/react-query";
import { migrateEntries } from "../services/entry";
import { useNotificationActions } from "./useNotificationStore";
import { getUnsyncedEntries, saveEntry } from "../utils/storage";
import { AUTH_USER_KEY } from "./useAuth";
import { ZodError } from "zod";

type SyncOutcome =
  | { status: "nothing-pending" }
  | { status: "needs-sign-in" }
  | { status: "all-synced" }
  | { status: "partial"; failedDates: string[] }
  | { status: "all-failed"; failedDates: string[] };

export const useSyncEntries = () => {
  const queryClient = useQueryClient();
  const { show } = useNotificationActions();

  const isSignedIn = () => queryClient.getQueryData(AUTH_USER_KEY) != null;

  const syncMutation = useMutation({
    mutationFn: async (): Promise<SyncOutcome> => {
      const unsynced = getUnsyncedEntries();

      if (unsynced.length === 0) return { status: "nothing-pending" };
      if (!isSignedIn()) return { status: "needs-sign-in" };

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

      if (result.failed.length === 0) return { status: "all-synced" };
      if (result.synced.length === 0)
        return { status: "all-failed", failedDates: result.failed };
      return { status: "partial", failedDates: result.failed };
    },
    onSuccess: (outcome) => {
      switch (outcome.status) {
        case "nothing-pending":
          return; // silent
        case "needs-sign-in":
          show("You have unsynced entries — sign in to sync them", "info");
          return;
        case "all-synced":
          queryClient.invalidateQueries({ queryKey: ["entry"] });
          // queryClient.invalidateQueries({ queryKey: ["entries"] });
          show("All entries synced", "success");
          return;
        case "partial":
          queryClient.invalidateQueries({ queryKey: ["entry"] });
          // queryClient.invalidateQueries({ queryKey: ["entries"] });
          show(
            `${outcome.failedDates.length} entries couldn't be synced — will retry later`,
            "error",
          );
          return;
        case "all-failed":
          show("Entries couldn't be synced — will retry later", "error");
          return;
      }
    },
    onError: (err) => {
      if (err instanceof ZodError) {
        console.error(
          err.issues
        );
        show(
          "Something went wrong with the entry data — please try again",
          "error",
        );
      } else {
        console.error("Sync attempt failed:", err);
        show(
          "Some entries could not be synced - will try again later",
          "error",
        );
      }
    },
  });

  return {
    isSyncing: syncMutation.isPending,
    sync: () => syncMutation.mutate(),
  };
};
