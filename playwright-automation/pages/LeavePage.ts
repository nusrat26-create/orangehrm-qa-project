import { Page, Locator, expect } from '@playwright/test';

export class LeavePage {
  readonly page: Page;

  readonly leaveMenuLink: Locator;
  readonly applyTab: Locator;
  readonly myLeaveTab: Locator;

  readonly leaveTypeDropdown: Locator;
  readonly fromDateInput: Locator;
  toDateInput: Locator;
  readonly applyButton: Locator;

  readonly leaveListRows: Locator;

  constructor(page: Page) {
    this.page = page;

    this.leaveMenuLink = page.getByRole('link', { name: 'Leave', exact: true });
    this.applyTab = page.getByRole('link', { name: 'Apply' });
    this.myLeaveTab = page.getByRole('link', { name: 'My Leave' });

    this.leaveTypeDropdown = page.locator('.oxd-select-text').first();
    this.fromDateInput = page.locator('.oxd-date-input input').first();
    this.toDateInput = page.locator('.oxd-date-input input').nth(1);
    this.applyButton = page.getByRole('button', { name: 'Apply' });

    this.leaveListRows = page.locator('.oxd-table-card');
  }

  async open() {
    await this.leaveMenuLink.click();
    await expect(this.page).toHaveURL(/leave/);
  }

  private async waitForLoaderToClear() {
    await this.page
      .locator('.oxd-form-loader')
      .waitFor({ state: 'hidden', timeout: 15_000 })
      .catch(() => {});
  }

  private async getOwnEmployeeSearchTerm(): Promise<string> {
    await this.page.goto('/web/index.php/pim/viewMyDetails');
    await this.page.waitForLoadState('networkidle').catch(() => {});

    const nameInputs = this.page
      .locator('.oxd-input-group', { hasText: 'Employee Full Name' })
      .locator('input');

    await nameInputs.first().waitFor({ state: 'visible', timeout: 15_000 });
    const count = await nameInputs.count();
    for (let i = 0; i < count; i++) {
      const value = (await nameInputs.nth(i).inputValue()).trim();
      if (value.length >= 2) {
        return value;
      }
    }
    return '';
  }

  async ensureLeaveBalance() {
    const ownSearchTerm = await this.getOwnEmployeeSearchTerm();

    await this.page.goto('/web/index.php/leave/addLeaveEntitlement');
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.waitForLoaderToClear();

    const employeeField = this.page.getByPlaceholder('Type for hints...').first();
    await employeeField.waitFor({ state: 'visible', timeout: 15_000 });

    const option = this.page
      .locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option, .oxd-autocomplete-dropdown li')
      .first();

    await employeeField.click();
    await employeeField.pressSequentially(ownSearchTerm, { delay: 250 });
    await this.page.waitForTimeout(1_500);

    const appeared = await option
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
    if (!appeared) {
      throw new Error(
        `No autocomplete suggestion appeared for own employee search term: "${ownSearchTerm}".`,
      );
    }
    await option.click();
    await this.page.waitForTimeout(400);

    const empValue = (await employeeField.inputValue()).trim();
    if (empValue.length <= ownSearchTerm.length) {
      throw new Error(
        `Employee Name autocomplete did not accept a real selection for "${ownSearchTerm}".`,
      );
    }

    const leaveTypeDropdown = this.page
      .locator('.oxd-input-group', { hasText: 'Leave Type' })
      .locator('.oxd-select-text');

    let leaveTypeSelected = false;
    for (let attempt = 0; attempt < 4; attempt++) {
      await leaveTypeDropdown.click();
      await this.page.waitForTimeout(400);

      const anyOptionVisible = await this.page
        .locator('.oxd-select-option')
        .first()
        .waitFor({ state: 'visible', timeout: 5_000 })
        .then(() => true)
        .catch(() => false);

      if (anyOptionVisible) {
        await this.page.keyboard.press('ArrowDown');
        await this.page.waitForTimeout(200);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(500);
      }

      const selectedText = (await leaveTypeDropdown.textContent())?.trim() ?? '';
      if (selectedText && selectedText !== '-- Select --') {
        leaveTypeSelected = true;
        break;
      }

      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.waitForTimeout(300);
    }
    if (!leaveTypeSelected) {
      throw new Error('Could not select a Leave Type while setting up the entitlement.');
    }

    const entitlementInput = this.page
      .locator('.oxd-input-group', { hasText: 'Entitlement' })
      .locator('input');
    await entitlementInput.fill('10');

    const saveButton = this.page.getByRole('button', { name: 'Save' });
    await saveButton.click();

    const confirmButton = this.page.getByRole('button', { name: 'Confirm' });
    const dialogAppeared = await confirmButton
      .waitFor({ state: 'visible', timeout: 4_000 })
      .then(() => true)
      .catch(() => false);
    if (dialogAppeared) {
      await confirmButton.click();
      await this.waitForLoaderToClear();
      await this.page.waitForTimeout(1_500);
    }

    await this.waitForLoaderToClear();
    await this.page.waitForTimeout(2_000);
    const stillOnAddForm = this.page.url().includes('addLeaveEntitlement');
    const success = !stillOnAddForm;

    if (!success) {
      const errorTexts = await this.page
        .locator('.oxd-input-field-error-message, .oxd-alert-content-text')
        .allTextContents();
      throw new Error(
        `Adding the leave entitlement did not succeed. Validation/error message(s): ${JSON.stringify(errorTexts)}`,
      );
    }
  }

  /** Selects "Partial Days" if that field is present on the current form. */
  private async selectPartialDaysIfPresent() {
    const partialDaysDropdown = this.page
      .locator('.oxd-input-group', { hasText: 'Partial Days' })
      .locator('.oxd-select-text');

    if (!(await partialDaysDropdown.isVisible().catch(() => false))) {
      return;
    }

    for (let attempt = 0; attempt < 3; attempt++) {
      await partialDaysDropdown.click();
      await this.page.waitForTimeout(400);

      const anyOptionVisible = await this.page
        .locator('.oxd-select-option')
        .first()
        .waitFor({ state: 'visible', timeout: 4_000 })
        .then(() => true)
        .catch(() => false);

      if (anyOptionVisible) {
        await this.page.keyboard.press('ArrowDown');
        await this.page.waitForTimeout(200);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(400);
      }

      const selectedText = (await partialDaysDropdown.textContent())?.trim() ?? '';
      if (selectedText && selectedText !== '-- Select --') {
        break;
      }
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.waitForTimeout(300);
    }
  }

  async applyForLeave(fromDate: string, toDate: string): Promise<string> {
    await this.applyTab.click();
    await expect(this.page).toHaveURL(/leave\/applyLeave/);
    await this.waitForLoaderToClear();

    await this.leaveTypeDropdown.waitFor({ state: 'visible' });
    await this.waitForLoaderToClear();

    let chosenLeaveType = '';
    for (let attempt = 0; attempt < 4; attempt++) {
      await this.leaveTypeDropdown.click({ force: true });
      await this.page.waitForTimeout(400);

      const anyOptionVisible = await this.page
        .locator('.oxd-select-option')
        .first()
        .waitFor({ state: 'visible', timeout: 5_000 })
        .then(() => true)
        .catch(() => false);

      if (anyOptionVisible) {
        chosenLeaveType =
          (await this.page.locator('.oxd-select-option').first().textContent())?.trim() ?? '';
        await this.page.keyboard.press('ArrowDown');
        await this.page.waitForTimeout(200);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(500);
      }

      const selectedText = (await this.leaveTypeDropdown.textContent())?.trim() ?? '';
      if (selectedText && selectedText !== '-- Select --') {
        break;
      }
      chosenLeaveType = '';
      await this.page.keyboard.press('Escape').catch(() => {});
      await this.page.waitForTimeout(300);
    }
    if (!chosenLeaveType) {
      throw new Error('Could not select a Leave Type before applying — dropdown stayed on "-- Select --".');
    }

    await this.selectPartialDaysIfPresent();

    const trySubmit = async (from: string, to: string): Promise<{ ok: boolean; text: string }> => {
      await this.fromDateInput.fill(from);
      await this.toDateInput.fill(to);
      await this.page.keyboard.press('Escape');

      await this.waitForLoaderToClear();
      await this.applyButton.click();

      const success = this.page.getByText('Successfully Saved');
      const errorMsg = this.page.locator('.oxd-input-field-error-message, .oxd-alert-content-text').first();
      const confirmBtn = this.page.getByRole('button', { name: 'Confirm' });

      // Track which one appeared FIRST (a success toast can auto-hide
      // within a few seconds, so we must react to it immediately rather
      // than checking .isVisible() again after a long wait).
      let outcome: 'success' | 'error' | 'confirm' | 'none' = 'none';
      await Promise.race([
        success.waitFor({ state: 'visible', timeout: 8_000 }).then(() => {
          outcome = 'success';
        }),
        errorMsg.waitFor({ state: 'visible', timeout: 8_000 }).then(() => {
          outcome = 'error';
        }),
        confirmBtn.waitFor({ state: 'visible', timeout: 8_000 }).then(() => {
          outcome = 'confirm';
        }),
      ]).catch(() => {});

      if (outcome === 'confirm') {
        await confirmBtn.click();
        await this.waitForLoaderToClear();
        outcome = 'none';
        await Promise.race([
          success.waitFor({ state: 'visible', timeout: 8_000 }).then(() => {
            outcome = 'success';
          }),
          errorMsg.waitFor({ state: 'visible', timeout: 8_000 }).then(() => {
            outcome = 'error';
          }),
        ]).catch(() => {});
      }

      if (outcome === 'error') {
        const text = (await errorMsg.textContent().catch(() => '')) ?? '';
        return { ok: false, text };
      }
      if (outcome === 'success') {
        return { ok: true, text: '' };
      }
      return { ok: false, text: 'Neither a success toast nor a validation error appeared after clicking Apply.' };
    };

    const [fYear, fA, fB] = fromDate.split('-');
    const [, tA, tB] = toDate.split('-');

    let result = await trySubmit(`${fYear}-${fA}-${fB}`, `${fYear}-${tA}-${tB}`);
    if (!result.ok && /valid date/i.test(result.text)) {
      result = await trySubmit(`${fYear}-${fB}-${fA}`, `${fYear}-${tB}-${tA}`);
    }

    if (!result.ok) {
      throw new Error(`Apply Leave was rejected by validation: "${result.text}"`);
    }

    return chosenLeaveType;
  }

  async goToMyLeave() {
    await this.myLeaveTab.click();
    await this.waitForLoaderToClear();
    await expect(this.page).toHaveURL(/leave\/viewMyLeaveList/);
  }

  async expectLeaveWithStatus(_fromDate: string, status: string) {
    const row = this.leaveListRows.filter({ hasText: status });
    await expect(row.first()).toBeVisible({ timeout: 15_000 });
    return row.first();
  }

  async cancelLeave(_fromDate: string) {
    const row = this.leaveListRows.filter({ hasText: 'Pending Approval' }).first();
    await row.getByRole('button', { name: /Cancel/i }).click();
    const confirmButton = this.page.getByRole('button', { name: 'Yes, Cancel' });
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
  }
}