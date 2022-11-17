import { createTheme } from "@mui/material";

const Theme = createTheme({
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
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif`,
    h1: {
      fontFamily: `"Open Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif`
    },
    h2: {
      fontFamily: `"Open Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif`
    },
    h3: {
      fontFamily: `"Open Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif`
    },
    h4: {
      fontFamily: `"Open Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif`
    },
    h5: {
      fontFamily: `"Open Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif`
    },
    h6: {
      fontFamily: `"Open Sans", "Roboto", "Helvetica Neue", "Arial", sans-serif`
    },
  }
});

export default Theme;