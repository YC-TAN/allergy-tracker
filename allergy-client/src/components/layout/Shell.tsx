/**
 * Main application shell and navigation layout.
 *
 * Provides the top app bar, bottom navigation, and a router outlet for
 * rendering page content. This wrapper defines the primary page structure
 * used across the application.
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

const Shell = () => {
  return (
    <Box
      className="flex flex-col mx-auto h-dvh max-w-97.5" // 97.5 = 390px
      sx={{ bgcolor: 'background.default' }}
    >
      <AppBar position="static">
        <Toolbar className="flex justify-between">
          <Typography variant="h6">Allergy Tracker</Typography>
          <SyncIcon />
        </Toolbar>
      </AppBar>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <BottomNavigation>
        <BottomNavigationAction label="Home" icon={<HomeOutlined />} component={Link} to="/" />
        <BottomNavigationAction label="Trends" icon={<BarChartOutlined />} component={Link} to="/trends" />
        <BottomNavigationAction label="Settings" icon={<SettingsOutlined />} component={Link} to="/settings" />
        <AuthButton />
      </BottomNavigation>
    </Box>
  );
};

export default Shell;