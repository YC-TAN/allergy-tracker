import { create } from "zustand";

type SyncStatus = "idle" | "syncing" | "error";

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  hydrated: boolean;
  actions: {
    setSyncing: () => void;
    setSuccess: () => void;
    setError: () => void;
    skip: () => void;
    reset: () => void;
  };
}

const useSyncStore = create<SyncState>((set) => ({
  status: "idle",
  lastSyncedAt: null,
  hydrated: false,
  actions: {
    setSyncing: () => set({ status: "syncing" }),
    setSuccess: () =>
      set({ status: "idle", lastSyncedAt: Date.now(), hydrated: true }),
    setError: () => set({ status: "error", hydrated: true }),
    skip: () => set({ hydrated: true }),
    reset: () =>
      set({ status: "idle", lastSyncedAt: null, hydrated: false }),
  },
}));

export default useSyncStore;
export const useSyncActions = () => useSyncStore((state) => state.actions)