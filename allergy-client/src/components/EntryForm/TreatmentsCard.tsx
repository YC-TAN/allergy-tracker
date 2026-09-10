import {
  FormControlLabel,
  FormControl,
  FormGroup,
  Switch,
  Checkbox
} from "@mui/material";
import BaseCard from "../ui/BaseCard";

interface TreatmentCardProps {
  honey: boolean;
  setHoney: React.Dispatch<React.SetStateAction<boolean>>;
}

const TreatmentsCard = ({honey, setHoney} : TreatmentCardProps) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHoney(event.target.checked);
  };
  return (
    <BaseCard>
      {/* <FormControl className="w-full md:px-[5%]">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={honey}
                onChange={handleChange}
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
      </FormControl> */}
      <FormControlLabel
          control={
            <Checkbox
              checked={honey}
              onChange={handleChange}
            />
          }
          className="w-full md:px-[5%]"
          label="Took Honey"
          slotProps={{
              typography: { variant: "body1", color: "textSecondary" },
            }}
        />
    </BaseCard>
  );
};

export default TreatmentsCard;
