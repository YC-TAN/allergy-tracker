import { useQuery, 
    useMutation, 
    useQueryClient 
} from "@tanstack/react-query";
import { getSettings, setSettings } from "../utils/storage";
import type { Settings } from "../schemas";

export const useSettings = () => {
    const queryClient = useQueryClient();

    const result = useQuery({
        queryKey: ['settings'],
        queryFn: () => getSettings()
    })

    const updateMutation = useMutation({
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