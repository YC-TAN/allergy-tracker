/**
 * Application theme configuration for MUI.
 *
 * Defines the color palette, typography, component shape, 
 * and style overrides for MUI components. 
 * 
 * Goal: To ensure consistent branding, spacing, and interaction styles.
 */

import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-charts/themeAugmentation";
import { green, lightGreen, yellow, red, orange } from "@mui/material/colors";

declare module "@mui/material/styles" {
  // Palette defines what is available on the theme object when accessing theme.palette
  // Add neutral and severity colors to the theme.palette
  interface Palette {
    neutral?: Palette["primary"];
    severityBorder?: {
      noSymptom: string;
      mild: string;
      moderate: string;
      severe: string;
    };
    severityBg?: {
      noSymptom: string;
      mild: string;
      moderate: string;
      severe: string;
    };
    severity?: {
      noSymptom: string;
      mild: string;
      moderate: string;
      severe: string;
    };
  }

  // PaletteOptions defines what you are allowed to pass into createTheme({ palette: { ... } })
  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
    severityBorder?: {
      noSymptom: string;
      mild: string;
      moderate: string;
      severe: string;
    };
    severityBg?: {
      noSymptom: string;
      mild: string;
      moderate: string;
      severe: string;
    };
    severity?: {
      noSymptom: string;
      mild: string;
      moderate: string;
      severe: string;
    };
  }

  // Add additional text color to palette
  interface TypeText {
    tertiary?: string;
    hint?: string;
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: green[800], // #2e7d32
      // light, dark and contrastText will be calculated from palette.primary.main
    },
    tonalOffset: {
      light: 0.8,
      dark: 0.2,
    },
    secondary: {
      main: "#7d2e79",
      contrastText: "#ffffff",
    },
    // error: {
    //   main: '#ef4444',
    // },
    // warning: {
    //   main: '#f59e0b',
    // },
    // info: {},
    // success: {
    //   main: '#f0f7f0',
    // },
    severity: {
      noSymptom: lightGreen[400], //#9ccc65
      mild: yellow[400],
      moderate: orange[400],
      severe: red[400],
    },
    severityBorder: {
      noSymptom: lightGreen[800],
      mild: yellow[800],
      moderate: orange[800],
      severe: red[800],
    },
    severityBg: {
      noSymptom: lightGreen[50],
      mild: yellow[50],
      moderate: orange[50],
      severe: red[50],
    },
    // surface: {}, // surfaces of components, such as cards, sheets, and menus.
    background: {
      // behind scrollable content
      default: "#f8faf8", // Light grayish lime green
      paper: "#ffffff",
    },
    text: {
      primary: "#1a2e1a", // Deep forest Charcoal Green
      secondary: "#4a6741",
      disabled: "#7a9e77",
    },
    divider: "#e2ece2", // light-greyish green
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h4: {
      // fontFamily:  '"DM Serif Display", serif',
      // fontWeight:  400,
    },
    h5: {
      // fontFamily:  '"DM Serif Display", serif',
      fontWeight: 600,
    },
    h6: {
      // fontFamily:  '"DM Serif Display", serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 600,
      // textTransform: "uppercase",
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      // textTransform: "uppercase",
    },
    body1: {
      // fontSize:   '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.55,
    },
    caption: {
      fontSize: "0.875rem",
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    },
    // overline: {},
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.9375rem",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,   // Tailwind's default 'sm'
      md: 768,   // Tailwind's default 'md'
      lg: 1024,  // Tailwind's default 'lg'
      xl: 1280,  // Tailwind's default 'xl'
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "12px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
            backgroundColor: "#f0f7f0",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "0.5px solid #e2ece2",
          boxShadow: "0 2px 8px rgba(46,125,50,0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 400,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "& fieldset": {
              borderColor: theme.palette.divider,
            },
          },
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiChartsAxis: {
      styleOverrides: {
        root: {
          "& .MuiChartsAxis-tick": {
            stroke: green[900],
          },
        },
      },
    },
  },
});

export default theme;
