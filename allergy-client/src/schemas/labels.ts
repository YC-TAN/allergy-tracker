import { SeverityRating, type SeverityRatingType } from "./index";

export const SeverityLabel: Record<SeverityRatingType, string> = {
  [SeverityRating.Mild]: "Mild",
  [SeverityRating.Moderate]: "Moderate",
  [SeverityRating.Severe]: "Severe",
};