/* eslint-disable no-console */

export function loginWithGitlab(
  clientId,
  requestedScopes,
  redirectUri,
) {
  window.location.assign(
    `https://gitlab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${requestedScopes}`,
  );
}
export async function checkTokenValidity(accessToken) {
  const query = `
    {
      currentUser {
        id
      }
    }
  `;

  try {
    const response = await fetch('https://gitlab.com/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.log('Response error');
      return false;
    }

    const data = await response.json();

    if (data.errors) {
      console.log('Data error');
      return false;
    }
    console.log('No error');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function resetToken(CLIENT_ID, CLIENT_SECRET) {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('Refresh token is not available.');
  }

  try {
    const response = await fetch('https://gitlab.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error refreshing access token: ${response.statusText}`);
    }

    const data = await response.json();
    const accessToken = data.access_token;
    const newRefreshToken = data.refresh_token;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return [accessToken, newRefreshToken];
  } catch (error) {
    console.error(`Error refreshing access token: ${error}`);
    throw error;
  }
}
