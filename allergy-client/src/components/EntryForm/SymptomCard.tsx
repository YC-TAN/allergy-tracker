/**
 * SymptomCard renders selectable symptom chips used in the symptom entry form.
 *
 * It captures allergy symptoms occurred today.
 */
import { Chip, Typography } from "@mui/material";

import { SymptomSchema, type Symptom } from "../../schemas";
import type React from "react";
import BaseCard from "../ui/BaseCard";
import CardTitle from "../ui/CardTitle";

const symptomOptions = SymptomSchema.options;

const SymptomLabel: Record<Symptom, { label: string; icon?: string }> = {
  eyes: { label: "Eyes" },
  nose: { label: "Nose" },
  throat: { label: "Throat" },
  energy: { label: "Low Energy" },
  headache: { label: "Headache" },
  other: { label: "Other (Please specify in Notes)" },
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
      label={
        <Typography
          variant="body2"
          component="span"
          className="flex items-center gap-1"
        >
          {label}
        </Typography>
      }
      onClick={() => onToggle(symptom)}
      variant={selected ? "filled" : "outlined"}
      color={selected ? "primary" : "default"}
      aria-pressed={selected}
      sx={{
        borderWidth: "1.5px",
        borderRadius: "20px",
        fontWeight: selected ? 600 : 400,
        backgroundColor: selected ? "primary.light" : "transparent",
        color: selected ? "text.primary" : "text.secondary",
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
    <BaseCard>
      <CardTitle title={"Symptoms"} />
      <div className="flex flex-wrap gap-2 md:px-[5%] w-full">
        {symptomOptions.map((sym) => (
          <SymptomChip
            key={sym}
            symptom={sym}
            selected={symptoms.includes(sym)}
            onToggle={toggleSymptom}
          />
        ))}
      </div>
    </BaseCard>
  );
};

export default SymptomCard;
