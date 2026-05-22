/**
 * This file defines the data schemas and types for the allergy tracking application.
 * It includes definitions for symptom severity ratings, symptom types, and the structure
 * of allergy entries. These schemas are used for data validation and type safety
 * throughout the application, leveraging Zod for runtime validation. 
 * Zod is preferred because TypeScript doesn't exist at runtime.
 */

import { z } from 'zod'

export const SeverityRating = {
  NoSymptom: 0,
  Mild: 1,
  Moderate: 2,
  Severe: 3,
} as const;

export const SeveritySchema = z.union([
  z.literal(SeverityRating.Mild),
  z.literal(SeverityRating.Moderate),
  z.literal(SeverityRating.Severe),
]);

export type SeverityRatingType = z.infer<typeof SeveritySchema>;

export const SymptomSchema = z.enum(['eyes', 'nose', 'throat', 'energy', 'headache']);
export type Symptom = z.infer<typeof SymptomSchema>;
export const symptomOptions = SymptomSchema.options;

export const EntrySchema = z.object({
  id:         z.uuid().optional(),
  user_id:    z.uuid().optional(),
  date:       z.iso.datetime(), //TODO add constraint: unique - once a day, cannot record for older than 3 days (in case of incorrect memory), cannot record future date
  severity:   SeveritySchema,
  symptoms:   z.array(SymptomSchema).default([]),
  notes:      z.string().default(''),
  created_at: z.iso.datetime().optional(),
})

export type Entry = z.infer<typeof EntrySchema>