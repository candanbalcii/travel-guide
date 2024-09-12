import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';

import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../schemas/loginSchema';

const Login = () => {
  //stateleri tutmak için usestate
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState('');

  //form submit için fonksiyon
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('Submitting login request...');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful!', data);
        localStorage.setItem('token', data.token);

        if (data.user.role === 'tester') {
          navigate('/tester-dashboard');
        } else if (data.user.role === 'owner') {
          navigate('/owner-dashboard');
        }
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message);
        setError(errorData.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <Grid container>
      <Grid
        item
        xs={false}
        sm={6}
        md={7}
        sx={{
          backgroundImage: 'url(/images/preview.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      ></Grid>

      {/*Form section*/}
      <Grid
        item
        xs={12}
        sm={7}
        md={5}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
          backgroundColor: 'white',
        }}
      >
        <Box>
          <Typography variant="h2" gutterBottom>
            Welcome!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Don't have an account yet?{'  '}
            <Link
              href="/signup"
              variant="body2"
              sx={{ textDecoration: 'none', color: '#F4A261' }}
            >
              Sign Up
            </Link>
          </Typography>

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></FormInput>
            <FormInput
              label="Password"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            ></FormInput>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    color="primary"
                  />
                }
                label="Keep me logged in"
              ></FormControlLabel>
              <Link href="#" variant="body2" sx={{ color: '#F4A261' }}>
                Forgot password?
              </Link>
            </Box>
            <SubmitButton text="Login" />
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
