import { useState } from "react";
import {
  FormControlLabel,
  FormControl,
  FormGroup,
  Switch,
  // Checkbox
} from "@mui/material";
import BaseCard from "../ui/BaseCard";

const TreatmentsCard = () => {
  const [honey, setHoney] = useState(false);
  return (
    <BaseCard>
      <FormControl className="w-full md:px-[5%]">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={honey}
                onChange={(e) => setHoney(e.target.checked)}
                name="honey"
              />
            }
            label="Took Honey"
            labelPlacement="start"
            className="ml-0 justify-between"
            slotProps={{
              typography: { variant: "caption", color: "textSecondary" },
            }}
          />
        </FormGroup>
      </FormControl>
      {/* <FormControlLabel
          control={
            <Checkbox
              checked={honey}
              onChange={(e) => setHoney(e.target.checked)}
            />
          }
          label="Took honey"
        /> */}
    </BaseCard>
  );
};

export default TreatmentsCard;
