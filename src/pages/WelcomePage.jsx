import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isMoreInfoVisible, setIsMoreInfoVisible] = useState(false);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLearnMore = () => {
    setIsMoreInfoVisible(!isMoreInfoVisible);
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
        color: 'black',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        padding: 5,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/welcome.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
          zIndex: -1,
        },
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to TravelGuide!
      </Typography>
      <Typography variant="h4" gutterBottom>
        Discover the world, one destination at a time. Plan your adventures,
        explore hidden gems, and create unforgettable memories!
      </Typography>
      <Box
        sx={{
          marginTop: 4,
          maxWidth: '800px', // yazının genişliğini sınırlayın
          textAlign: 'left', //yazının sola hizalanmasını sağlar
        }}
      >
        <Typography variant="body1" paragraph gutterBottom>
          Our platform offers a comprehensive suite of tools designed to help
          you gather valuable user feedback and conduct usability testing with
          ease. Whether you're developing a new travel application or enhancing
          an existing one, TravelGuide provides a collaborative environment that
          ensures efficient testing and insightful feedback from real travelers.
          Plan, explore, and improve your travel experiences with confidence
          using TravelGuide!
        </Typography>
      </Box>
      {isMoreInfoVisible && (
        <Box
          sx={{
            maxWidth: '800px', // İsteğe bağlı: Yazının genişliğini sınırlayın
            textAlign: 'left', // Yazının sola hizalanmasını sağlar
          }}
        >
          TravelGuide is your ultimate companion for exploring the world with
          ease and excitement. Whether you're planning your next vacation,
          discovering hidden gems, or dreaming of far-off destinations, our
          platform is here to inspire and guide you every step of the way.
        </Box>
      )}
      <Box sx={{ marginTop: 4 }}>
        <Button variant="outlined" color="black" onClick={handleLearnMore}>
          {isMoreInfoVisible ? 'Show Less' : 'Learn More'}
        </Button>
      </Box>
    </Box>
  );
};

export default WelcomePage;
