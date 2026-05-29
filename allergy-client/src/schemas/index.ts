/**
 * This file defines the data schemas and types for the allergy tracking application.
 * It includes definitions for symptom severity ratings, symptom types, and the structure
 * of allergy entries. These schemas are used for data validation and type safety
 * throughout the application, leveraging Zod for runtime validation. 
 * Zod is preferred because TypeScript doesn't exist at runtime.
 */

import { z } from 'zod';
import { getTodayDate } from '../utils/storage';

export const SeverityRating = {
  NoSymptom: 0,
  Mild: 1,
  Moderate: 2,
  Severe: 3,
} as const;

export const SeverityInputSchema = z.union([
  z.literal(SeverityRating.Mild),
  z.literal(SeverityRating.Moderate),
  z.literal(SeverityRating.Severe),
]);

export type SeverityRatingType = z.infer<typeof SeverityInputSchema>;

export const SeveritySchema = z.union([
  ...SeverityInputSchema.options,
  z.literal(SeverityRating.NoSymptom)
])

export const SymptomSchema = z.enum(['eyes', 'nose', 'throat', 'energy', 'headache', 'other']);
export type Symptom = z.infer<typeof SymptomSchema>;


export const EntrySchema = z.object({
  id:         z.uuid().optional(),
  user_id:    z.uuid().optional(),
  // use arrow function getTodayDate so that it is called fresh each time
  date:       z.iso.date().default(() => getTodayDate()), //TODO add constraint: unique - once a day, cannot record for older than 3 days (in case of incorrect memory), cannot record future date
  severity:   SeveritySchema,
  symptoms:   z.array(SymptomSchema).default([]),
  notes:      z.string().default(''),
  created_at: z.iso.datetime().optional(),
})

export type Entry = z.infer<typeof EntrySchema>;
export type EntryInput = z.input<typeof EntrySchema>;