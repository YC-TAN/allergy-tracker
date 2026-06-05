/**
 * Map of `SeverityRating` values to human-readable labels.
 *
 * Used to display a user-friendly severity string for entry form.
 */

import { SeverityRating, type SeverityRatingType } from "./index";

export const SeverityLabel: Record<SeverityRatingType, string> = {
  [SeverityRating.Mild]: "Mild",
  [SeverityRating.Moderate]: "Moderate",
  [SeverityRating.Severe]: "Severe",
};