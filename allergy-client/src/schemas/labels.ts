/**
 * Map of `SeverityRating` values to human-readable labels.
 *
 * Used to display a user-friendly severity string.
 */

import { SeverityRating, type SeverityRatingType } from "./index";

export const SeverityLabel: Record<SeverityRatingType, string> = {
  [SeverityRating.NoSymptom]: "No Symptom",
  [SeverityRating.Mild]: "Mild",
  [SeverityRating.Moderate]: "Moderate",
  [SeverityRating.Severe]: "Severe",
};