import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';
import { randomEmployee } from '../utils/dataGenerator';

test.describe('Q2 - PIM: add employee and verify via search', () => {
  test('adds a new employee with random data and finds them in Employee List', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const pimPage = new PimPage(page);
    const { firstName, lastName } = randomEmployee();
    const fullName = `${firstName} ${lastName}`;

    await test.step('Login with valid admin credentials', async () => {
      await loginPage.goto();
      await loginPage.login('Admin', 'admin123');
      await loginPage.expectLoginSuccessful();
    });

    await test.step('Navigate to PIM and add employee with random data', async () => {
      await pimPage.open();
      await pimPage.addEmployee(firstName, lastName);
    });

    await test.step('Verify the employee appears when searched in the employee list', async () => {
      await pimPage.searchEmployeeByName(fullName);
      await pimPage.expectEmployeeInResults(fullName);
    });

    await test.step('Log out', async () => {
      await loginPage.logout();
    });
  });
});