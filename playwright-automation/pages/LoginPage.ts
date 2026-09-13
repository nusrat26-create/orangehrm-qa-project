import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;
  readonly dashboardHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.dashboardHeader = page.locator('h6', { hasText: 'Dashboard' });
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectInvalidCredentialsError() {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toHaveText('Invalid credentials');
  }

  async expectLoginSuccessful() {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.dashboardHeader).toBeVisible();
  }

  /** Logs out via the top-right user dropdown menu. */
  async logout() {
    await this.page.locator('.oxd-userdropdown-tab').click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(this.usernameInput).toBeVisible();
  }
  async getLoggedInEmployeeName(): Promise<string> {
    const name = await this.page.locator('.oxd-userdropdown-name').textContent();
    return name?.trim() ?? '';
  }


}
