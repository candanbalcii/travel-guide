import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import React from 'react';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { loginSchema } from '../schemas/loginSchema';
import { jwtDecode } from 'jwt-decode';
const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    console.log('Submitting login request...');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful!', data);

        //tokenı local storage kaydoluyor
        localStorage.setItem('token', data.token);

        // token decode ederek userid aldı
        const decodedToken = jwtDecode(data.token);
        const userId = decodedToken.userId;

        localStorage.setItem('user_id', userId);

        console.log('Frotend test Token:', localStorage.getItem('token'));
        console.log('User ID:', localStorage.getItem('user_id'));

        navigate('/home');
      } else {
        const errorData = await response.json();
        setErrors({ email: errorData.message });
        console.error('Login failed:', errorData.message);
      }
    } catch (error) {
      setErrors({ email: 'Login failed due to network error.' });
      console.error('Fetch error:', error);
    }
    setSubmitting(false);
  };

  return (
    <Grid container>
      <Grid
        item
        xs={false}
        sm={6}
        md={7}
        sx={{
          backgroundImage: 'url(/images/plane.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      ></Grid>

      {/* Form  */}
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
        }}
      >
        <Box>
          <Typography variant="h2" gutterBottom>
            Welcome!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Don't have an account yet?{' '}
            <Link
              href="/signup"
              variant="body2"
              sx={{ textDecoration: 'none', color: '#355C7D' }}
            >
              Sign Up
            </Link>
          </Typography>
          <Formik
            initialValues={{ email: '', password: '', keepLoggedIn: false }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
            validateOnChange={true} // Her değişiklikte doğrulama yapılacak
            validateOnBlur={true}
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
                  value={values.password}
                  required
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)} // Hata varsa göster
                  helperText={touched.password && errors.password} // Hata mesajını göster
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
                  <Link href="#" variant="body2" sx={{ color: '#355C7D' }}>
                    Forgot password?
                  </Link>
                </Box>
                <SubmitButton text="Login" disabled={isSubmitting} />
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
