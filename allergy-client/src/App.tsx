/**
 * Wraps the entire app in:
 *   ThemeProvider  — applies the forest green MUI theme
 *   CssBaseline    — MUI's normalise styles (replaces Tailwind preflight)
 */

import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/index.ts';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          maxWidth:        390,
          margin:          '0 auto',
          minHeight:       '100dvh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <h1>Test</h1>
      </div>
    </ThemeProvider>
  )
}