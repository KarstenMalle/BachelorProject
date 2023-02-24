import { test, expect } from '@playwright/test';

// The URL of the Signin.js file
const signinUrl = 'http://localhost:4000/';

test('sign in with GitLab', async ({ page }) => {
  // Open the Signin.js file in a new browser window
  await page.goto(signinUrl);

  // Assert that the GitLab sign-in button is present
  const signinButton = await page.waitForSelector('.gitlabButton');
  expect(signinButton).toBeTruthy();

  // Click the sign-in button
  await signinButton.click();

  // Assert that the browser is now on the GitLab OAuth login page
  const loginUrl = 'https://gitlab.com/users/sign_in';
  expect(page.url()).toMatch(loginUrl);
});

test('refresh token', async ({ page }) => {
  // Open the Signin.js file in a new browser window
  await page.goto(signinUrl);

  // Perform a sign-in action to get an access token
  const signinButton = await page.waitForSelector('.gitlabButton');
  await signinButton.click();

  // Wait for the user to be redirected back to the Signin.js page
  await page.waitForURL(signinUrl);

  // Click the refresh token button
  const refreshTokenButton = await page.waitForSelector('#refreshTokenButton');
  await refreshTokenButton.click();

  // Assert that the console logs contain the expected output
  const logs = await page.evaluate(() => console.logs);
  expect(logs).toContain('Access token refreshed');
});
