import { createTheme } from '@mui/material/styles';

const orangeTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B35', // Vibrant orange
      light: '#FF9B45',
      dark: '#E55A2B',
    },
    secondary: {
      main: '#2D3142', // Dark slate
      light: '#4FF9B45',
      dark: '#1A1C25',
    },
    background: {
      default: '#0065F8',
      paper: '#F7F7F7',
    },
    text: {
      primary: '#2D3142',
      secondary: '#4F546C',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#2D3142',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2D3142',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#2D3142',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#2D3142',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
      color: '#4F546C',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#4F546C',
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
});

export default orangeTheme; 