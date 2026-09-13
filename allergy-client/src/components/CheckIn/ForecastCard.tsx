import { Typography } from "@mui/material";
import { usePollenForecast } from "../../hooks/usePollenForecast";
import { useSettings } from "../../hooks/useSettings";
import type { PollenRiskLevel, PollenForecast } from "../../schemas";
import { ApiError } from "../../lib/error";
import BaseCard from "../ui/BaseCard";
import ProgressBox from "../ui/ProgressBox";
import ErrorTypography from "../ui/ErrorTypography";

const LEVEL_ORDER: PollenRiskLevel[] = ["imminent", "high", "moderate", "low"];

export interface PollenGroup {
  level: PollenRiskLevel;
  allergens: string[];
}

const ForecastCard = () => {
  const { settings, settingsIsPending } = useSettings();
  const location = settings?.location ?? "Christchurch Central";

  const { pollenForecast, forecastIsPending, forecastError } =
    usePollenForecast(
      location,
      { enabled: !!location }, // convert location to boolean, undefined -> false, other str -> true
    );

  const renderContent = () => {
    if (settingsIsPending || forecastIsPending) return <ProgressBox />;

    if (forecastError) {
      if (!navigator.onLine) {
        return <ErrorTypography message="Can't get forecast while offline." />
      }
      if (
        forecastError instanceof ApiError &&
        forecastError.statusCode === 404
      ) {
        return <ErrorTypography message="Pollen forecast not available for this location." />
      }
      return <ErrorTypography message="Something went wrong loading the forecast." />
    }

    if (!pollenForecast) return null;

    const groupForecast = (forecast: PollenForecast): PollenGroup[] => {
      return LEVEL_ORDER.map((level) => ({
        level,
        allergens: forecast[level],
      })).filter((group) => group.allergens.length > 0);
    };

    const groups = groupForecast(pollenForecast);

    return (
      <>
        <Typography
          variant="caption"
          gutterBottom
        >
          {location}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="div" className="mt-2">
          {groups.map((group) => (
            <div key={group.level} className="mb-2">
              <span className="font-semibold capitalize">{group.level}:</span>{" "}<br />
              {group.allergens.join(", ")}
            </div>
          ))}
        </Typography>
      </>
    );
  };
  return (
    <BaseCard 
      sx={{
        backgroundColor: "#f0f7f0"}}
    >
    {renderContent()}
    </BaseCard>
  );
};

export default ForecastCard;
