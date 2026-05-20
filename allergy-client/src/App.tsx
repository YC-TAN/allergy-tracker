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

import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/index.ts';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          maxWidth:        390, // common mobile screen widths
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