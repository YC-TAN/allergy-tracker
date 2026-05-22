import { useState } from "react";

import SeverityCard from "../components/ui/SeverityCard";
import { SeverityRating, type SeverityRatingType } from "../schemas";

const HomePage = () => {
  const [severity, setSeverity] = useState<SeverityRatingType>(SeverityRating.Mild)
  return (
    <div>
      HomePage
      <SeverityCard severity={severity} setSeverity={setSeverity} />
    </div>
  )
}

export default HomePage;