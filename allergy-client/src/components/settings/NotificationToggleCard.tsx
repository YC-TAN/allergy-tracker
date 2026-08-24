/**
 * colocating data requirements using tanStackQuery
 * useSettings caches 'settings' key, 
 * calling here is just subscribe to the same cache as parent component
 */

import {
  Card,
  CardContent,
  Switch,
  FormControl,
  FormControlLabel,
  FormGroup
} from "@mui/material";

import { useSettings } from "../../hooks/useSettings";

const NotificationToggleCard = () => {
  const { settings, update } = useSettings();

  const handleNotify = () => {
    if (!settings) return;
    update({
      ...settings,
      notify: !settings.notify,
    });
  };

  return (
    <Card className="mb-3 w-full">
      <CardContent>
        <FormControl className="w-full">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings?.notify ?? false}
                  onChange={handleNotify}
                  name="Notification status"
                />
              }
              label="Push Notification"
              labelPlacement="start"
              sx={{ ml: 0, justifyContent: "space-between" }}
            />
          </FormGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default NotificationToggleCard;
