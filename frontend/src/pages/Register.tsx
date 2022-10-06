import { Box, Button, Container, CssBaseline, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom';
import authbackground from '../static/images/authbackground.jpeg'
import { Auth } from 'aws-amplify';
import ConfirmEmailModal from '../components/auth/ConfirmEmailModal';

type Props = {}

const Register = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [email, setEmail] = React.useState("");

  const displayError = (message: string) => {
    setShowErrorMessage(true);
    setErrorMessage(message);
  }

  const signUp = async (username: string, password: string, email: string) => {
    try {
      const { user } = await Auth.signUp({
        'username': email,
        'password': password,
        attributes: {
          'email': email,
          'custom:displayName': username
        },
        autoSignIn: { // optional - enables auto sign in after user is confirmed
          enabled: false,
        }
      });
      console.log("successful signup");
      console.log(user);
    } catch (e) {
      console.log('error signing up:', e);
      if (typeof e === "string") {
        displayError(e);
      } else if (e instanceof Error) {
        displayError(e.message)
      }
      throw e;
    }
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const username = formData.get('username');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    console.log("Form Data: " + email + ' ' + username + ' ' + password + ' ' + confirmPassword)

    if (email.length === 0) {
      displayError("The email field cannot be empty.");
      return;
    }

    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (!emailRegex.test(email)) {
      displayError("Invalid email address format.");
      return;
    }

    if (!username) {
      displayError("The username field cannot be empty.");
      return;
    }

    if (!password || !confirmPassword) {
      displayError("The password fields cannot be empty.");
      return;
    }

    if (password !== confirmPassword) {
      displayError("Passwords do not match");
      return;
    }

    try {
      await signUp(username.toString(), password.toString(), email.toString());
    } catch (e) {
      console.log("an unexpected error has occured: ", e);
      if (typeof e === "string") {
        displayError(e);
        return;
      } else if (e instanceof Error) {
        displayError(e.message);
        return;
      }
      return;
    }


    // remove error msg
    setShowErrorMessage(false);

    // open confirmation modal
    setOpen(true);
  };

  const bgStyles = {
    minHeight: `calc(100vh - 64px)`,
    background: `url(${authbackground}) no-repeat center center fixed`,
    backgroundSize: "cover"
  }

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
              Register
            </Typography>
            <Typography color="error" variant="body1" sx={{ marginTop: 1, display: `${showErrorMessage ? "block" : "none"}` }}>
              {errorMessage}
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
                onChange={(e) => setEmail(e.target.value)}
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
      <ConfirmEmailModal email={email} open={open} setOpen={setOpen} redirectPage="/login" />
    </>
  )
}

export default Register