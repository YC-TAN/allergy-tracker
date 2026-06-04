/**
 * Entry form component for logging allergy data.
 * Renders severity, symptom, and notes inputs.
 * Handles both creation and update. 
 * 
 * This component manages local form state and delegates
 * persistence through the useEntry hook.
 */

import { useState } from "react";
import { Button, Typography } from "@mui/material";

import {
  SeverityRating,
  type SeverityRatingType,
  type Symptom,
} from "../../schemas";
import { useEntry } from "../../hooks/useEntry";
import SeverityCard from "../ui/SeverityCard";
import NotesCard from "../ui/NotesCard";
import SymptomCard from "../ui/SymptomCard";
import { useNavigate } from "react-router-dom";
import type { Entry } from "../../schemas";

interface EntryFormProps {
  existing?: Entry | null;
}

const EntryForm = ({ existing }: EntryFormProps) => {
  const { save } = useEntry();
  const navigate = useNavigate();

  const [severity, setSeverity] = useState<SeverityRatingType>(
    existing?.severity ?? SeverityRating.Mild,
  );
  const [symptoms, setSymptoms] = useState<Symptom[]>(existing?.symptoms ?? []);
  const [notes, setNotes] = useState<string>(existing?.notes ?? "");

  const handleSubmit = () => {
    const entry = {
      ...existing,
      severity,
      symptoms,
      notes,
    };
    save(entry);
    navigate("/");
  };

  const handleNoSymptoms = () => {
    const entry = {
      ...existing,
      severity: SeverityRating.NoSymptom,
      symptoms: [],
      notes: "",
    }
    save(entry);
    navigate("/");
  }

  return (
    <div className="flex flex-col px-5 pb-6">
      <div className="flex items-center gap-2 py-4">
        <Typography variant="h5" className="w-100 text-center">
          Log Symptoms
        </Typography>
      </div>
      <SeverityCard severity={severity} setSeverity={setSeverity} />
      <SymptomCard symptoms={symptoms} setSymptoms={setSymptoms} />
      <NotesCard notes={notes} setNotes={setNotes} />
      {existing && (
        <Button
          variant="contained"
          color="secondary"
          className="mb-4"
          fullWidth
          onClick={handleNoSymptoms}
        >
          Actually, no symptoms today
        </Button>
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Save Entry
      </Button>
    </div>
  );
};

export default EntryForm;
