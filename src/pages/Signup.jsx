import {
  Grid,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import SubmitButton from '../components/SubmitButton';
import { signupSchema } from '../schemas/signupSchema'; // Şemayı buradan alıyoruz
import FormInput from '../components/FormInput';

const Signup = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    console.log('Submitting signup request...');

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const data = await response.json();
      console.log('Signup successful:', data);

      navigate('/login');
    } catch (error) {
      console.error('Error during signup:', error);
      setError('An error occurred while signing up. Please try again.');
    }

    setSubmitting(false);
  };

  return (
    <Grid container>
      {/* Formun olduğu kısım */}
      <Grid
        item
        xs={12}
        sm={6}
        md={5}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Get Started With Us
        </Typography>
        <Typography>
          Already have an account?{' '}
          <Link
            href="/login"
            variant="body2"
            sx={{ textDecoration: 'none', color: '#355C7D' }}
          >
            Login
          </Link>
        </Typography>

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            keepLoggedIn: false,
          }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form>
              <FormInput
                label="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
              <FormInput
                label="Last Name"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
              <FormInput
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <FormInput
                label="Password"
                name="password"
                type="password"
                fullWidth
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

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
                      name="keepLoggedIn"
                      checked={values.keepLoggedIn}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Keep me logged in"
                />
              </Box>
              {error && (
                <Typography color="error" variant="body2" margin="normal">
                  {error}
                </Typography>
              )}
              <SubmitButton text="Sign Up" disabled={isSubmitting} />
            </Form>
          )}
        </Formik>
      </Grid>

      {/* Sağdaki resim kısmı */}
      <Grid
        item
        xs={false}
        sm={6}
        md={7}
        sx={{
          backgroundImage: 'url(/images/kayıt.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      />
    </Grid>
  );
};

export default Signup;
