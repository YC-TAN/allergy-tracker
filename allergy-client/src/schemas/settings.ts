import { z } from "zod";
import nzLocations from "../data/locations.json";

const allLabels = Object.values(nzLocations).flatMap((regions) =>
  Object.values(regions).flat(),
) as [string, ...string[]];

export const SettingsSchema = z.object({
  notify_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .default("20:00"), // HH:MM, 8pm
  notify: z.boolean().default(false),
  location: z.enum(allLabels).default("Christchurch Central"),
});

export type Settings = z.infer<typeof SettingsSchema>;
export type SettingsInput = z.input<typeof SettingsSchema>;