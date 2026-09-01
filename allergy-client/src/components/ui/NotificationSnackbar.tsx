/**
 * Global snackbar notification container.
 * Displays the current app notification message and severity,
 * and closes automatically after a timeout or when dismissed.
 */

import { Snackbar, Alert } from "@mui/material";
import {
  useNotification,
  useNotificationActions,
} from "../../hooks/useNotificationStore";

const NotificationSnackbar = () => {
  const notification = useNotification();
  const { close } = useNotificationActions();
  return (
    <>
      <Snackbar
        open={notification !== null}
        autoHideDuration={5000}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {notification ? (
          <Alert
            onClose={close}
            severity={notification.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
};

export default NotificationSnackbar;
