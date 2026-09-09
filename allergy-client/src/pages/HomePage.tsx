/**
 * HomePage the app's main landing page.
 *
 * It shows DailyLog when today's entry exists, and CheckIn Prompt otherwise.
 */

import { useEntry } from "../hooks/useEntry";

import CheckInCard from "../components/DailyCheckIn/CheckInCard";
import DailyLog from "../components/DailyCheckIn/DailyLog"
import ForecastCard from "../components/DailyCheckIn/ForecastCard";

const HomePage = () => {
  const { entry, isPending, isError, error } = useEntry();

  if (isPending) return <div>loading...</div>
  if (isError) {
    console.error("Entry fetch failed:", error); 
    return <div>Couldn't load today's entry — check your connection</div>;
}
  return (
      <>
      {entry ? (<DailyLog />) : (<CheckInCard />)}
      <ForecastCard />
      </>
  )
}

export default HomePage;
