/**
 * SeverityCard shows three severity selections used in the symptom entry form.
 *
 * It lets users choose the allergy severity level for today's log and updates parent form state.
 */
import { Box, ButtonBase, Typography } from "@mui/material";

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
    activeBg: "#f1f8e9", //"#f0fdf4",
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
    activeBg: "#fff3e0", //"#fffbeb",
  },
  {
    value: SeverityRating.Severe,
    emoji: "🤧",
    activeColor: "#ef5350", // "#dc2626",
    activeBg: "#ffebee", //"#fff5f5",
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
        border: 1.5,
        borderStyle: "solid",
        borderColor: isActive ? activeColor : "divider",
        borderRadius: "12px",
        background: isActive ? activeBg : "#fff",
        transition: "all 0.15s",
        fontFamily: "inherit",
        "&:hover": {
          backgroundColor: !isActive && activeBg,
        },
      }}
    >
      <Box component="span" className="block mb-1" sx={{ fontSize: 24 }}>
        {emoji}
      </Box>
      <Typography
        variant="body2"
        // color={isActive? activeColor: "textSecondary"}
        sx={{ fontWeight: isActive ? 600 : 400,
          color: isActive? activeColor: "textSecondary"
         }}
      >
        {SeverityLabel[value]}
      </Typography>
    </ButtonBase>
  );
};

interface Props {
  severity: SeverityRatingType;
  setSeverity: React.Dispatch<React.SetStateAction<SeverityRatingType>>;
}

const SeverityCard = ({ severity, setSeverity }: Props) => {
  return (
    <BaseCard cardHeader={"Severity Level"}>
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
    </BaseCard>
  );
};

export default SeverityCard;
