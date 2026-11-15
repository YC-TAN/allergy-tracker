import { create } from "zustand";

type SyncStatus = "idle" | "syncing" | "error" | "offline";

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  hydrated: boolean;
  failedEntries: Record<string, string>;
  actions: {
    setSyncing: () => void;
    setSuccess: () => void;
    setError: () => void;
    setOffline: () => void;
    skip: () => void;
    reset: () => void;
    addFailure: (date: string, reason: string) => void;
    clearFailure: (date: string) => void;
  };
}

const useSyncStore = create<SyncState>((set) => ({
  status: "idle",
  lastSyncedAt: null,
  hydrated: false,
  failedEntries: {},
  actions: {
    setSyncing: () => set({ status: "syncing" }),
    setSuccess: () =>
      set({ status: "idle", lastSyncedAt: Date.now(), hydrated: true }),
    setError: () => set({ status: "error", hydrated: true }),
    setOffline: () => set({ status: "offline" }),
    skip: () => set({ hydrated: true }),
    reset: () =>
      set({ status: "idle", lastSyncedAt: null, hydrated: false, failedEntries: {} }),
    addFailure: (date, reason) =>
      set((s) => ({ failedEntries: { ...s.failedEntries, [date]: reason } })),
    clearFailure: (date) =>
      set((s) => {
        const { [date]: _removed, ...rest } = s.failedEntries;
        return { failedEntries: rest };
      }),
  },
}));

export default useSyncStore;
export const useSyncActions = () => useSyncStore((state) => state.actions)