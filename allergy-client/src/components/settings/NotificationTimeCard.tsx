import {
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useSettings } from "../../hooks/useSettings";
import { useState } from "react";
import BaseCard from "../ui/BaseCard";

const NotificationTimeCard = () => {
  const { settings, update } = useSettings();
  const [draftTime, setDraftTime] = useState<string | undefined>(undefined);
  const edited = draftTime !== undefined && draftTime !== settings?.notify_time;

  const handleNewTime = () => {
    if (!settings || !draftTime) return;
    update(
      { ...settings, notify_time: draftTime },
      `Reminder updated to ${draftTime}`,
    );
    setDraftTime(undefined);
  };

  return (
    <BaseCard>
      <Typography variant="body1" className="mb-2">
        Daily check-in reminder:
      </Typography>

      <div className="flex gap-2">
        <TextField
          className="flex-1"
          type="time"
          value={draftTime ?? settings?.notify_time ?? "08:00"}
          onChange={(e) => setDraftTime(e.target.value)}
          disabled={!settings?.notify}
          slotProps={{
            input: { inputProps: { "aria-label": "Edit daily reminder" } },
          }}
        />
        <Button
          onClick={handleNewTime}
          variant="contained"
          disabled={!settings?.notify || !edited}
        >
          Update
        </Button>
      </div>
    </BaseCard>
  );
};

export default NotificationTimeCard;
