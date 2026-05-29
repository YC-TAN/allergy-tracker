import { useEntry } from "../hooks/useEntry";
import { getTodayDate } from "../utils/storage";

import CheckIn from "../components/entry/CheckIn";
import DailyLog from "../components/entry/DailyLog"

const HomePage = () => {
  const today = getTodayDate();
  const { entry, isPending } = useEntry(today);

  const handleLogSymptoms = () => {
    
  }

  const handleEditEntry = () => {
    
  }

    if (isPending) return <div>loading...</div>
    console.log(entry);

  if (entry) return <DailyLog onEditEntry={handleEditEntry} />

  return (
    <div>
      <CheckIn onLogSymptoms={handleLogSymptoms}/>
    </div>
  )
}

export default HomePage;