import {
  Grid,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubmitButton from '../components/SubmitButton';

const Signup = () => {
  const [role, setRole] = useState('tester'); // Kullanıcının rolü
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role,
          company_name: companyName,
        }),
      });

      if (response.ok) {
        console.log('Signup successful!');
        // Kullanıcıyı yönlendirin veya başka işlemler yapın
      } else {
        console.error('Error during signup');
      }
    } catch (error) {
      console.error('An error occurred:', error);
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
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              onChange={handleRoleChange}
              required
            >
              <MenuItem value="tester">Tester</MenuItem>
              <MenuItem value="owner">Software Owner</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            margin="normal"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {role === 'owner' && (
            <TextField
              label="Company Name"
              variant="outlined"
              margin="normal"
              fullWidth
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          )}

          {error && (
            <Typography color="error" variant="body2" margin="normal">
              {error}
            </Typography>
          )}

          <SubmitButton text="Sign In" />
        </form>
      </Grid>

      {/* Sağdaki resim kısmı */}
      <Grid
        item
        xs={false}
        sm={6}
        md={7}
        sx={{
          backgroundImage: 'url(/images/signup.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      />
    </Grid>
  );
};

export default Signup;
