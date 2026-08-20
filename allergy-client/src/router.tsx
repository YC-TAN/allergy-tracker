/**
 * Uses createBrowserRouter (array config) instead of JSX <Routes> — easier to scan as routes grow.
 *
 * Routes use element only - No loader/action as it will conflict with TanStack Query. 
 * All data fetching stays in TanStack Query hooks to accommodate offline sync.
 */

import { createBrowserRouter } from "react-router-dom";
import Shell from "./components/layout/Shell";
import HomePage from "./pages/HomePage";
import LogPage from "./pages/LogPage";
import TrendsPage from "./pages/TrendsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "log", element: <LogPage /> },
      { path: "log/:date", element: <LogPage /> },
      { path: "trends", element: <TrendsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);