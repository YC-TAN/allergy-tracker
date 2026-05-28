import { useQueryClient, useQuery } from "@tanstack/react-query"
import { getEntry, getTodayDate } from "../utils/storage";

const today = getTodayDate();

export const useEntry = () => {
    const queryClient = useQueryClient();

    const result = useQuery({
        queryKey: ['entry', today],
        queryFn: () => getEntry(today)
    })
    
    return {
        entry: result.data,
        isPending: result.isPending,
    }
}