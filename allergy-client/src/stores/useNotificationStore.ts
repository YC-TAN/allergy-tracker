import { create } from "zustand";

type Severity = "success" | "error" | "info" | "warning";

interface Notification {
  message: string;
  severity: Severity;
}

interface NotificationState {
  notification: Notification | null;
  timeoutId: ReturnType<typeof setTimeout> | null;
  actions: {
    show: (message: string, severity?: Severity) => void;
    close: () => void;
  };
}

const useNotificationStore = create<NotificationState>((set, get) => ({
  notification: null,
  timeoutId: null,
  actions: {
    show: (message, severity = "info") => {
      clearTimeout(get().timeoutId ?? undefined);
      const timeoutId = setTimeout(
        () => set({ notification: null, timeoutId: null }),
        5000,
      );
      set({ notification: { message, severity }, timeoutId });
    },
    close: () => {
      clearTimeout(get().timeoutId ?? undefined);
      set({ notification: null, timeoutId: null });
    },
  },
}));

export default useNotificationStore;

export const useNotification = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)