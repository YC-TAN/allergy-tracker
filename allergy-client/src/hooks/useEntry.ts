/**
 * useEntry is a shared hook for loading and saving daily entry.
 * 
 * To be updated with api endpoints.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getLocalEntry, saveEntry } from "../utils/storage";
import {createEntry} from "../services/entry";
import { getTodayDate } from "../utils/dates";
import type { EntryInput, EntryLocal } from "../schemas";

export const useEntry = (date: string = getTodayDate()) => {

    const queryClient = useQueryClient()

    const result = useQuery({
        queryKey: ['entry', date],
        queryFn: () => getLocalEntry(date)
    })

    const saveMutation = useMutation({
        mutationFn: async (input: EntryInput): Promise<EntryLocal> => {
            // Promise.resolve(saveEntry(entry))
            if (navigator.onLine) {
                try {
                    await createEntry(input); // createEntry does its own strip+send internally
                    return saveEntry({...input, _synced: true});
                } catch (err) {
                    console.error('Sync attempt failed:', err);
                }
            }
            return saveEntry(input);
        },
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
        save: (input: EntryInput) => saveMutation.mutate(input),
        // update: (entry: Entry) => updateMutation.mutate(entry)        
    }
}