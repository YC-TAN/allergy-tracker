/**
 * HomePage the app's main landing page.
 *
 * It shows today's entry record when exists, and check in prompt otherwise.
 * It also displays today's local pollen forecast from MetService.
 */
import CheckInCard from "../components/CheckIn/CheckInCard";
import ForecastCard from "../components/CheckIn/ForecastCard";
import { getNZTodayDateString, getNZTodayDayOfWeek } from "../utils/dates";
import PageTitle from "../components/ui/PageTitle";

const HomePage = () => {
  const today = getNZTodayDateString();
  const dayOfWeek = getNZTodayDayOfWeek();

  return (
      <>
      <PageTitle title={today + ", " + dayOfWeek} />
      <CheckInCard />
      <ForecastCard />
      </>
  )
}

export default HomePage;
