import { useQuery } from "@tanstack/react-query"
import { getEntry, getTodayDate } from "../utils/storage";

const today = getTodayDate();

export const useEntry = (date: string = today) => {

    const result = useQuery({
        queryKey: ['entry', date],
        queryFn: () => getEntry(date)
    })
    
    return {
        entry: result.data,
        isPending: result.isPending,
    }
}