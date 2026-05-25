import LogForm from "../components/log/LogForm";
import CheckIn from "../components/log/CheckIn";

const HomePage = () => {

  const handleAllGood = () => {

  }

  const handleLogSymptoms = () => {
    
  }


  return (
    <div>
      <CheckIn onAllGood={handleAllGood} onLogSymptoms={handleLogSymptoms}/>
      <LogForm />
    </div>
  )
}

export default HomePage;