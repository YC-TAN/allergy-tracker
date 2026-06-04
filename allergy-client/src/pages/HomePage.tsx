/**
 * HomePage the app's main landing page.
 * 
 * It shows DailyLog when today's entry exists, and CheckIn otherwise.
 */

import { useEntry } from "../hooks/useEntry";

import CheckIn from "../components/entry/CheckIn";
import DailyLog from "../components/entry/DailyLog"

const HomePage = () => {
  const { entry, isPending } = useEntry();

  if (isPending) return <div>loading...</div>
  if (entry) return <DailyLog />

  return (
    <div>
      <CheckIn />
    </div>
  )
}

export default HomePage;