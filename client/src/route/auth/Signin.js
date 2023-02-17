import React, { useEffect, useState } from 'react';

const APPLICATION_ID = 'f05709a4c29009cc4bb443c2d13bcd4d9f457107495c5ebae5af8e8a1bed774d';
const INIT_REDIRECT_URI = 'http://localhost:4000/';
// const REDIRECT_URI = 'http://localhost:4000/dashboard';
const REQUESTED_SCOPES = 'read_user+profile+read_api+email';

function App() {
  const [rerender, setRerender] = useState(false);
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get('code');
    if (codeParam && (localStorage.getItem('accessToken') === null)) {
      // eslint-disable-next-line no-inner-declarations
      async function getAccessToken() {
        // eslint-disable-next-line prefer-template
        await fetch('http://localhost:3000/getAccessToken?code=' + codeParam, {
          method: 'GET',
        }).then((response) => response.json()).then((data) => {
          console.log(data);
          if (data.access_token) {
            localStorage.setItem('accessToken', data.access_token);
            setRerender(!rerender);
          }
        });
      }
      getAccessToken();
    }
  }, []);
  function loginWithGitlab() {
    window.location.assign(`https://gitlab.com/oauth/authorize?client_id=${APPLICATION_ID}&redirect_uri=${INIT_REDIRECT_URI}&response_type=code&scope=${REQUESTED_SCOPES}`);
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <button onClick={loginWithGitlab}>
          Login with Gitlab
        </button>
      </header>
    </div>
  );
}

export default App;
