/* eslint-disable no-console */
import React, { useEffect } from 'react';

// const REDIRECT_URI = 'http://localhost:4000/dashboard';
const CLIENT_ID = 'f05709a4c29009cc4bb443c2d13bcd4d9f457107495c5ebae5af8e8a1bed774d';
const CLIENT_SECRET = 'e85ae3fb2e7b72d5f709ae2a0753e89e6ddd2beab9042150a0deb8880b1ab489';
const REDIRECT_URI = 'http://localhost:4000/';
const REQUESTED_SCOPES = 'read_user+profile+read_api+email+read_repository';

function App() {
  // const [rerender, setRerender] = useState(false);

  useEffect(async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get('code');
    async function fetchGitLabGraphQLQuery(accessToken, query) {
      try {
        const response = await fetch('https://gitlab.com/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // eslint-disable-next-line quote-props
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ query }),
        });
        if (!response.ok) {
          throw new Error(
            `Error fetching GitLab GraphQL data: ${response.statusText}`,
          );
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    if (codeParam && localStorage.getItem('accessToken') === null) {
      // eslint-disable-next-line no-inner-declarations
      async function getGitLabAccessToken(
        clientId,
        clientSecret,
        redirectUri,
        authCode,
      ) {
        try {
          const response = await fetch('https://gitlab.com/oauth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUri,
              code: authCode,
            }),
          });

          if (!response.ok) {
            throw new Error(
              `Error fetching access token: ${response.statusText}`,
            );
          }

          const data = await response.json();
          const accessToken = data.access_token;

          return accessToken;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
      try {
        // eslint-disable-next-line max-len
        const accessToken = await getGitLabAccessToken(
          CLIENT_ID,
          CLIENT_SECRET,
          REDIRECT_URI,
          codeParam,
        );
        localStorage.setItem('accessToken', accessToken);
        const query = `
          {
            viewer {
              username
            }
          }
        `;

        const data = await fetchGitLabGraphQLQuery(accessToken, query);

        if (data.errors) {
          data.errors.forEach((error) => {
            console.error(error.message);
          });
        } else {
          console.log(data);
        }
        console.log(`Access token: ${accessToken}`);
      } catch (error) {
        console.error(`Error fetching access token: ${error}`);
      }
    } else if (localStorage.getItem('accessToken')) {
      const accessToken = localStorage.getItem(('accessToken'));
      console.log('TOKEN IS: ', accessToken);
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
        console.log(data.currentUser);
      }
    }
  }, []);
  function loginWithGitlab() {
    window.location.assign(
      `https://gitlab.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${REQUESTED_SCOPES}`,
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={loginWithGitlab}>Login with Gitlab</button>
      </header>
    </div>
  );
}

export default App;
