/**
 * SettingsPage shows app preferences and settings options.
 *
 * It is used by the /settings route in the app router for setting user's preference.
 */

import {
  Typography,
  Card,
  CardContent,
  Switch,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
  Button,
} from "@mui/material";
import { useSettings } from "../hooks/useSettings";
import { useState } from "react";

const SettingsPage = () => {
  const { settings, isPending, update } = useSettings();
  const [draftTime, setDraftTime] = useState<string | undefined>(undefined);
  const edited = draftTime !== undefined && draftTime !== settings?.notify_time;

  if (isPending) return <div>loading...</div>;

  const handleNotify = () => {
    if (!settings) return;
    update({
      ...settings,
      notify: !settings?.notify,
    });
  };

  const handleNewTime = () => {
    if (!settings || !draftTime) return;
    update({ ...settings, notify_time: draftTime });
    setDraftTime(undefined);
  };

  return (
    <div className="flex flex-col items-center px-5 pt-8 pb-6">
      <div className="flex flex-col px-5 pb-6">
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
      </div>

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
                  sx={{ ml: 0, justifyContent: 'space-between' }}
                />
              </FormGroup>
            </FormControl>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent>
          <Typography variant="body1" className="mb-2">Daily check-in reminder:</Typography>

          <div className="flex gap-2">
            <TextField
              type="time"
              value={draftTime ?? settings?.notify_time ?? "08:00"}
              onChange={(e) => setDraftTime(e.target.value)}
              disabled={!settings?.notify}
              slotProps={{
                input: { inputProps: { "aria-label": "Edit daily reminder" } },
              }}
            />
            {edited && (
              <Button onClick={handleNewTime} variant="contained" disabled={!settings?.notify}>
                Update
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
