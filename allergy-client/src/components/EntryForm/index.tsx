/**
 * Entry form component for logging symptoms and notes.
 * Renders severity, symptom, notes inputs, took honey checkbox.
 * Handles both creation and update.
 *
 * This component manages local form state and delegates
 * persistence through the useEntry hook.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import {
  SeverityRating,
  type SeverityRatingType,
  type Symptom,
  type Entry, 
  type EntryInput,
} from "../../schemas";
import { useEntry } from "../../hooks/useEntry";
import { useSettings } from "../../hooks/useSettings";
import SeverityCard from "./SeverityCard";
import NotesCard from "./NotesCard";
import SymptomCard from "./SymptomCard";
import TreatmentsCard from "./TreatmentsCard";
import ProgressBox from "../ui/ProgressBox";

interface EntryFormProps {
  existing?: Entry | null;
}

const EntryForm = ({ existing }: EntryFormProps) => {
  const { save } = useEntry();
  const { settings, settingsIsPending } = useSettings();
  const navigate = useNavigate();

  const [severity, setSeverity] = useState<SeverityRatingType>(
    existing?.severity ?? SeverityRating.NoSymptoms,
  );
  const [symptoms, setSymptoms] = useState<Symptom[]>(existing?.symptoms ?? []);
  const [notes, setNotes] = useState<string>(existing?.notes ?? "");
  const [honey, setHoney] = useState<boolean>(existing?.honey ?? false);

  if (settingsIsPending) return <ProgressBox />;

  const location = settings?.location;

  const handleSubmit = () => {
    const entry: EntryInput = {
      ...existing,
      severity,
      symptoms,
      notes,
      location,
      honey
    };
    save(entry);
    navigate("/");
  };

  return (
    <>
      <SeverityCard severity={severity} setSeverity={setSeverity} />
      <SymptomCard symptoms={symptoms} setSymptoms={setSymptoms} />      
      <NotesCard notes={notes} setNotes={setNotes} />
      <TreatmentsCard honey={honey} setHoney={setHoney} />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        {existing? "Update Entry" : "Save Entry"}
      </Button>
    </>
  );
};

export default EntryForm;
