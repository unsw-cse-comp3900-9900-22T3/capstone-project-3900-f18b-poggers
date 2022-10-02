import { Box, Button, Checkbox, Container, createTheme, CssBaseline, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import authbackground from '../static/images/authbackground.jpeg'

type Props = {}

const Login = (props: Props) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const bgStyles = {
    minHeight: `calc(100vh - 64px)`,
    background: `url(${authbackground}) no-repeat center center fixed`,
    backgroundSize: "cover"
  }
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={bgStyles}
    >
      <Container component="main" maxWidth="sm" sx={{ border: "1px solid", borderRadius: 2, padding: 2, backgroundColor: 'white' }}>
        <CssBaseline />
        <Box
          sx={{
            // marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="secondary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="secondary"
            >
              Log In
            </Button>
            <Grid container>
              <Grid item>
                <Typography sx={{ display: "inline", mr: 1 }} variant="subtitle1">
                  Not registered?
                </Typography>
                <Link to="/register">
                  {"Create an Account"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Grid>
  )
}

export default Login