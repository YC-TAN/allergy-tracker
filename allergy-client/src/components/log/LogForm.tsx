import { useState } from "react";
import { Button, Typography } from "@mui/material";

import {
  SeverityRating,
  type SeverityRatingType,
  type Symptom,
} from "../../schemas";
import SeverityCard from "../ui/SeverityCard";
import NotesCard from "../ui/NotesCard";
import SymptomCard from "../ui/SymptomCard";

const LogForm = () => {
  const [severity, setSeverity] = useState<SeverityRatingType>(
    SeverityRating.Mild,
  );
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [notes, setNotes] = useState<string | null>(null);

  const handleSubmit = () => {};
  return (
    <div className="flex flex-col px-5 pb-6">
        <div className="flex items-center gap-2 py-4">
        <Typography variant="h5" className="w-100 text-center">Log Symptoms</Typography>
      </div>
      <SeverityCard severity={severity} setSeverity={setSeverity} />
      <SymptomCard symptoms={symptoms} setSymptoms={setSymptoms} />
      <NotesCard notes={notes} setNotes={setNotes} />
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

export default LogForm;
