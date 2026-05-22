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
    Home,
    BarChart,
    Settings,
} from "@mui/icons-material";

const Shell = () => {
  return (
    <Box
      className="flex flex-col mx-auto h-dvh max-w-97.5" // 97.5 = 390px
      sx={{ bgcolor: 'background.default' }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Allergy Tracker</Typography>
        </Toolbar>
      </AppBar>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <BottomNavigation>
        <BottomNavigationAction label="Home" icon={<Home />} component={Link} to="/" />
        <BottomNavigationAction label="Trends" icon={<BarChart />} component={Link} to="/trends" />
        <BottomNavigationAction label="Settings" icon={<Settings />} component={Link} to="/settings" />
      </BottomNavigation>
    </Box>
  );
};

export default Shell;