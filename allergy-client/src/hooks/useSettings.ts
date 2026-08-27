import { useQuery, 
    useMutation, 
    useQueryClient 
} from "@tanstack/react-query";
import { getSettings, setSettings } from "../utils/storage";
import type { Settings, SettingsInput } from "../schemas";

interface UseSettingsReturn {
    settings: Settings | undefined;
    settingsIsPending: boolean;
    update: (settings: SettingsInput) => void;
}

export const useSettings = (): UseSettingsReturn => {
    const queryClient = useQueryClient();

    const result = useQuery<Settings, Error>({
        queryKey: ['settings'],
        queryFn: () => getSettings()
    })

    const updateMutation = useMutation<Settings, Error, SettingsInput>({
        mutationFn: (settings: SettingsInput) => Promise.resolve(setSettings(settings)),
        onSuccess: (updated) => {
            queryClient.setQueryData(['settings'], updated)
        }
    })
    
    return {
        settings: result.data,
        settingsIsPending: result.isPending,
        update: (settings: SettingsInput) => updateMutation.mutate(settings),
    }
}