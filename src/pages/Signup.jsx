import {
  Grid,
  TextField,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import SubmitButton from '../components/SubmitButton';
import { signupSchema } from '../schemas/signupSchema';
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          role: values.role,
          company_name: values.company_name,
        }),
      });

      if (response.ok) {
        const data = await response.json(); // Sunucudan dönen veriyi al

        console.log('Signup successful!');
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/success'); // Örnek yönlendirme
      } else {
        console.error('Error during signup');
        setError('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setSubmitting(false);
    }
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

        <Formik
          initialValues={{
            email: '',
            password: '',
            role: 'tester',
            company_name: '',
          }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form>
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

              {values.role === 'owner' && (
                <TextField
                  label="Company Name"
                  name="company_name"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={values.company_name}
                  onChange={handleChange}
                  error={touched.company_name && Boolean(errors.company_name)}
                  helperText={touched.company_name && errors.company_name}
                  required
                />
              )}
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
              <SubmitButton text="Sign In" disabled={isSubmitting} />
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
          backgroundImage: 'url(/images/kayıt.jpg  )',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      />
    </Grid>
  );
};

export default Signup;
