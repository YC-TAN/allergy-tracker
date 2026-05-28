import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getEntry, getTodayDate, saveEntry } from "../utils/storage";
import type { Entry, EntryInput } from "../schemas";

const today = getTodayDate();

export const useEntry = (date: string = today) => {

    const queryClient = useQueryClient()

    const result = useQuery({
        queryKey: ['entry', date],
        queryFn: () => getEntry(date)
    })

    const newEntry = useMutation({
        mutationFn: (entry: EntryInput) => Promise.resolve(saveEntry(entry)),
        onSuccess: (saved) => {
            queryClient.setQueryData(['entry', saved.date], saved)
        }
    })
    
    return {
        entry: result.data,
        isPending: result.isPending,
        create: (entry: EntryInput) => newEntry.mutate(entry),        
    }
}