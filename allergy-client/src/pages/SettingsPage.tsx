/**
 * SettingsPage shows app preferences and settings options.
 *
 * It is used by the /settings route in the app router for setting user's preference.
 */

import { useSettings } from "../hooks/useSettings";
// import NotificationToggleCard from "../components/settings/NotificationToggleCard";
// import NotificationTimeCard from "../components/settings/NotificationTimeCard";
import PageTitle from "../components/ui/PageTitle";
import LocationCard from "../components/settings/LocationCard";

const SettingsPage = () => {
  const { settingsIsPending } = useSettings();

  if (settingsIsPending) return <div>loading...</div>;

  return (
    <>
      <PageTitle title="Settings" />
      {/* <NotificationToggleCard />
      <NotificationTimeCard /> */}
      <LocationCard />
    </>
  );
};

export default SettingsPage;
