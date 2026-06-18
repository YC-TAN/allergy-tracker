/**
 * HomePage the app's main landing page.
 *
 * It shows DailyLog when today's entry exists, and CheckIn otherwise.
 */

import { useEntry } from "../hooks/useEntry";

import CheckIn from "../components/entry/CheckIn";
import DailyLog from "../components/entry/DailyLog"
import TomorrowCard from "../components/entry/TomorrowCard";

const HomePage = () => {
  const { entry, isPending } = useEntry();

  if (isPending) return <div>loading...</div>
  // if (entry) return <DailyLog />

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-6">
      {entry ? (<DailyLog />) : (<CheckIn />)}
      <TomorrowCard />
    </div>
  )
}

export default HomePage;
