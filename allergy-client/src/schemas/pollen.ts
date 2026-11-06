// ---- Pollen schema and type
import { z } from "zod";

export const PollenRiskLevelSchema = z.enum([
  "imminent",
  "high",
  "moderate",
  "low",
]);
export type PollenRiskLevel = z.infer<typeof PollenRiskLevelSchema>;

export const PollenForecastSchema = z.object({
  date: z.string(), // ISO date 'YYYY-MM-DD'
  location: z.string(),
  imminent: z.array(z.string()),
  low: z.array(z.string()),
  moderate: z.array(z.string()),
  high: z.array(z.string()),
});

export type PollenForecast = z.infer<typeof PollenForecastSchema>;