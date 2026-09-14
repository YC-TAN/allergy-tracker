/**
 * TrendsPage shows longer-term allergy insights and visual summaries.
 *
 * It is used by the /trends route in the app router.
 */

import WeekChart from "../components/trends/WeekChart";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";
import PageTitle from "../components/ui/PageTitle";

const TrendsPage = () => {
  return (
    <>
      <PageTitle title="7-Day Trend"></PageTitle>
      <ErrorBoundary fallbackMessage="Couldn't display the chart">
        <WeekChart />
      </ErrorBoundary>
    </>
  );
};

export default TrendsPage;
