import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const isLoggedIn = localStorage.getItem('token');

  // Menu'yu açma
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Menu'yu kapama
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
    handleProfileMenuClose(); // Menü kapanması
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
            <>
              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={handleProfileMenuClose}
                >
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
