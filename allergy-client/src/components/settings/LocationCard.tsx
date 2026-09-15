import { Autocomplete, TextField, Typography, Button } from "@mui/material";
import BaseCard from "../ui/BaseCard";
import nzLocations from "../../data/locations.json";
import { useState } from "react";
import { useMemo } from "react";
import { useSettings } from "../../hooks/useSettings";

export type LocationOption = {
  label: string;
  region: string;
  island: "North Island" | "South Island";
};

const ISLAND_LABELS: Record<string, LocationOption["island"]> = {
  north_island: "North Island",
  south_island: "South Island",
};

const flattenLocations = (data: typeof nzLocations): LocationOption[] =>
  Object.entries(data).flatMap(([islandKey, regions]) =>
    Object.entries(regions).flatMap(([region, towns]) =>
      towns.map((label) => ({
        label,
        region,
        island: ISLAND_LABELS[islandKey],
      })),
    ),
  );

const LocationCard = () => {
  const { settings, update } = useSettings();
  const options = useMemo(() => flattenLocations(nzLocations), []);
  const [draftLocation, setDraftLocation] = useState<LocationOption | null>(
    null,
  );
  const location =
    draftLocation ??
    options.find((o) => o.label === settings?.location) ??
    null;
  const edited =
    draftLocation !== null && draftLocation.label !== settings?.location;

  const handleSave = () => {
    if (!location || !settings) return;
    update(
      { ...settings, location: location.label },
      `Your location is ${location.label}`,
    );
  };

  return (
    <BaseCard>
      <Typography
        variant="caption"
        color="textSecondary"
        className="block mb-2.5 md:px-[5%]"
      >
        Location:
      </Typography>
      <div className="flex w-full gap-2 pb-2 md:px-[5%]">
        <Autocomplete
          className="flex-1"
          options={options}
          value={location}
          onChange={(_, newValue) => setDraftLocation(newValue)}
          groupBy={(option) => `${option.island} — ${option.region}`}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, val) =>
            option.label === val.label && option.region === val.region
          }
          renderInput={(params) => (
            <TextField
              {...params}
              // label="Your location"
              placeholder="Search town or city"
            />
          )}
        />
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!location || !edited}
        >
          Update
        </Button>
      </div>
    </BaseCard>
  );
};

export default LocationCard;
