import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';

const AboutUs = () => {
  return (
    <Box
      sx={{
        backgroundImage:
          'linear-gradient(to right, #FF7F50, #00BFFF), url(/images/about_us.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        minHeight: '100vh',
        padding: '40px 0',
        position: 'relative',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Başlık */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            color: '#FF7F50',
            textAlign: 'center',
            marginBottom: '40px',
            fontFamily: '"Pacifico", cursive',
          }}
        >
          About Us
        </Typography>

        {/* İçerik */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                animation: 'slideIn 0.8s ease-out',
                '@keyframes slideIn': {
                  '0%': {
                    transform: 'translateX(-100%)',
                    opacity: 0,
                  },
                  '100%': {
                    transform: 'translateX(0)',
                    opacity: 1,
                  },
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#FF7F50',
                  marginBottom: '20px',
                  fontSize: '28px',
                  fontFamily: '"Roboto Condensed", sans-serif',
                }}
              >
                Purpose of the Platform
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#333',
                  lineHeight: '1.8',
                  fontSize: '18px',
                  fontFamily: '"Roboto", sans-serif',
                }}
              >
                We provide a platform for travelers to share their experiences,
                create travel albums, and leave comments on tourist attractions.
                Our goal is to inspire travelers and help them plan their trips
                more effectively by learning from others' experiences.
              </Typography>
            </Box>
          </Grid>

          {/* How It Works */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                animation: 'slideIn 0.8s ease-out 0.2s',
                '@keyframes slideIn': {
                  '0%': {
                    transform: 'translateX(100%)',
                    opacity: 0,
                  },
                  '100%': {
                    transform: 'translateX(0)',
                    opacity: 1,
                  },
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#00BFFF',
                  marginBottom: '20px',
                  fontSize: '28px',
                  fontFamily: '"Roboto Condensed", sans-serif',
                }}
              >
                How It Works
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#333',
                  lineHeight: '1.8',
                  fontSize: '18px',
                  fontFamily: '"Roboto", sans-serif',
                }}
              >
                1. Create travel albums and share your photos.
                <br />
                2. Leave comments and rate tourist attractions.
                <br />
                3. Explore other travelers' albums and get inspired.
                <br />
                4. Get insights on budget and time for your trips.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            textAlign: 'center',
            marginTop: '40px',
          }}
        ></Box>
      </Container>
    </Box>
  );
};

export default AboutUs;
