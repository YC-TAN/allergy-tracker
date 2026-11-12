/**
 * Map of `SeverityRating` values to human-readable labels.
 *
 * Used to display a user-friendly severity string.
 */

import { SeverityRating, type SeverityRatingType } from "./entry";
import nzLocations from "../data/locations.json";

export const SeverityLabel: Record<SeverityRatingType, string> = {
  [SeverityRating.NoSymptoms]: "No Symptoms",
  [SeverityRating.Mild]: "Mild",
  [SeverityRating.Moderate]: "Moderate",
  [SeverityRating.Severe]: "Severe",
};

export const locationLabel = Object.values(nzLocations).flatMap((regions) =>
  Object.values(regions).flat(),
) as [string, ...string[]];