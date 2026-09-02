import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, setSettings } from "../utils/storage";
import type { Settings, SettingsInput } from "../schemas";
import { useNotificationActions } from "./useNotificationStore";

interface UseSettingsReturn {
  settings: Settings | undefined;
  settingsIsPending: boolean;
  update: (settings: SettingsInput, message?: string) => void;
}

export const useSettings = (): UseSettingsReturn => {
  const queryClient = useQueryClient();
  const { show } = useNotificationActions();

  const result = useQuery<Settings, Error>({
    queryKey: ["settings"],
    queryFn: () => getSettings(),
  });

  const updateMutation = useMutation<Settings, Error, SettingsInput>({
    mutationFn: (settings: SettingsInput) =>
      Promise.resolve(setSettings(settings)),
    onSuccess: (updated) => {
      queryClient.setQueryData(["settings"], updated);
    },
    onError: (error) => {
        console.error('Failed to save settings', error);
    }
  });

  return {
    settings: result.data,
    settingsIsPending: result.isPending,
    update: (settings, message="Settings updated") => updateMutation.mutate(settings, {
            onSuccess: () => show(message, "success"),
            onError: (error) => show(`Couldn't update settings: ${error.message}`, "error"),
        }),
  };
};
