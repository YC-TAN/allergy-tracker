/**
 * Application entry point — mounts the React app into the DOM.
 *
 * Sets up global providers (React Query, MUI styling) and renders `App`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";

import { seedMockEntries } from './utils/seedData'
if (import.meta.env.DEV) {
  seedMockEntries()
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <App />
      </StyledEngineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
