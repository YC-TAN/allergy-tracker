/**
 * Main application shell and navigation layout.
 * 
 * Renders the shared application layout with the top bar,
 * bottom navigation, route outlet, and auth control.
 */

import { Outlet, Link } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import {
  HomeOutlined,
  BarChartOutlined,
  SettingsOutlined,
} from "@mui/icons-material";

import AuthButton from "./AuthButton";
import SyncIcon from "./SyncIcon";
import { useAuth } from "../../hooks/useAuth";
import { useSyncEntries } from "../../hooks/useSyncEntries";

const Shell = () => {
  const { user, userIsPending, signOut, isSigningOut } = useAuth();
  const { isSyncing } = useSyncEntries();

  return (
    <Box
      className="flex flex-col mx-auto h-dvh w-full lg:max-w-180" // 97.5 = 390px
    >
      <AppBar position="static">
        <Toolbar className="flex justify-between">
          <Typography
            variant="h5"
            component={Link}
            to="/"
            className="no-underline text-inherit cursor-pointer"
          >
            Allergy Tracker
          </Typography>
          <SyncIcon user={user} userIsPending={userIsPending} isSyncing={isSyncing} />
        </Toolbar>
      </AppBar>

      <main className="flex-1 flex flex-col items-center px-5 py-4 md:px-[10%] md:py-[5%]">
        <Outlet />
      </main>

      <BottomNavigation>
        <BottomNavigationAction
          label="Home"
          icon={<HomeOutlined />}
          component={Link}
          to="/"
        />
        <BottomNavigationAction
          label="Trends"
          icon={<BarChartOutlined />}
          component={Link}
          to="/trends"
        />
        <BottomNavigationAction
          label="Settings"
          icon={<SettingsOutlined />}
          component={Link}
          to="/settings"
        />
        <AuthButton user={user} userIsPending={userIsPending} signOut={signOut} isSigningOut={isSigningOut}/>
      </BottomNavigation>
    </Box>
  );
};

export default Shell;
