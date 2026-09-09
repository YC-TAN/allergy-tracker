import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  BottomNavigationAction,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import { LoginOutlined, LogoutOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

/**
 * Props passed to the Auth bottom navigation button.
 */
interface AuthButtonProps {
  /** The currently loaded Supabase user, or null while signed out. */
  user: User | null | undefined;
  /** True while the session lookup is still pending. */
  userIsPending: boolean;
  /** Starts the sign-out mutation flow. */
  signOut: () => void;
  /** True while a logout request is in flight. */
  isSigningOut: boolean;
}

/**
 * Renders the login or logout for the shared bottom navigation.
 *
 * When a user click Logout Icon, the component shows a confirmation dialog.
 */
const AuthButton = ({
  user,
  userIsPending,
  signOut,
  isSigningOut,
}: AuthButtonProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (userIsPending) {
    return (
      <BottomNavigationAction
        label="Loading"
        icon={<CircularProgress size={20} />}
        disabled
      />
    );
  }

  const handleConfirmLogout = () => {
    setConfirmOpen(false);
    signOut();
  };

  return user ? (
    <>
      <BottomNavigationAction
        label="Logout"
        icon={<LogoutOutlined />}
        onClick={() => setConfirmOpen(true)}
        disabled={isSigningOut}
      />
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Log out?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Any unsynced entries on this device will stay saved locally and sync
            next time you sign in.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmOpen(false)}
            color="primary"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLogout}
            color="error"
            variant="outlined"
          >
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ) : (
    <BottomNavigationAction
      label="Login"
      icon={<LoginOutlined />}
      component={Link}
      to="/login"
    />
  );
};

export default AuthButton;
