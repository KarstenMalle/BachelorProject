/* eslint-disable max-len */
/* eslint-disable no-console */

/**
 * Redirects the user to GitLab's OAuth login page with the specified client ID, scopes, and redirect URI.
 *
 * @param {string} clientId - The client ID for the GitLab OAuth application.
 * @param {string} requestedScopes - The requested scopes for the GitLab OAuth access token.
 * @param {string} redirectUri - The redirect URI to which the GitLab OAuth response will be sent.
 */
export function loginWithGitlab(
  clientId,
  requestedScopes,
  redirectUri,
) {
  window.location.assign(
    `https://gitlab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${requestedScopes}`,
  );
}
/**
 * Checks the validity of the GitLab OAuth access token by querying the GitLab GraphQL API.
 *
 * @param {string} accessToken - The GitLab OAuth access token to be checked for validity.
 * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating whether the token is valid or not.
 */
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

/**
 * Requests a new GitLab OAuth access token using a refresh token.
 *
 * @param {string} CLIENT_ID - The client ID for the GitLab OAuth application.
 * @param {string} CLIENT_SECRET - The client secret for the GitLab OAuth application.
 * @throws {Error} If the refresh token is not available or the token request fails.
 * @returns {Promise<[string, string]>} - A Promise that resolves to an array containing the new access token and refresh token.
 */
export async function resetToken(CLIENT_ID, CLIENT_SECRET) {
  // Check if refresh token is available
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('Refresh token is not available.');
  }

  try {
    // Request new access token using refresh token
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
    const expiresIn = data.expires_in;

    // Store new tokens in local storage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    console.log('EXPIRES IN: ', expiresIn);
    console.log('Access token refreshed');

    return [accessToken, newRefreshToken, expiresIn];
  } catch (error) {
    console.error(`Error refreshing access token: ${error}`);
    throw error;
  }
}

/**
 * Requests a GitLab OAuth access token using an authorization code.
 *
 * @param {string} clientId - The client ID for the GitLab OAuth application.
 * @param {string} clientSecret - The client secret for the GitLab OAuth application.
 * @param {string} redirectUri - The redirect URI for the GitLab OAuth application.
 * @param {string} authCode - The authorization code received from GitLab after the user grants permission.
 * @throws {Error} If the token request fails.
 * @returns {Promise<[string, string] | null>} - A Promise that resolves to an array containing the access token and refresh token, or null if the request failed.
 */
export async function getGitLabAccessToken(
  clientId,
  clientSecret,
  redirectUri,
  authCode,
) {
  try {
    // Request access token using authorization code
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
    const refreshToken = data.refresh_token;
    const expiresIn = data.expires_in;

    return [accessToken, refreshToken, expiresIn];
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
A function that fetches data from the GitLab GraphQL API using an access token and a GraphQL query.
@param {string} accessToken - The GitLab access token to use for the API request.
@param {string} query - The GraphQL query to execute on the GitLab API.
@returns {object} The response data from the GraphQL query as an object.
@throws {Error} If an error occurs while fetching data from the GitLab GraphQL API.
@returns {null} If the API request fails.
*/
export async function fetchGitLabGraphQLQuery(accessToken, query) {
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
