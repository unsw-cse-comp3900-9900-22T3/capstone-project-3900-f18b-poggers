import { Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import authbackground from '../static/images/authbackground.jpeg'
import { Auth } from 'aws-amplify';
import ConfirmEmailModal from '../components/auth/ConfirmEmailModal';
type Props = {}

const Login = (props: Props) => {
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const navigate = useNavigate();

  const displayError = (message: string) => {
    setShowErrorMessage(true);
    setErrorMessage(message);
  }

  const logIn = async (email: string, password: string) => {
    try {
      // successful login
      await Auth.signIn(email, password);
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

  const handleLogIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');

    if (email.length === 0) {
      displayError("The email field cannot be empty.");
      return;
    }

    if (!password) {
      displayError("The password field cannot be empty.");
      return;
    }

    try {
      // attempt to log in
      await logIn(email.toString(), password.toString());
    } catch (e) {
      console.log('error signing in:', e);
      if (e instanceof Error) {
        if (e.name === 'UserNotConfirmedException') {
          setOpen(true);
          return;
        }
        displayError(e.message)
      } else if (typeof e === "string") {
        displayError(e);
      }
      return;
    }

    setShowErrorMessage(false);

  };

  const bgStyles = {
    minHeight: `calc(100vh - 64px)`,
    background: `url(${authbackground}) no-repeat center center fixed`,
    backgroundSize: "cover"
  }

  React.useEffect(() => {
    const checkLoggedIn = async () => {
      console.log("checkIfLoggedIn in Login.tsx called");
      try {
        // TS types are wrong: https://github.com/aws-amplify/amplify-js/issues/4927
        await Auth.currentAuthenticatedUser({
          // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
          bypassCache: false
        })
        // redirect if already logged in
        navigate('/feed');
      } catch (e) {
        // should do nothing if they aren't logged in
      }
    }
    checkLoggedIn()
  }, [navigate])

  return (
    <>
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
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
      <ConfirmEmailModal email={email} open={open} setOpen={setOpen} redirectPage="/feed" />
    </>
  )
}

export default Login