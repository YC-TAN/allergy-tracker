import { Card, CardContent, Typography } from "@mui/material";
import { usePollenForecast } from "../../hooks/usePollenForecast";
import { useSettings } from "../../hooks/useSettings";
import type { PollenRiskLevel, PollenForecast } from "../../schemas";
import { ApiError } from "../../lib/error";

const LEVEL_ORDER: PollenRiskLevel[] = ["imminent", "high", "moderate", "low"];

export interface PollenGroup {
  level: PollenRiskLevel;
  allergens: string[];
}

const ForecastCard = () => {
  const { settings, settingsIsPending } = useSettings();
  const location = settings?.location ?? "Christchurch Central";
  // const location = "Christchurch Central"

  const { pollenForecast, forecastIsPending, forecastError } =
    usePollenForecast(
      location,
      { enabled: !!location }, // convert location to boolean, undefined -> false, other str -> true
    );

  if (settingsIsPending || forecastIsPending) return null;
  // if (forecastIsPending) return null;

  const renderContent = () => {
    if (forecastError) {
      if (!navigator.onLine) {
        return <Typography>Can't get forecast while offline</Typography>;
      }
      if (
        forecastError instanceof ApiError &&
        forecastError.statusCode === 404
      ) {
        return (
          <Typography>
            Pollen forecast not available for this location
          </Typography>
        );
      }
      return <Typography>Something went wrong loading the forecast</Typography>;
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
          variant="subtitle2"
          color="primary.dark"
          sx={{
            fontWeight: 600,
          }}
          gutterBottom
        >
          {location}
        </Typography>
        <Typography variant="body2" component="div" className="mt-2">
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
    <Card
      className="w-full mb-6"
      sx={{
        backgroundColor: "#f0f7f0",
        // border: "1px solid #a5d6a7",
      }}
    >
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};

export default ForecastCard;
