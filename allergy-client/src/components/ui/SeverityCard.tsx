import { Box, ButtonBase, Card, CardContent, Typography } from "@mui/material";

import { SeverityRating, type SeverityRatingType } from "../../schemas";

const SEVERITY_OPTIONS: {
  value: SeverityRatingType;
  emoji: string;
  activeColor: string;
  activeBg: string;
}[] = [
  {
    value: SeverityRating.Mild,
    emoji: "😐",
    activeColor: "#16a34a",
    activeBg: "#f0fdf4",
  },
  {
    value: SeverityRating.Moderate,
    emoji: "😣",
    activeColor: "#d97706",
    activeBg: "#fffbeb",
  },
  {
    value: SeverityRating.Severe,
    emoji: "🤧",
    activeColor: "#dc2626",
    activeBg: "#fff5f5",
  },
];

const SeverityLabel: Record<SeverityRatingType, string> = {
  [SeverityRating.Mild]: "Mild",
  [SeverityRating.Moderate]: "Moderate",
  [SeverityRating.Severe]: "Severe",
};

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
      <Box
        component="span"
        className="font-medium"
        sx={{ fontSize: 11, color: isActive ? activeColor : "#4a6741" }}
      >
        {SeverityLabel[value]}
      </Box>
    </ButtonBase>
  );
};

interface Props {
  severity: SeverityRatingType;
  setSeverity: React.Dispatch<React.SetStateAction<SeverityRatingType>>;
}

const SeverityCard = ({ severity, setSeverity }: Props) => {
  return (
    <Card className="mb-3">
      <CardContent>
        <Typography
          variant="caption"
          className="block mb-2.5"
          sx={{
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Severity Level
        </Typography>

        <div
          className="grid grid-cols-3 gap-2"
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
      </CardContent>
    </Card>
  );
};

export default SeverityCard;
