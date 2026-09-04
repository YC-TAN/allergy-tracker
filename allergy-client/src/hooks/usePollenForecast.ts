import { useQuery } from '@tanstack/react-query';
import { getPollenForecast } from '../services/pollenForecast';
import { ApiError } from '../lib/error';
import { getTodayDate } from '../utils/dates';

export function usePollenForecast(location: string | undefined, options?: {enabled?: boolean}) {
    const today = getTodayDate();

    const result = useQuery({
    queryKey: ['pollen', location, today],
    queryFn: () => getPollenForecast(location!), // non-null assertion, 'enabled' prevent this from running when location is undefined
    enabled: options?.enabled ?? true, // fall back to true if no options passed
    staleTime: Infinity, // never goes stale WITHIN the same date
    retry: (failureCount, error) => {
      // don't retry 404s (no forecast for this location) — retrying won't fix that
      if (error instanceof ApiError && error.statusCode === 404) return false
      return failureCount < 2
    },
  })

  return {
    pollenForecast: result.data,
    forecastIsPending: result.isPending,
    forecastError: result.error,
  }
}