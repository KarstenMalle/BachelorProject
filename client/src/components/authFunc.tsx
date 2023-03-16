/* eslint-disable no-console */
import { useEffect } from 'react';
import { DateTime } from "luxon";

// Used to get authCode from url
export function getCodeParam(): string | null {
    const queryString: string = window.location.search;
    const urlParams: URLSearchParams = new URLSearchParams(queryString);
    const codeParam: string | null = urlParams.get('code');

    return codeParam;
};

export function getGitLabAccessCode(
    clientId: string | undefined,
    requestedScopes: string | undefined,
    redirectUri: string | undefined,
): void {
    if (clientId !== undefined && requestedScopes !== undefined && redirectUri !== undefined) {
        window.location.assign(
            `https://gitlab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${requestedScopes}`,
        );
    }
    else {
        console.log('Input error');
    }
}

// Used to get access token from authCode
export async function getGitLabAccessToken(
  clientId: string | undefined,
  clientSecret: string | undefined,
  redirectUri: string | undefined,
  authCode: string | undefined
): Promise<void> {
  try {
      // Request access token using authorization code
      if (clientId !== undefined && clientSecret !== undefined && redirectUri !== undefined && authCode !== undefined) {
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
              throw new Error(`Error fetching access token: ${response.statusText}`);
          }

          const data = await response.json();
          const accessToken = data.access_token;
          const refreshToken = data.refresh_token;
          const expiresIn = data.expires_in;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          expiresAtDate(expiresIn);
      } else {
          throw new Error('Invalid parameters');
      }
  } catch (error) {
      console.error(error);
  }
}


interface GitLabData {
    data: {
        currentUser: {
        id: string;
        name: string;
        username: string;
        email: string;
        };
    }
}
  
  export async function fetchGitLabGraphQLQuery(
    accessToken: string | null,
    query: string,
  ): Promise<GitLabData | null> {
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
        throw new Error(`Error fetching GitLab GraphQL data: ${response.statusText}`);
      }
      const data = await response.json();
      return data as GitLabData;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  export function expiresAtDate(tokenExpiresAt: number): void {
    // Get the current time
    const currentTime = DateTime.now();
  
    // Add the token expiration time to the current time
    const expirationTime = currentTime.plus({ seconds: tokenExpiresAt });
  
    // Format the date as a string
    const expirationTimeStr = expirationTime.toISO();
  
    // Store the expiration time
    localStorage.setItem('expiresIn', expirationTimeStr);
  }
  
  export const checkTokenValidity = (): boolean => {
    const expirationTimeStr = localStorage.getItem('expiresIn');
  
    if (expirationTimeStr) {
      // Parse the expiration time from the stored string
      const expirationTime = DateTime.fromISO(expirationTimeStr);
  
      // Get the current time
      const currentTime = DateTime.now();
  
      console.log('Current time:', currentTime.toISO());
      console.log('Expiration time:', expirationTime.toISO());
  
      // Check if the expiration time has passed
      if (expirationTime > currentTime) {
        console.log('Token valid!');
        return true;
      } 
      console.log('Token invalid!');
      return false;
    }
  
    console.log('No expiration time found!');
    return false;
  };
  


export const callOncePerRender = (callback: () => void) => {
    useEffect(() => {
        callback();
    }, []);
};

export const logoutClearLocalStorage = (): void => {
    if (localStorage.getItem('expiresIn')) {
        localStorage.removeItem('expiresIn');
    }
    if (localStorage.getItem('refreshToken')) {
        localStorage.removeItem('refreshToken');
    }
    if (localStorage.getItem('accessToken')) {
        localStorage.removeItem('accessToken');
    }
}

export async function resetToken(CLIENT_ID?: string, CLIENT_SECRET?: string): Promise<void> {
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
          client_id: CLIENT_ID ?? '',
          client_secret: CLIENT_SECRET ?? '',
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
      expiresAtDate(expiresIn);
    } catch (error) {
      console.error(`Error refreshing access token: ${error}`);
      throw error;
    }
  }
  



