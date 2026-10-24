import { useEffect } from "react";
import { syncEntries } from "../services/sync";
import { useSyncActions } from "../stores/useSyncStore";

export const useSync = (userId?: string) => {
  const { reset } = useSyncActions();
  useEffect(() => {
    if (!userId) {
      reset();
      return;
    }
    const run = () => void syncEntries();
    const onVisible = () => document.visibilityState === "visible" && run();

    run(); // on sign-in / app start
    window.addEventListener("online", run);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("online", run);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [userId, reset]);
};
