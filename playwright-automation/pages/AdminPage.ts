import { Page, Locator, expect } from '@playwright/test';

export class AdminPage {
  readonly page: Page;

  readonly adminMenuLink: Locator;
  readonly usernameSearchInput: Locator;
  readonly searchButton: Locator;
  readonly resultsTableRows: Locator;

  readonly userRoleDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly saveButton: Locator;

  readonly addButton: Locator;
  readonly employeeNameAutocomplete: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.adminMenuLink = page.getByRole('link', { name: 'Admin' });
    this.usernameSearchInput = page.locator('.oxd-table-filter-area input').first();
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resultsTableRows = page.locator('.oxd-table-card');

    this.userRoleDropdown = page.locator('.oxd-select-text').nth(0);
    this.statusDropdown = page.locator('.oxd-select-text').nth(1);
    this.saveButton = page.getByRole('button', { name: 'Save' });

    this.addButton = page.getByRole('button', { name: 'Add' });
    this.employeeNameAutocomplete = page.getByPlaceholder('Type for hints...');
    this.usernameInput = page.getByRole('textbox').nth(2);
    this.passwordInput = page.locator('input[type="password"]:visible').first();
    this.confirmPasswordInput = page.locator('input[type="password"]:visible').nth(1);
  }

  async open() {
    await this.adminMenuLink.click();
    await expect(this.page).toHaveURL(/admin\/viewSystemUsers/);
  }

  private async assertSavedSuccessfully() {
    try {
      await expect(this.page).toHaveURL(/admin\/viewSystemUsers/, { timeout: 15_000 });
    } catch {
      const errorTexts = await this.page
        .locator('.oxd-input-field-error-message, .oxd-alert-content-text')
        .allTextContents();
      throw new Error(
        `Save did not return to the Users list. Validation/error message(s) shown on page: ${JSON.stringify(
          errorTexts,
        )}`,
      );
    }
  }


  private async selectAnyRealEmployeeInAutocomplete(field: Locator) {
    const option = this.page
      .locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option, .oxd-autocomplete-dropdown li')
      .first();

    // Two-letter combos: OrangeHRM's autocomplete typically needs at
    // least 2 characters before it queries the backend at all.
    const candidates = ['an', 'ar', 'er', 'in', 'on', 'ma', 'ri', 'el', 'ka', 'sa', 'la', 'ni'];

    for (const letters of candidates) {
      await field.click();
      await field.fill('');
      await field.pressSequentially(letters, { delay: 250 });
      await this.page.waitForTimeout(1_500); // give the search API time to respond

      const appeared = await option
        .waitFor({ state: 'visible', timeout: 6_000 })
        .then(() => true)
        .catch(() => false);
      if (!appeared) continue;

      await option.click();
      await this.page.waitForTimeout(400);

      const currentValue = (await field.inputValue()).trim();
      if (currentValue.length > letters.length) {
        return currentValue;
      }
    }

    throw new Error(
      'Could not select any real employee from the autocomplete after trying several two-letter combinations.',
    );
  }

  async addSystemUser(username: string, password: string) {
    await this.addButton.click();
    await expect(this.page).toHaveURL(/admin\/saveSystemUser/);

    await this.userRoleDropdown.click();
    await this.page.locator('.oxd-select-option', { hasText: 'ESS' }).click();

    await this.selectAnyRealEmployeeInAutocomplete(this.employeeNameAutocomplete);

    await this.setStatus('Enabled');
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);

    await this.saveButton.click();
    await this.assertSavedSuccessfully();
  }

  async searchByUsername(username: string) {
    await this.usernameSearchInput.fill(username);
    await this.searchButton.click();
  }

  async expectSearchResultContainsUsername(username: string) {
    const row = this.resultsTableRows.filter({ hasText: username });
    await expect(row.first()).toBeVisible({ timeout: 15_000 });
    return row.first();
  }

  async editFirstResult() {
    await this.resultsTableRows.first().locator('.oxd-icon-button').last().click();
    await expect(this.page).toHaveURL(/admin\/saveSystemUser/);
  }

  async setStatus(status: 'Enabled' | 'Disabled') {
    await this.statusDropdown.click();
    await this.page.locator('.oxd-select-option', { hasText: status }).click();
  }

  async save() {
    await this.saveButton.click();
    await this.assertSavedSuccessfully();
  }

  async expectRowHasStatus(username: string, status: string) {
    const row = this.resultsTableRows.filter({ hasText: username });
    await expect(row.first()).toContainText(status);
  }
}