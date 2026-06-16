/**
 * useEntry is a shared hook for loading and saving daily entry.
 * 
 * To be updated with api endpoints.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getEntry, saveEntry } from "../utils/storage";
import { getTodayDate } from "../utils/dates";
import type { EntryInput } from "../schemas";

const today = getTodayDate();

export const useEntry = (date: string = today) => {

    const queryClient = useQueryClient()

    const result = useQuery({
        queryKey: ['entry', date],
        queryFn: () => getEntry(date)
    })

    const saveMutation = useMutation({
        mutationFn: (entry: EntryInput) => Promise.resolve(saveEntry(entry)),
        onSuccess: (saved) => {
            queryClient.setQueryData(['entry', saved.date], saved)
        }
    })

    // const updateMutation = useMutation({
    //     mutationFn: (entry: Entry) => Promise.resolve(updateEntry(entry)),
    //     onSuccess: (saved) => {
    //         queryClient.setQueryData(['entry', saved.date], saved)
    //     }
    // })
    
    return {
        entry: result.data,
        isPending: result.isPending,
        save: (entry: EntryInput) => saveMutation.mutate(entry),
        // update: (entry: Entry) => updateMutation.mutate(entry)        
    }
}