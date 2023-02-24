/* eslint-disable no-console */
/* eslint-disable max-len */ // disable eslint rule that prohibits lines over 100 chars.
import './style.css';
import React, { useEffect } from 'react';
import {
  loginWithGitlab, checkTokenValidity, resetToken, getGitLabAccessToken, fetchGitLabGraphQLQuery,
} from './Functions';

// const REDIRECT_URI = 'http://localhost:4000/dashboard';
// Define constants used throughout the application
const CLIENT_ID = 'f05709a4c29009cc4bb443c2d13bcd4d9f457107495c5ebae5af8e8a1bed774d';
const CLIENT_SECRET = 'e85ae3fb2e7b72d5f709ae2a0753e89e6ddd2beab9042150a0deb8880b1ab489';
const REDIRECT_URI = 'http://localhost:4000/';
const REQUESTED_SCOPES = 'read_user+profile+read_api+email+read_repository';

function App() {
  useEffect(async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get('code');
    // If there is a code parameter in the URL and no access token in local storage, exchange the code for an access token
    if (codeParam && localStorage.getItem('accessToken') === null) {
      try {
        const allTokens = await getGitLabAccessToken(
          CLIENT_ID,
          CLIENT_SECRET,
          REDIRECT_URI,
          codeParam,
        );
        const accessToken = allTokens[0];
        const refreshToken = allTokens[1];
        // const expiresIn = allTokens[2];

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        // Fetch data from the GitLab API and display it in the console
        const query = `
            {
              currentUser {
                id
                name
                username
                email
              }
            }
          `;

        const data = await fetchGitLabGraphQLQuery(accessToken, query);

        // If there are errors in the data, log them to the console
        if (data.errors) {
          data.errors.forEach((error) => {
            console.error(error.message);
          });
        } else {
          console.log('USER IS: ', data, 'name is: ', data.data.currentUser.name);
        }
        console.log(`Access token: ${accessToken}`);
      } catch (error) {
        console.error(`Error fetching access token: ${error}`);
      }
    } else if (localStorage.getItem('accessToken')) {
      const accessToken = localStorage.getItem(('accessToken'));
      const query = `
          {
            currentUser {
              id
              name
              username
              email
            }
          }
        `;

      const data = await fetchGitLabGraphQLQuery(accessToken, query);

      if (data.errors) {
        data.errors.forEach((error) => {
          console.error(error.message);
        });
      } else {
        console.log('USER IS: ', data, 'name is: ', data.data.currentUser.name);
      }
      const validityButton = document.getElementById('validityButton');
      validityButton.style.display = 'block';

      return () => {
        validityButton.style.display = 'none';
      };
    }
    return Promise.resolve();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button
        className="gitlabButton"
        onClick={() => loginWithGitlab(
          CLIENT_ID,
          REQUESTED_SCOPES,
          REDIRECT_URI,
        )}>
          <a href="#" className="gitlabButton">
            <img src="https://gitlab.com/gitlab-com/gitlab-artwork/-/raw/master/logo/logo-square.png" alt="GitLab logo" className="gitlabLogo">
            </img>
            <span>Sign in with GitLab</span>
          </a>
          </button>
        <button
        id="validityButton"
        style={{ display: 'none' }}
        onClick={() => {
          const accessToken = localStorage.getItem('accessToken');
          if (accessToken) {
            checkTokenValidity(accessToken);
          }
        }}
      >
        Check Token Validity
      </button>
      <button
        id="refreshTokenButton"
        onClick={() => {
          resetToken(CLIENT_ID, CLIENT_SECRET);
        }}
      >
        Refresh Token
      </button>
      </header>
    </div>
  );
}

export default App;
