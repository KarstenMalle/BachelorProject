import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Footer from '../../page/Footer';
import DTaaSMenu from '../../page/Menu';
import Workflows from './Workflows';

const mdTheme = createTheme();

function DTContent() {
  return (
    /* jshint ignore:start */
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <DTaaSMenu />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Components */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                }}
              >
                <Workflows />
              </Paper>
            </Grid>
            </Grid>

            <Footer />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
    /* jshint ignore:end */
  );
}

export default function DigitalTwins() {
  return <DTContent />; /* jshint ignore:line */
}
