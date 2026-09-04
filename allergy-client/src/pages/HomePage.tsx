/**
 * HomePage the app's main landing page.
 *
 * It shows DailyLog when today's entry exists, and CheckIn otherwise.
 */

import { useEntry } from "../hooks/useEntry";

import CheckIn from "../components/entry/CheckIn";
import DailyLog from "../components/entry/DailyLog"
import ForecastCard from "../components/entry/ForecastCard";

const HomePage = () => {
  const { entry, isPending, isError, error } = useEntry();

  if (isPending) return <div>loading...</div>
  if (isError) {
    console.error("Entry fetch failed:", error); 
    return <div>Couldn't load today's entry — check your connection</div>;
}
  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-6">
      {entry ? (<DailyLog />) : (<CheckIn />)}
      <ForecastCard />
    </div>
  )
}

export default HomePage;
