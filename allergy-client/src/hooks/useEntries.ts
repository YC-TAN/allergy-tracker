import { useQuery } from "@tanstack/react-query";
import { getRelativeDays } from "../utils/dates";
import { getRemoteEntries } from "../services/entry";
// import { loadAll } from "../utils/storage";

export function useEntries(days: number = 7) {

    const result = useQuery({
    queryKey: ["entries", {days}],
    queryFn: () => getRemoteEntries(days),
  });
  return {
    entries: result.data,
    isPending: result.isPending,
    isError: result.isError,
  }
}