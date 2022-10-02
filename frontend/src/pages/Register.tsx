import { Box, Button, Checkbox, Container, createTheme, CssBaseline, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import authbackground from '../static/images/authbackground.jpeg'

type Props = {}

const Register = (props: Props) => {
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const displayError = (message: string) => {
    setShowErrorMessage(true);
    setErrorMessage(message);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      email: formData.get('email'),
      username: formData.get('username'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirm-password')
    }
    console.log(data);


    if (!data.email) {
      displayError("The email field cannot be empty.");
      return;
    }

    if (!data.username) {
      displayError("The username field cannot be empty.");
      return;
    }

    if (!data.password || !data.confirmPassword) {
      displayError("The password fields cannot be empty.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      displayError("Passwords do not match");
      return;
    }

    setShowErrorMessage(false);

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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Typography color="error" variant="body1" sx={{ marginTop: 1, display: `${showErrorMessage ? "block" : "none"}` }}>
            Error: {errorMessage}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>

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
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              autoComplete="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="secondary"
            >
              Register
            </Button>
            <Grid container>
              <Grid item>
                <Typography sx={{ display: "inline", mr: 1 }} variant="subtitle1">
                  Already registered?
                </Typography>
                <Link to="/login">
                  {"Log In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Grid>
  )
}

export default Register