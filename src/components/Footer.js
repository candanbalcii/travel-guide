import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#333',
        color: 'white',
        padding: '2rem 0',
        position: 'fixed', // Footer'ı sabitle
        bottom: 0, // En alta yapıştır
        left: 0, // Sola yapıştır
        zIndex: 1000, // Diğer içeriklerin üzerinde olmasını sağla
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" gutterBottom>
        &copy; 2025 TravelGuide. All rights reserved.
      </Typography>
      <Box>
        <Link href="#" color="inherit" sx={{ margin: '0 1rem' }}>
          Privacy Policy
        </Link>
        <Link href="#" color="inherit" sx={{ margin: '0 1rem' }}>
          Terms of Service
        </Link>
        <Link href="#" color="inherit" sx={{ margin: '0 1rem' }}>
          Contact Us
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
