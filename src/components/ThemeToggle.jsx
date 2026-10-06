import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const ThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <Tooltip title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}>
      <IconButton
        onClick={onToggle}
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 