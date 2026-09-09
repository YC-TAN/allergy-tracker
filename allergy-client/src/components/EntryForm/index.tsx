/**
 * Entry form component for logging allergy data.
 * Renders severity, symptom, and notes inputs.
 * Handles both creation and update.
 *
 * This component manages local form state and delegates
 * persistence through the useEntry hook.
 */

import { useState } from "react";
import { Button } from "@mui/material";

import {
  SeverityRating,
  type SeverityRatingType,
  type Symptom,
} from "../../schemas";
import { useEntry } from "../../hooks/useEntry";
import { useSettings } from "../../hooks/useSettings";
import SeverityCard from "./SeverityCard";
import NotesCard from "./NotesCard";
import SymptomCard from "./SymptomCard";
import { useNavigate } from "react-router-dom";
import type { Entry, EntryInput } from "../../schemas";
import PageTitle from "../ui/PageTitle";

interface EntryFormProps {
  existing?: Entry | null;
}

const EntryForm = ({ existing }: EntryFormProps) => {
  const { save } = useEntry();
  const { settings, settingsIsPending } = useSettings();
  const navigate = useNavigate();

  const [severity, setSeverity] = useState<SeverityRatingType>(
    existing?.severity ?? SeverityRating.Mild,
  );
  const [symptoms, setSymptoms] = useState<Symptom[]>(existing?.symptoms ?? []);
  const [notes, setNotes] = useState<string>(existing?.notes ?? "");

  if (settingsIsPending) return <div>loading...</div>;

  const location = settings?.location;

  const handleSubmit = () => {
    const entry: EntryInput = {
      ...existing,
      severity,
      symptoms,
      notes,
      location,
    };
    save(entry);
    navigate("/");
  };

  const handleNoSymptoms = () => {
    const entry: EntryInput = {
      ...existing,
      location,
      severity: SeverityRating.NoSymptom,
      symptoms: [],
      notes: "",      
    };
    save(entry);
    navigate("/");
  };

  return (
    <>
      <PageTitle>Log Symptoms</PageTitle>
      <SeverityCard severity={severity} setSeverity={setSeverity} />
      <SymptomCard symptoms={symptoms} setSymptoms={setSymptoms} />
      <NotesCard notes={notes} setNotes={setNotes} />

      <Button
        variant="outlined"
        color="primary"
        className="mb-4"
        fullWidth
        onClick={handleNoSymptoms}
      >
        Actually, no symptoms today
      </Button>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Save Entry
      </Button>
    </>
  );
};

export default EntryForm;
