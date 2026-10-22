/**
 * Wraps the entire app in:
 *   ThemeProvider  — applies the forest green MUI theme
 *   CssBaseline    — MUI's normalise styles
 *
 * RouterProvider:
 *   Move routing config outside render tree into a plain object.
 *
 * UI library Usage:
 *   - MUI  → component-level styling (sx prop, styled())
 *   - Tailwind classes  → layout and spacing only (flex, gap-4, mt-6, w-full)
 *   - Never use Tailwind to restyle MUI component internals
 *
 * Root container constrained for typical phone widths.
 */

import { ThemeProvider, CssBaseline, Typography } from "@mui/material";
import { RouterProvider } from "react-router-dom";

import theme from "./theme/index";
import { router } from "./router";
import NotificationSnackbar from "./components/ui/NotificationSnackbar";
import StartupError from "./components/layout/StartupError";
import { useInitializeStorage } from "./hooks/useInitializedStorage";
import { useUser } from "./stores/useAuthStore";
import { useSync } from "./hooks/useSync";
import { AuthListener } from "./components/layout/AuthListener";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppGate />
    </ThemeProvider>
  );
};

const AppGate = () => {
  const { isReady, error } = useInitializeStorage();

  if (error) {
    return (
      <StartupError />
    );
  }

  if (!isReady) {
    return <Typography className="p-6">Loading local data...</Typography>;
  }

  return <InitializedApp />;
};

const InitializedApp = () => {
  const userId = useUser()?.id;
  useSync(userId);

  return (
    <>
      <AuthListener />
      <RouterProvider router={router} />
      <NotificationSnackbar />
    </>
  );
};

export default App;
