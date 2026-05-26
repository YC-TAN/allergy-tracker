import LogForm from "../components/log/LogForm";
import CheckIn from "../components/log/CheckIn";
import DailyLog from "../components/log/DailyLog"

const HomePage = () => {

  const handleAllGood = () => {

  }

  const handleLogSymptoms = () => {
    
  }

  const handleEditEntry = () => {
    
  }


  return (
    <div>
      <DailyLog onEditEntry={handleEditEntry}/>
      <CheckIn onAllGood={handleAllGood} onLogSymptoms={handleLogSymptoms}/>
      <LogForm />
    </div>
  )
}

export default HomePage;