import { useQuery, 
    useMutation, 
    useQueryClient 
} from "@tanstack/react-query";
import { getSettings, setSettings } from "../utils/storage";
import type { Settings } from "../schemas";

interface UseSettingsReturn {
    settings: Settings | undefined;
    isPending: boolean;
    update: (settings: Settings) => void;
}

export const useSettings = (): UseSettingsReturn => {
    const queryClient = useQueryClient();

    const result = useQuery<Settings, Error>({
        queryKey: ['settings'],
        queryFn: () => getSettings()
    })

    const updateMutation = useMutation<Settings, Error, Settings>({
        mutationFn: (settings: Settings) => Promise.resolve(setSettings(settings)),
        onSuccess: (updated) => {
            queryClient.setQueryData(['settings'], updated)
        }
    })
    
    return {
        settings: result.data,
        isPending: result.isPending,
        update: (settings: Settings) => updateMutation.mutate(settings),
    }
}