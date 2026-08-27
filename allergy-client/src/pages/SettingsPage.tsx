/**
 * SettingsPage shows app preferences and settings options.
 *
 * It is used by the /settings route in the app router for setting user's preference.
 */

import { Typography } from "@mui/material";
import { useSettings } from "../hooks/useSettings";
import NotificationToggleCard from "../components/settings/NotificationToggleCard";
import NotificationTimeCard from "../components/settings/NotificationTimeCard";

const SettingsPage = () => {
  const { settingsIsPending } = useSettings();

  if (settingsIsPending) return <div>loading...</div>;

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-6">
      <div className="flex flex-col px-5 pb-6">
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
      </div>
      <NotificationToggleCard />
      <NotificationTimeCard />
    </div>
  );
};

export default SettingsPage;
