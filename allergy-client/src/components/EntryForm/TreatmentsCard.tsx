import {
  FormControlLabel,
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
              typography: { variant: "caption", color: "textSecondary" },
            }}
        />
    </BaseCard>
  );
};

export default TreatmentsCard;
