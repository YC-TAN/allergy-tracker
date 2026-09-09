import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSyncEntries } from "./useSyncEntries";
import { useNotificationActions } from "./useNotificationStore";
import { checkIsSignedIn } from "../utils/auth";

/**
 * Mount ONCE at the app root. Listens for the browser regaining
 * connectivity and triggers a sync if the user is signed in.
 */
export const useSyncOnReconnect = () => {
  const queryClient = useQueryClient();
  const { show } = useNotificationActions();
  const { sync, isSyncing } = useSyncEntries();

  const isSignedIn = () => checkIsSignedIn(queryClient);

  useEffect(() => {
    const handleOnline = () => {
      if (!isSignedIn()) {
        show("Please sign in to sync", "warning");
        return;
      }
      sync();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isSyncing };
};