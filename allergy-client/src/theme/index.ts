/**
 * Application theme configuration for MUI.
 *
 * Defines the color palette, typography, component shape, and style overrides
 * used throughout the application. This centralized theme ensures
 * consistent branding, spacing, and interaction styles across Material UI
 * components.
 */

import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-charts/themeAugmentation';

const darkGreen = '#1b5e20'; // green-900
const green = '#2e7d32' // green-800
const lightGreen = '#4caf50'; // green-500

export const theme = createTheme({
  palette: {
    primary: {
      light:        lightGreen, 
      main:         green, 
      dark:         darkGreen, 
      contrastText: '#ffffff',
    },
    secondary: {
      main:         '#f59e0b', // amber — high-pollen warnings
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // severity: bad
    },
    warning: {
      main: '#f59e0b',
    },
    success: {
      main: green,
    },
    background: {
      default: '#f8faf8', // surface2
      paper:   '#ffffff',
    },
    text: {
      primary:   '#1a2e1a',
      secondary: '#4a6741',
      disabled:  '#7a9e77',
    },
    divider: '#e2ece2',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h4: {
      fontFamily:  '"DM Serif Display", serif',
      fontWeight:  400,
      color:       darkGreen,
    },
    h5: {
      fontFamily:  '"DM Serif Display", serif',
      fontWeight:  400,
      color:       darkGreen,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontSize:   '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize:   '0.875rem',
      lineHeight: 1.55,
      color:      '#4a6741',
    },
    caption: {
      fontSize: '0.75rem',
      color:    '#7a9e77',
    },
    button: {
      textTransform: 'none',
      fontWeight:    500,
      fontSize:      '0.9375rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius:  12,
          padding:       '12px 20px',
          boxShadow:     'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth:     '1.5px',
            backgroundColor: '#f0f7f0',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border:       '0.5px solid #e2ece2',
          boxShadow:    '0 2px 8px rgba(46,125,50,0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight:   400,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiChartsAxis: {
      styleOverrides: {
        root: {
          '& .MuiChartsAxis-tick': {
            stroke: darkGreen,
          },
        },
      },
    },
  },
})