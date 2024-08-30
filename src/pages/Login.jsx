import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const Login = () => {
  //stateleri tutmak için usestate
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState('');

  //form submit için fonksyon
  const handleSubmit = (event) => {
    event.preventDefault(); //form verilerini işleyip doğrulayabilek için varsayılan davranışları engelliyor
    console.log('Form submitted');
  };

  return (
    <Grid container>
      {/*Dönen küre olacak solda*/}
      <Grid
        item
        xs={false}
        sm={6}
        md={7}
        sx={{
          backgroundImage: 'url(/images/test.png)',
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
          flexDirectionn: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 25,
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit} />
          <TextField
            sx={{ width: '500px' }}
            label="Email"
            variant="filled"
            fullWidth
            margin="normal"
            value={email} //input değerini emaile bağlıyor
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>
          <TextField
            label="Password"
            variant="filled"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)} //kullanıcı her yeni değer girdiğinde o değer 'password' stateinde güncellenir
          ></TextField>
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
