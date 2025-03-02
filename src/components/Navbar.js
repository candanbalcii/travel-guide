import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const isLoggedIn = localStorage.getItem('token');

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Logout işlemi
  const handleLogout = () => {
    localStorage.removeItem('token');
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      console.log('Token silindi');
    } else {
      console.error('Token silinemedi!');
    }
    handleProfileMenuClose();
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(to right, #FF7F50, #00BFFF)',
        fontWeight: 'bold',
        padding: '0 2rem',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/images/tglogo.png"
            alt="Logo"
            style={{
              height: '50px',
              width: 'auto',
              marginRight: '20px',
              cursor: 'pointer',
            }}
            onClick={handleLogoClick}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            color="inherit"
            component={Link}
            to="/home"
            sx={{
              marginRight: '20px',
              '&:hover': {
                backgroundColor: '#00BFFF',
                transform: 'scale(1.1)',
              },
              transition: 'transform 0.2s',
            }}
          >
            Home
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/albums"
            sx={{
              marginRight: '20px',
              '&:hover': {
                backgroundColor: '#00BFFF',
                transform: 'scale(1.1)',
              },
              transition: 'transform 0.2s',
            }}
          >
            Trip Albums
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/about-us"
            sx={{
              marginRight: '20px',
              '&:hover': {
                backgroundColor: '#00BFFF',
                transform: 'scale(1.1)',
              },
              transition: 'transform 0.2s',
            }}
          >
            About Us
          </Button>

          {!isLoggedIn ? (
            <></>
          ) : (
            <>
              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                <Avatar
                  src="/path-to-avatar.jpg"
                  alt="Profile"
                  sx={{
                    width: 40,
                    height: 40,
                    '&:hover': { transform: 'scale(1.1)' },
                    transition: 'transform 0.2s',
                  }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem
                  component={Link}
                  to="/profile/:userId"
                  onClick={handleProfileMenuClose}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#00BFFF',
                      transform: 'scale(1.05)',
                    },
                    transition: 'transform 0.2s',
                  }}
                >
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#00BFFF',
                      transform: 'scale(1.05)',
                    },
                    transition: 'transform 0.2s',
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
