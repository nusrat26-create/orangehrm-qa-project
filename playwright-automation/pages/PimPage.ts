// import { Page, Locator, expect } from '@playwright/test';
//
// export class PimPage {
//   readonly page: Page;
//
//   readonly pimMenuLink: Locator;
//   readonly addButton: Locator;
//   readonly employeeNameSearchInput: Locator;
//   readonly searchButton: Locator;
//   readonly resultsTableRows: Locator;
//
//   readonly firstNameInput: Locator;
//   readonly lastNameInput: Locator;
//   readonly saveButton: Locator;
//
//   constructor(page: Page) {
//     this.page = page;
//
//     this.pimMenuLink = page.getByRole('link', { name: 'PIM' });
//     this.addButton = page.getByRole('button', { name: 'Add' });
//     this.employeeNameSearchInput = page
//       .locator('.oxd-table-filter-area')
//       .getByPlaceholder('Type for hints...')
//       .first();
//     this.searchButton = page.getByRole('button', { name: 'Search' });
//     this.resultsTableRows = page.locator('.oxd-table-card');
//
//     this.firstNameInput = page.getByPlaceholder('First Name');
//     this.lastNameInput = page.getByPlaceholder('Last Name');
//     this.saveButton = page.getByRole('button', { name: 'Save' });
//   }
//
//   async open() {
//     await this.pimMenuLink.click();
//     await expect(this.page).toHaveURL(/pim\/viewEmployeeList/);
//   }
//
//   private async assertSavedSuccessfully() {
//     try {
//       await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/, { timeout: 15_000 });
//     } catch {
//       const errorTexts = await this.page
//         .locator('.oxd-input-field-error-message, .oxd-alert-content-text')
//         .allTextContents();
//       throw new Error(
//         `Add Employee did not navigate to Personal Details. Validation/error message(s): ${JSON.stringify(errorTexts)}`,
//       );
//     }
//   }
//
//   async addEmployee(firstName: string, lastName: string): Promise<string> {
//     await this.addButton.click();
//     await expect(this.page).toHaveURL(/pim\/addEmployee/);
//
//     await this.firstNameInput.fill(firstName);
//     await this.lastNameInput.fill(lastName);
//
//     await this.saveButton.click();
//     await this.assertSavedSuccessfully();
//
//     const url = this.page.url();
//     const match = url.match(/empNumber\/(\d+)/);
//     return match ? match[1] : '';
//   }
//
//   /**
//    * Searches by the employee's full name using the Employee Name
//    * autocomplete, which is more reliable on this shared demo than
//    * searching by the auto-generated Employee Id (the visible Id and the
//    * internal record id can drift apart on a heavily-used shared instance).
//    */
//   async searchEmployeeByName(fullName: string) {
//     await this.pimMenuLink.click();
//     await expect(this.page).toHaveURL(/pim\/viewEmployeeList/);
//
//     await this.employeeNameSearchInput.click();
//     await this.employeeNameSearchInput.pressSequentially(fullName, { delay: 150 });
//
//     const option = this.page
//       .locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option, .oxd-autocomplete-dropdown li')
//       .first();
//     await option.waitFor({ state: 'visible', timeout: 10_000 });
//     await option.click();
//
//     await this.searchButton.click();
//   }
//
//   async expectEmployeeInResults(text: string) {
//     const row = this.page.locator('.oxd-table-card', { hasText: text });
//     await expect(row.first()).toBeVisible({ timeout: 20_000 });
//   }
//   /** Reads a real employee's name directly from the Employee List table. */
//   async getAnyExistingEmployeeName(): Promise<string> {
//     await this.open();
//     await this.resultsTableRows.first().waitFor({ state: 'visible', timeout: 15_000 });
//     const cell = this.resultsTableRows.first().locator('.oxd-table-cell').nth(2);
//     return (await cell.textContent())?.trim() ?? '';
//   }
// }
import { Page, Locator, expect } from '@playwright/test';

export class PimPage {
  readonly page: Page;

  readonly pimMenuLink: Locator;
  readonly addButton: Locator;
  readonly employeeNameSearchInput: Locator;
  readonly searchButton: Locator;
  readonly resultsTableRows: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pimMenuLink = page.getByRole('link', { name: 'PIM' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.employeeNameSearchInput = page
      .locator('.oxd-table-filter-area')
      .getByPlaceholder('Type for hints...')
      .first();
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resultsTableRows = page.locator('.oxd-table-card');

    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async open() {
    await this.pimMenuLink.click();
    await expect(this.page).toHaveURL(/pim\/viewEmployeeList/);
  }

  private async assertSavedSuccessfully() {
    try {
      await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/, { timeout: 15_000 });
    } catch {
      const errorTexts = await this.page
        .locator('.oxd-input-field-error-message, .oxd-alert-content-text')
        .allTextContents();
      throw new Error(
        `Add Employee did not navigate to Personal Details. Validation/error message(s): ${JSON.stringify(errorTexts)}`,
      );
    }
  }

  async addEmployee(firstName: string, lastName: string): Promise<string> {
    await this.addButton.click();
    await expect(this.page).toHaveURL(/pim\/addEmployee/);

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);

    await this.saveButton.click();
    await this.assertSavedSuccessfully();

    const url = this.page.url();
    const match = url.match(/empNumber\/(\d+)/);
    return match ? match[1] : '';
  }

  async searchEmployeeByName(fullName: string) {
    await this.pimMenuLink.click();
    await expect(this.page).toHaveURL(/pim\/viewEmployeeList/);

    await this.employeeNameSearchInput.click();
    await this.employeeNameSearchInput.pressSequentially(fullName, { delay: 150 });

    const option = this.page
      .locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option, .oxd-autocomplete-dropdown li')
      .first();
    await option.waitFor({ state: 'visible', timeout: 10_000 });
    await option.click();

    await this.searchButton.click();
  }

  async expectEmployeeInResults(text: string) {
    const row = this.page.locator('.oxd-table-card', { hasText: text });
    await expect(row.first()).toBeVisible({ timeout: 20_000 });
  }

  /**
   * Reads a real employee's name from the Employee List by extracting a
   * name-like substring (consecutive Capitalized words) from the first
   * row's full text, instead of relying on a fixed column index (which
   * can point at the wrong cell depending on table layout).
   */
  async getAnyExistingEmployeeName(): Promise<string> {
    await this.open();
    await this.resultsTableRows.first().waitFor({ state: 'visible', timeout: 15_000 });
    const rowText = (await this.resultsTableRows.first().textContent()) ?? '';
    const match = rowText.match(/[A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){1,3}/);
    return match ? match[0].trim() : '';
  }
}