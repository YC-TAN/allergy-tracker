import type { User } from "@supabase/supabase-js";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  CircularProgress,
} from "@mui/material";
import {
  HomeOutlined,
  BarChartOutlined,
  SettingsOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import LogoutDialog from "./LogoutDialog";

interface BottomNavProps {
  user: User | null | undefined;
  userIsPending: boolean;
  signOut: () => void;
  isSigningOut: boolean;
}

const BottomNav = ({
  user,
  userIsPending,
  signOut,
  isSigningOut,
}: BottomNavProps) => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const location = useLocation();

  const handleConfirmLogout = () => {
    setLogoutDialogOpen(false);
    signOut();
  };

  const renderAuthAction = () => {
    if (userIsPending) {
      return (
        <BottomNavigationAction
          label="Loading ..."
          icon={<CircularProgress size={20} />}
          disabled
        />
      );
    }

    if (user) {
      return (
        <BottomNavigationAction
          label="Sign out"
          icon={<LogoutOutlined />}
          onClick={() => setLogoutDialogOpen(true)}
          disabled={isSigningOut}
        />
      );
    }

    return (
      <BottomNavigationAction
        label="Sign in"
        value="/login"
        icon={<LoginOutlined />}
        component={Link}
        to="/login"
      />
    );
  };
  return (
    <>
      <BottomNavigation 
      showLabels 
      value={location.pathname}
      sx={{
            height: "auto",
            py: 1,
            "& .MuiBottomNavigationAction-root": {
              py: 0.5,
              minWidth: "auto",
            },
            "& .MuiSvgIcon-root": {
              fontSize: "1.25rem", // Shrinks icons from standard 1.5rem (24px) to 20px
              mb: 0.125, // Spacing between icon and label
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "0.75rem",
            },
          }}
      >
        <BottomNavigationAction
          label="Home"
          value="/"
          icon={<HomeOutlined />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="Trends"
          value="/trends"
          icon={<BarChartOutlined />}
          component={Link}
          to="/trends"
        />
        <BottomNavigationAction
          label="Settings"
          value="/settings"
          icon={<SettingsOutlined />}
          component={Link}
          to="/settings"
        />
        {renderAuthAction()}
      </BottomNavigation>
      <LogoutDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default BottomNav;
