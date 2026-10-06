// Create a new theme file: src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff9d', // Neon green
      light: '#33ffb1',
      dark: '#00cc7d',
    },
    secondary: {
      main: '#00b8ff', // Neon blue
      light: '#33c6ff',
      dark: '#0093cc',
    },
    background: {
      default: '#0a0a0f', // Dark background
      paper: '#1a1a2e', // Slightly lighter dark
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    error: {
      main: '#ff0055', // Neon pink
    },
    warning: {
      main: '#ffd700', // Neon yellow
    },
    info: {
      main: '#00ffff', // Cyan
    },
    success: {
      main: '#00ff9d', // Neon green
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      color: '#00ff9d',
      textShadow: '0 0 10px rgba(0, 255, 157, 0.5)',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#00b8ff',
      textShadow: '0 0 8px rgba(0, 184, 255, 0.5)',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#00ffff',
      textShadow: '0 0 6px rgba(0, 255, 255, 0.5)',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#ffffff',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
      color: '#b3b3b3',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#808080',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: '0 0 15px rgba(0, 255, 157, 0.1)',
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 157, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          padding: '0.75rem 1.5rem',
          fontWeight: 600,
          boxShadow: '0 0 10px rgba(0, 255, 157, 0.2)',
          border: '1px solid rgba(0, 255, 157, 0.3)',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 255, 157, 0.4)',
            background: 'rgba(0, 255, 157, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: '0 0 15px rgba(0, 255, 157, 0.1)',
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 157, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 0 20px rgba(0, 255, 157, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 255, 157, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 255, 157, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00ff9d',
              boxShadow: '0 0 10px rgba(0, 255, 157, 0.2)',
            },
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