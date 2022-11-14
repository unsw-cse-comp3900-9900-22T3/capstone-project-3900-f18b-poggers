import { Box, Button, Container, CssBaseline, Grid, TextField, Typography } from '@mui/material'
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

const Register = (props: Props) => {
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
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
   * Registers new user and redirects to login page given form data
   *
   * @param username user inputted username
   * @param password user inputted password
   * @param email user inputted email
   */
  const signUp = async (username: string, password: string, email: string) => {
    try {
      const body = {
        query: `
          mutation {
            createUser(userInput: {
              email: "${email}",
              username: "${username}",
              password: "${password}"
            }) {
              _id
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

      console.log("successful signup");
      console.log(apiData);


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

  /**
   * Validates form data and attempts to sign user up
   *
   * @param event react event
   */
  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
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

    // eslint-disable-next-line
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

    // navigate to login page
    navigate('/login');
  };

  React.useEffect(() => {
    const checkIfLoggedIn = async () => {
      console.log("checkIfLoggedIn in Login.tsx called");
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
            Register
          </Typography>
          <Typography color="error" variant="body1" sx={{ marginTop: 1, display: `${showErrorMessage ? "block" : "none"}` }}>
            {errorMessage}
          </Typography>

          <Box component="form" onSubmit={handleSignUp} noValidate>

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
            // onChange={(e) => setUsername(e.target.value)}
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