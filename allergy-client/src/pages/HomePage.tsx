import { useState } from "react";

import { SeverityRating, type Symptom, type SeverityRatingType } from "../schemas";
import SeverityCard from "../components/ui/SeverityCard";
import SymptomCard from "../components/ui/SymptomCard";
import NotesCard from "../components/ui/NotesCard";

import {Button} from '@mui/material'

const HomePage = () => {
  const [severity, setSeverity] = useState<SeverityRatingType>(SeverityRating.Mild)
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [notes, setNotes] = useState<string | null>(null);

  const handleSubmit = () => {

  }

  return (
    <div>
      HomePage
      <SeverityCard severity={severity} setSeverity={setSeverity} />
      <SymptomCard symptoms={symptoms} setSymptoms={setSymptoms}/>
      <NotesCard notes={notes} setNotes={setNotes} />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Save entry
      </Button>
    </div>
  )
}

export default HomePage;