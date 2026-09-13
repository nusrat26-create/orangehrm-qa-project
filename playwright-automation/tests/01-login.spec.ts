import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * Q1 (10 marks): Attempt login with an invalid username/password combination.
 * Verify the correct error message is displayed.
 *
 * Fully independent: needs no prior state, no login, no cleanup.
 */
test.describe('Q1 - Invalid login', () => {
  test('shows "Invalid credentials" error for a bad username/password combo', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalidUser_' + Date.now(), 'WrongPass!123');
    await loginPage.expectInvalidCredentialsError();
  });
});
