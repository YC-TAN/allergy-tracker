import apiFetch from '../lib/api';
import { PollenForecastSchema, type PollenForecast } from '../schemas';

const baseUrl = "/pollen_forecast";

/**
 * Fetches and validates the pollen forecast for a location.
 *
 * @param location Location name used to request the forecast.
 * @returns A validated pollen forecast.
 */
export const getPollenForecast = async (location: string): Promise<PollenForecast> => {
    const res = await apiFetch<unknown>(`${baseUrl}/${location}`);
    return PollenForecastSchema.parse(res)
}