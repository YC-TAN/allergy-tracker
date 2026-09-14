/**
 * TrendsPage shows longer-term allergy insights and visual summaries.
 * 
 * It is used by the /trends route in the app router.
 */

import WeekChart from "../components/trends/WeekChart";
import PageTitle from "../components/ui/PageTitle";

const TrendsPage = () => {
  return (
    <>
    <PageTitle title="7-Day Trend"></PageTitle>
    <WeekChart/>
    </>
    
  )
}

export default TrendsPage