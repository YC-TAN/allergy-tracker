import { Outlet } from "react-router-dom";
import { useTheme,
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
  const theme = useTheme();
  return (
    <div
      className="flex flex-col mx-auto h-dvh max-w-97.5" // 97.5 = 390px
      style={{ backgroundColor: theme.palette.background.default }}
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
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Trends" icon={<BarChart />} />
        <BottomNavigationAction label="Settings" icon={<Settings />} />
      </BottomNavigation>
    </div>
  );
};

export default Shell;