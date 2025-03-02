import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        color: 'white',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        padding: 5,
        overflow: 'hidden',
        backgroundImage:
          'url(/images/background.png), linear-gradient(to right, #FF7F50, #00BFFF)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 38%',
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        sx={{ fontWeight: 'bold', letterSpacing: 1, marginBottom: '16px' }}
      >
        Welcome to TravelGuide!
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: '300',
          maxWidth: '500px',
          lineHeight: 1.6,
          marginBottom: '24px',
        }}
        gutterBottom
      >
        Discover breathtaking destinations, plan unforgettable adventures, and
        explore the world with ease.
      </Typography>

      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'white',
            color: '#FF7F50',
            fontWeight: 'bold',
            padding: '0.7rem 1.5rem',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
          onClick={handleSignup}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default WelcomePage;
