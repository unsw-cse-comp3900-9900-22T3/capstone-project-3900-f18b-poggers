import { Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import authbackground from '../static/images/authbackground.jpeg'
import { currentAuthenticatedUser } from '../util/currentAuthenticatedUser';

type Props = {}

const bgStyles = {
  minHeight: `calc(100vh - 64px)`,
  background: `url(${authbackground}) no-repeat center center fixed`,
  backgroundSize: "cover"
}

const Login = (props: Props) => {
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [username, setUsername] = React.useState("");
  const navigate = useNavigate();

  /**
   * Sets error message in state to be displayed
   *
   * @param message error message to be displayed
   */
  const displayError = (message: string) => {
    setShowErrorMessage(true);
    setErrorMessage(message);
  }

  /**
   * Provides session JWT for user in localStorage and redirects to /feed
   *
   * @param password user inputted password
   */
  const logIn = async (password: string) => {
    try {
      const body = {
        query: `
          query {
            login(username: "${username}", password: "${password}") {
              token
            }
          }
        `
      }

      const res = await fetch('http://localhost:3000/graphql', {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }

      // successful login
      // store jwt in localStorage (NOT SECURE)
      localStorage.setItem('token', apiData.data.login.token);

      navigate('/feed')
    } catch (e) {
      console.log('error signing in:', e);
      if (typeof e === "string") {
        displayError(e);
      } else if (e instanceof Error) {
        displayError(e.message)
      }
      throw e;
    }
  }

  /**
   * Validates user inputs and attempts to log in
   *
   * @param event react event
   */
  const handleLogIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');

    if (username.length === 0) {
      displayError("The email field cannot be empty.");
      return;
    }

    if (!password) {
      displayError("The password field cannot be empty.");
      return;
    }

    try {
      // attempt to log in
      await logIn(password.toString());
    } catch (e) {
      console.log('error signing in:', e);
      if (e instanceof Error) {
        displayError(e.message)
      } else if (typeof e === "string") {
        displayError(e);
      }
      return;
    }

    setShowErrorMessage(false);

  };


  React.useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        await currentAuthenticatedUser();
        // redirect if already logged in
        navigate('/feed');
      } catch (e) {
        // should do nothing if they aren't logged in
      }
    }
    checkIfLoggedIn()
  }, [navigate])

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
            Log In
          </Typography>
          <Typography color="error" variant="body1" sx={{ marginTop: 1, display: `${showErrorMessage ? "block" : "none"}` }}>
            {errorMessage}
          </Typography>
          <Box component="form" onSubmit={handleLogIn} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete=" password"
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