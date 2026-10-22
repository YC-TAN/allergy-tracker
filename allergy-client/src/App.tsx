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

import { ThemeProvider, CssBaseline } from "@mui/material";
import { RouterProvider } from "react-router-dom";

import theme from "./theme/index";
import { router } from "./router";
import NotificationSnackbar from "./components/ui/NotificationSnackbar";
import { useInitializeStorage } from "./hooks/useInitializedStorage";
import { useUser } from "./stores/useAuthStore";
import { useSync } from "./hooks/useSync";
import { AuthListener } from "./components/layout/AuthListener";

export default function App() {
  const { isReady, error } = useInitializeStorage();

  if (error) {
    return <p>Unable to load local data.</p>;
  }

  if (!isReady) {
    return <p>Loading local data...</p>;
  }

  return <InitializedApp />;
}

const InitializedApp = () => {
  const userId = useUser()?.id;
  useSync(userId);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthListener />
      <RouterProvider router={router} />
      <NotificationSnackbar />
    </ThemeProvider>
  );
}
