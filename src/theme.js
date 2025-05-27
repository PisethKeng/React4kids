// Create a new theme file: src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Deep blue
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#10b981', // Mint green
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f8fafc', // Light gray
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // Dark gray
      secondary: '#64748b', // Medium gray
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#1e293b',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1e293b',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#1e293b',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1e293b',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
      color: '#475569',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#64748b',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '0.75rem 1.5rem',
          fontWeight: 600,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
  spacing: 4,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;