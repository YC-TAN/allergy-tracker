/**
 * SeverityCard shows three severity selections used in the symptom entry form.
 * 
 * It lets users choose the allergy severity level for today's log and updates parent form state.
 */
import { Box, ButtonBase, Card, CardContent, Typography } from "@mui/material";

import { SeverityRating, type SeverityRatingType } from "../../schemas";
import { SeverityLabel } from "../../schemas/labels";
import BaseCard from "./BaseCard";

const SEVERITY_OPTIONS: {
  value: SeverityRatingType;
  emoji: string;
  activeColor: string;
  activeBg: string;
}[] = [
  {
    value: SeverityRating.NoSymptom,
    emoji: "😊",
    activeColor: "#9ccc65", //"#2e7d32",
    activeBg: '#f1f8e9', //"#f0fdf4",
  },
  {
    value: SeverityRating.Mild,
    emoji: "😐",
    activeColor: "#ffca28", //"#16a34a",
    activeBg: "#fff8e1", //"#f0fdf4",
  },
  {
    value: SeverityRating.Moderate,
    emoji: "😣",
    activeColor: "#ffa726", //"#d97706",
    activeBg: "#fff3e0" //"#fffbeb",
  },
  {
    value: SeverityRating.Severe,
    emoji: "🤧",
    activeColor: "#ef5350", // "#dc2626",
    activeBg: "#ffebee" //"#fff5f5",
  },
];

interface ButtonProps {
  value: SeverityRatingType;
  emoji: string;
  activeColor: string;
  activeBg: string;
  isActive: boolean;
  onClick: () => void;
}

const SeverityButton = ({
  value,
  emoji,
  activeColor,
  activeBg,
  isActive,
  onClick,
}: ButtonProps) => {
  return (
    <ButtonBase
      role="radio"
      aria-checked={isActive}
      onClick={onClick}
      className="flex flex-col items-center text-center w-full py-3 px-1"
      sx={{
        border: `1.5px solid ${isActive ? activeColor : "#e2ece2"}`,
        borderRadius: "12px",
        background: isActive ? activeBg : "#fff",
        transition: "all 0.15s",
        fontFamily: "inherit",
      }}
    >
      <Box component="span" className="block mb-1" sx={{ fontSize: 22 }}>
        {emoji}
      </Box>
      <Typography variant="body2">
        {SeverityLabel[value]}
      </Typography>
      {/* <Box
        component="span"
        className="font-medium"
        sx={{ fontSize: '0.75rem', color: "#4a6741", fontWeight: 500 }}
        // sx={{ fontSize: 11, color: isActive ? activeColor : "#4a6741" }}
      >
        {SeverityLabel[value]}
      </Box> */}
    </ButtonBase>
  );
};

interface Props {
  severity: SeverityRatingType;
  setSeverity: React.Dispatch<React.SetStateAction<SeverityRatingType>>;
}

const SeverityCard = ({ severity, setSeverity }: Props) => {
  return (
    <BaseCard cardHeader={"Severity Level"} >
      {/* <CardContent>
        <Typography
          variant="caption"
          className="block mb-2.5"
        >
          Severity Level
        </Typography> */}

        <div
          className="grid grid-cols-4 gap-2"
          role="group"
          aria-label="Severity Level"
        >
          {SEVERITY_OPTIONS.map(({ value, emoji, activeColor, activeBg }) => (
            <SeverityButton
              key={value}
              value={value}
              emoji={emoji}
              activeColor={activeColor}
              activeBg={activeBg}
              isActive={severity === value}
              onClick={() => setSeverity(value)}
            />
          ))}
        </div>
      {/* </CardContent> */}
    </BaseCard>
  );
};

export default SeverityCard;
