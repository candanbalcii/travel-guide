import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    //tokenı sil
    localStorage.removeItem('token');

    // Kullanıcıyı login sayfasına yönlendir
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4682B4' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">TravelGuide</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button color="black" component={Link} to="/">
            Home
          </Button>

          {!isLoggedIn ? (
            <>
              <Button color="black" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
