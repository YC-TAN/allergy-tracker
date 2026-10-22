import { useEffect} from 'react';
import { syncEntries } from '../services/sync';

export const useSync = (userId?: string) => {
  useEffect(() => {
    if (!userId) return;
    const run = () => void syncEntries();
    const onVisible = () => document.visibilityState === "visible" && run();

    run(); // on sign-in / app start
    window.addEventListener("online", run);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("online", run);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [userId]);
}