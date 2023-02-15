/*
src: https://github.com/mui/material-ui/blob/v5.10.0/docs/data/material/getting-started/templates/sign-in/SignIn.js
*/

import * as React from 'react';
import { useEffect } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
// import { gql } from 'apollo-server';
/*
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from '../../page/Footer';
*/
const APPLICATION_ID = 'f05709a4c29009cc4bb443c2d13bcd4d9f457107495c5ebae5af8e8a1bed774d';
const APPLICATION_SECRET = 'e85ae3fb2e7b72d5f709ae2a0753e89e6ddd2beab9042150a0deb8880b1ab489';
const INIT_REDIRECT_URI = 'http://localhost:4000/';
const REDIRECT_URI = 'http://localhost:4000/dashboard';
const REQUESTED_SCOPES = 'read_user+profile';

const client = new ApolloClient({
  uri: 'https://gitlab.com/api/graphql',
  cache: new InMemoryCache(),
});

// let REQUEST_ACCESS_TOKEN_MUTATION = '';

function App() {
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get('code') != null) {
      const code = urlParams.get('code');
      const GET_TOKEN = gql`
        mutation GetToken($code: String!) {
          accessToken: access_token(
            grant_type: "authorization_code",
            client_id: "${APPLICATION_ID}",
            client_secret: "${APPLICATION_SECRET}",
            code: $code,
            redirect_uri: "${REDIRECT_URI}"
          ) {
            access_token
          }
        }
      `;
      client
        .mutate({
          mutation: GET_TOKEN,
          variables: { code },
        })
        .then((result) => {
          const token = result.data.token.access_token;
          console.log(token);
        });
      console.log('TESTING2: ', GET_TOKEN);
    } else {
      console.log('LOGIN');
    }
  }, []);
  function loginWithGitlab() {
    window.location.assign(`https://gitlab.com/oauth/authorize?client_id=${APPLICATION_ID}&redirect_uri=${INIT_REDIRECT_URI}&response_type=code&scope=${REQUESTED_SCOPES}`);
  }
  return (
    /* jshint ignore:start */
    <div className='App'>
      <header className='App-header'>
        <button onClick={loginWithGitlab}>
          Login with Gitlab
        </button>
      </header>
    </div>
    /* jshint ignore:end */
  );
}
// <button onClick={LoginCallback}>Request Access Token</button>
export default App;
/*
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const theme = createTheme();

export default function SignIn() {
  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = '/dashboard';
  };

  return (
    /* jshint ignore:start */
/*
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <AppBar position="absolute">
            <Toolbar
                sx={{
                  pr: '24px', // keep right padding when drawer closed
                }}
            >
                <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
                >
                The Digital Twin as a Service
                </Typography>
            </Toolbar>
          </AppBar>

          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Footer />
      </Container>
    </ThemeProvider>
    /* jshint ignore:end */
/*
  );
}
*/
