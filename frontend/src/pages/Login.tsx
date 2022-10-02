import { Box, Button, Checkbox, Container, createTheme, CssBaseline, FormControlLabel, Grid, TextField, ThemeProvider, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';
import useAppBarHeight from '../util/useAppBarHeight';
import authbackground from '../static/images/authbackground.jpeg'

type Props = {}
const customTheme = createTheme({
  palette: {
    primary: {
      light: '#4f5b62',
      main: '#263238',
      dark: '#000a12',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#6f74dd',
      main: '#3949ab',
      dark: '#00227b',
      contrastText: '#ffffff',
    },
  },
});
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
    minHeight: `calc(100vh - ${useAppBarHeight()}px`,
    background: `url(${authbackground}) no-repeat center center fixed`,
    backgroundSize: "cover"
  }

  return (
    <ThemeProvider theme={customTheme}>
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
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                color="secondary"
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Typography sx={{ display: "inline", mr: 1 }} variant="subtitle1">
                    Not registered?
                  </Typography>
                  <Link to="/auth">
                    {"Create an Account"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Grid>
    </ThemeProvider>
  )
}

export default Login