/**
 * SettingsPage shows app preferences and settings options.
 *
 * It is used by the /settings route in the app router for setting user's preference.
 */

import { Typography } from "@mui/material";
import { useSettings } from "../hooks/useSettings";
import NotificationToggleCard from "../components/settings/NotificationToggleCard";
import NotificationTimeCard from "../components/settings/NotificationTimeCard";
import PageTitle from "../components/ui/PageTitle";

const SettingsPage = () => {
  const { settingsIsPending } = useSettings();

  if (settingsIsPending) return <div>loading...</div>;

  return (
    <>
      <PageTitle>Settings</PageTitle>
      <NotificationToggleCard />
      <NotificationTimeCard />
    </>
  );
};

export default SettingsPage;
