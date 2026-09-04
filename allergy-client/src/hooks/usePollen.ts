import { useQuery } from '@tanstack/react-query';
import { getPollenForecast } from '../services/pollenForecast';
import { ApiError } from '../lib/error';
import { getTodayDate } from '../utils/dates';

export function usePollenForecast(location: string) {
    const today = getTodayDate();

    const result = useQuery({
    queryKey: ['pollen', location, today],
    queryFn: () => getPollenForecast(location),
    staleTime: Infinity, // never goes stale WITHIN the same date
    retry: (failureCount, error) => {
      // don't retry 404s (no forecast for this location) — retrying won't fix that
      if (error instanceof ApiError && error.statusCode === 404) return false
      return failureCount < 2
    },
  })

  return {
    pollenForecast: result.data,
    isPending: result.isPending,
  }
}