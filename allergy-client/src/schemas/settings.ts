import { z } from "zod";
import { locationLabel } from "./labels";

export const SettingsSchema = z.object({
  notify_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .default("20:00"), // HH:MM, 8pm
  notify: z.boolean().default(false),
  location: z.enum(locationLabel).default("Christchurch Central"),
});

export type Settings = z.infer<typeof SettingsSchema>;
export type SettingsInput = z.input<typeof SettingsSchema>;