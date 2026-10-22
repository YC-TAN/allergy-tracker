/**
 * Main application shell and navigation layout.
 *
 * Renders the shared application layout with the top bar,
 * bottom navigation, route outlet, and auth control.
 */

import { Outlet, Link } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import BottomNav from "./BottomNav";
import SyncIcon from "./SyncIcon";
import { useSyncEntries } from "../../hooks/useSyncEntries";

const Shell = () => {
  const { isSyncing } = useSyncEntries();

  return (
    <Box
      className="flex flex-col mx-auto h-dvh w-full lg:max-w-180" // 97.5 = 390px
    >
      <AppBar position="static">
        <Toolbar className="flex justify-between px-5 md:px-auto">
          <Typography
            variant="h5"
            component={Link}
            to="/"
            className="no-underline text-inherit cursor-pointer"
          >
            Allergy Tracker
          </Typography>
          <SyncIcon
            isSyncing={isSyncing}
          />
        </Toolbar>
      </AppBar>

      <main className="flex-1 flex flex-col items-center px-5 py-6 md:px-[10%] md:py-[5%]">
        <Outlet />
      </main>

      <BottomNav/>
    </Box>
  );
};

export default Shell;
