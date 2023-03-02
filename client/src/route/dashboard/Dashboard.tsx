/* eslint-disable no-console */
/*
source: https://github.com/mui/material-ui/tree/v5.10.0/docs/data/material/getting-started/templates/dashboard
*/
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import { useEffect } from 'react';
import { getCodeParam, getGitLabAccessToken, checkTokenValidity, fetchGitLabGraphQLQuery, resetToken } from 'components/authFunc';

import Chart from '../history/Chart';
import RecentRuns from '../history/RecentRuns';


const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
// const REQUESTED_SCOPES = process.env.REACT_APP_REQUESTED_SCOPES;

function DashboardContent() {
  useEffect(() => {
    const codeParam = getCodeParam();
    if (localStorage.getItem('expiresIn')) {
      if (checkTokenValidity() === true) {
        fetchGitLabGraphQLQuery(localStorage.getItem('accessToken'), `
        {
          currentUser {
            id
            name
            username
            email
          }
        }
      `).then((data) => {
          console.log('Current user: ', data?.data?.currentUser.name);
        }).catch((error) => {
          console.error(error);
        });
      }
      else {
        console.log('Token not valid, request new token');
        resetToken(CLIENT_ID, CLIENT_SECRET);
      }
    }
    if (localStorage.getItem('accessToken') === null) {
      if (codeParam) {
        console.log('No accesToken so we request one');
        getGitLabAccessToken(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, codeParam);
      }
    }
  }, []);

  return (
    <>
      {/* Chart */}
      <Grid item xs={12} md={12} lg={12}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Chart />
        </Paper>
      </Grid>
      {/* Past Runs */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <RecentRuns />
        </Paper>
      </Grid>
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
