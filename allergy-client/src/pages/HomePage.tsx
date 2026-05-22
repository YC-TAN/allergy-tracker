import { useState } from "react";

import { SeverityRating, type Symptom, type SeverityRatingType } from "../schemas";
import SeverityCard from "../components/ui/SeverityCard";
import SymptomCard from "../components/ui/SymptomCard";

const HomePage = () => {
  const [severity, setSeverity] = useState<SeverityRatingType>(SeverityRating.Mild)
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  return (
    <div>
      HomePage
      <SeverityCard severity={severity} setSeverity={setSeverity} />
      <SymptomCard symptoms={symptoms} setSymptoms={setSymptoms}/>
    </div>
  )
}

export default HomePage;