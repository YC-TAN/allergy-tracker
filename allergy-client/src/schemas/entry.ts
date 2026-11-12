/**
 * This file defines the data schemas and types for the allergy tracking entries.
 * It includes definitions for symptom severity ratings, symptom types, and the structure
 * of allergy entries.
 *
 * Zod is used because TypeScript doesn't exist at runtime.
 *
 * NOTE: extend() cannot be run after refine() or overwrite() or transform()
 * transform() is for changing data type
 */

import { z } from "zod";
// import { getTodayDate } from "../utils/dates";
import { locationLabel } from "./labels";

export const ENTRY_LOCAL_SCHEMA_VERSION = 2;

export const SeverityRating = {
  NoSymptoms: 0,
  Mild: 1,
  Moderate: 2,
  Severe: 3,
} as const;

export const SeveritySchema = z.union([
  z.literal(SeverityRating.NoSymptoms),
  z.literal(SeverityRating.Mild),
  z.literal(SeverityRating.Moderate),
  z.literal(SeverityRating.Severe),
]);

export type SeverityRatingType = z.infer<typeof SeveritySchema>;

// -- Symptoms --
export const SYMPTOMS = [
  "eyes",
  "nose",
  "throat",
  "energy",
  "headache",
  "other",
] as const;
export const SymptomSchema = z.enum(SYMPTOMS);
export type Symptom = z.infer<typeof SymptomSchema>;

// -- Entries
const BaseEntrySchema = z.object({
  date: z.iso.date(),
  // .default(() => getTodayDate())
  // .refine((val) => val <= getTodayDate(), {
  //   message: "Entry date cannot be in the future",
  // }),
  severity: SeveritySchema,
  symptoms: z.array(SymptomSchema).default([]),
  notes: z.string().default(""),
  honey: z.boolean().default(false),
  location: z.enum(locationLabel).default("Christchurch Central"),
});

const sanitizeEntry = <T extends { severity: SeverityRatingType; symptoms: Symptom[] }>(
  data: T,
): T => ({
  ...data,
  symptoms: data.severity === 0 ? [] : Array.from(new Set(data.symptoms)),
});

const validateEntry = (data: { severity: SeverityRatingType; symptoms: Symptom[] }) =>
  data.severity === 0 || data.symptoms.length > 0;

const severityRefinement = {
  message:
    "At least one symptom must be selected when severity is greater than none",
  path: ["symptoms"],
};

export const EntrySchema = BaseEntrySchema.overwrite(sanitizeEntry).refine(
  validateEntry,
  severityRefinement,
);

export const EntryLocalSchema = BaseEntrySchema.extend({
  _synced: z.union([z.literal(0), z.literal(1)]).default(0),
  _revision: z.number().int().nonnegative().default(0),
  _v: z.literal(ENTRY_LOCAL_SCHEMA_VERSION).default(ENTRY_LOCAL_SCHEMA_VERSION),
})
  .overwrite(sanitizeEntry)
  .refine(validateEntry, severityRefinement);

export const EntryResponseSchema = BaseEntrySchema.extend({
  id: z.uuid(),
  // user_id: z.uuid(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export type Entry = z.infer<typeof EntrySchema>;
// NOTE: z.input<> - to allow fields with default value to be optional in forms, can be omitted before parsing
export type EntryInput = z.input<typeof EntryLocalSchema>;
// TODO: add constraint to input if allow update previous record - cannot record for older than 3 days (in case of incorrect memory)
export type EntryLocal = z.infer<typeof EntryLocalSchema>;
export type EntryResponse = z.infer<typeof EntryResponseSchema>;

export const toWire = (e: EntryLocal): Entry => EntrySchema.parse(e);

export const fromServer = (r: EntryResponse): EntryLocal => ({
  ...EntrySchema.parse(r),
  _synced: 1,
  _revision: 0,
  _v: ENTRY_LOCAL_SCHEMA_VERSION,
});

export const MigrateResponseSchema = z.object({
  synced: z.array(z.string()),
  failed: z.array(z.string()), // dates as ISO strings, e.g. "2026-08-14"
});

export type MigrateResponse = z.infer<typeof MigrateResponseSchema>;
