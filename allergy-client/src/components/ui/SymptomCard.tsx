import { Box, Card, CardContent, Chip, Typography } from "@mui/material";

import { SymptomSchema, type Symptom } from "../../schemas";
import type React from "react";

const symptomOptions = SymptomSchema.options;

const SymptomLabel: Record<Symptom, { label: string; icon?: string }> = {
  eyes: { label: "Eyes" },
  nose: { label: "Nose" },
  throat: { label: "Throat" },
  energy: { label: "Energy" },
  headache: { label: "Headache" },
  other: {label: "Other (Please specify in Notes)"}
};

interface SymptomChipProps {
  symptom: Symptom;
  selected: boolean;
  onToggle: (symptom: Symptom) => void;
}

function SymptomChip({ symptom, selected, onToggle }: SymptomChipProps) {
  const { label } = SymptomLabel[symptom];

  return (
    <Chip
      label={<span className="flex items-center gap-1">{label}</span>}
      onClick={() => onToggle(symptom)}
      variant={selected ? "filled" : "outlined"}
      color={selected ? "primary" : "default"}
      aria-pressed={selected}
      sx={{
        borderWidth: "1.5px",
        borderRadius: "20px",
        fontWeight: selected ? 500 : 400,
        backgroundColor: selected ? "primary.light" : "transparent",
        color: selected ? "primary.dark" : "text.secondary",
        borderColor: selected ? "primary.main" : "divider",
        "&:hover": {
          backgroundColor: selected ? "#c8e6c9" : "#f0f7f0",
        },
        "& .MuiChip-label": {
          px: 1.5,
        },
      }}
    />
  );
}

interface SymptomCardProps {
  symptoms: Symptom[];
  setSymptoms: React.Dispatch<React.SetStateAction<Symptom[]>>;
}

const SymptomCard = ({ symptoms, setSymptoms }: SymptomCardProps) => {
  function toggleSymptom(symptom: Symptom) {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
    );
  }
  return (
    <Card className="mb-3">
      <CardContent>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            display: "block",
            mb: 1.25,
          }}
        >
          Symptoms{" "}
          <Box
            component="span"
            sx={{
              fontWeight: 400,
              textTransform: "none",
              letterSpacing: 0,
              color: "#7a9e77",
            }}
          ></Box>
        </Typography>

        <div className="flex flex-wrap gap-2">
          {symptomOptions.map((sym) => (
            <SymptomChip
              key={sym}
              symptom={sym}
              selected={symptoms.includes(sym)}
              onToggle={toggleSymptom}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SymptomCard;
