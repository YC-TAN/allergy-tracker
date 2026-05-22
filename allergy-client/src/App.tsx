/**
 * Wraps the entire app in:
 *   ThemeProvider  — applies the forest green MUI theme
 *   CssBaseline    — MUI's normalise styles
 *
 * UI library Usage:
 *   - MUI  → component-level styling (sx prop, styled())
 *   - Tailwind classes  → layout and spacing only (flex, gap-4, mt-6, w-full)
 *   - Never use Tailwind to restyle MUI component internals
 *
 * Root container constrained for typical phone widths.
 */

import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { theme } from "./theme/index";
import HomePage from "./pages/HomePage";
import TrendsPage from "./pages/TrendsPage";
import NotFoundPage from "./pages/NotFoundPage";
import SettingsPage from "./pages/SettingsPage";
import Shell from "./components/layout/Shell";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Router>
          <Routes>
            <Route element={<Shell />}>
              <Route index element={<HomePage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
    </ThemeProvider>
  );
}
