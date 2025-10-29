import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundImage: 'url(/images/mainpage-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      {/* Logo and Line Section */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        {/* Logo */}
        <img
          src="/images/jdlp-logo.png"
          alt="JDLP Logo"
          style={{
            height: '80px',
            width: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            backgroundColor: 'transparent',
            marginBottom: '10px',
          }}
        />

        {/* Gradient Line */}
        <Box
          sx={{
            width: '1000px',
            height: '2px',
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))',
            borderRadius: '1px',
            mb: 3,
          }}
        />

        {/* Text and Button Container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '1000px',
            ml: 10,
          }}
        >
          {/* Text Section */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                letterSpacing: '1px',
                lineHeight: 1.2,
                mb: 1,
                mr: 30,
                textShadow: '2px 2px 5px rgba(0,0,0,0.5)',
              }}
            >
              Welcome to Barangay<br />
              Jesus Dela Peña<br />
              Information System
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 400,
                letterSpacing: '0.5px',
                mb: 4,
                mr: 30,
                textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
              }}
            >
              Enhancing Local Governance Through Digital Information Management
            </Typography>

            {/* Get Started Button */}
            <Button
              variant="contained"
              onClick={handleGetStarted}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#1a1a1a',
                fontWeight: 'bold',
                px: 5,
                py: 1.8,
                borderRadius: '30px',
                textTransform: 'none',
                fontSize: '1.1rem',
                mr: 30,
                transition: '0.3s',
                '&:hover': {
                  backgroundColor: 'white',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
