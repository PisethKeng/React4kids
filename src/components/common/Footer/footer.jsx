import React from 'react';
import { Box, Container, Typography, Stack, IconButton, Paper } from '@mui/material';
import { Facebook, Twitter, LinkedIn, GitHub } from '@mui/icons-material';

const Footer = () => {
  const socialLinks = [
    { icon: <Facebook />, url: 'https://www.facebook.com' },
    { icon: <Twitter />, url: 'https://x.com/PisethKeng' },
    { icon: <LinkedIn />, url: 'https://www.linkedin.com/feed/' },
    { icon: <GitHub />, url: 'https://github.com/PisethKeng' },
  ];

  return (
    <Box component="footer" sx={{ 
      bgcolor: '#1a1a1a',
      color: '#ffffff',
      py: 6,
      mt: 'auto',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={0}
          sx={{
            bgcolor: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            py: 4,
            px: 2
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: '1.25rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              Keng Piseth
            </Typography>
            <Stack direction="row" spacing={2}>
              {socialLinks.map((link, index) => (
                <IconButton 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: '#ffffff',
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    },
                    fontSize: '1.25rem'
                  }}
                >
                  {link.icon}
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Footer;