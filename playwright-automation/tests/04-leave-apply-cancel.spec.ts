import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LeavePage } from '../pages/LeavePage';
import { dateFromToday } from '../utils/dataGenerator';

/**
 * Q4 (10 marks): Log in -> navigate to Leave -> apply for leave with
 * specific dates -> verify it appears under "My Leave" with status
 * Pending Approval -> cancel the request -> verify the status updates
 * correctly.
 *
 * Fully independent: logs in itself and applies for a fresh leave date
 * range (10 and 12 days from today) that does not depend on data from
 * any other spec.
 */
test.describe('Q4 - Leave: apply, verify pending, cancel', () => {
  test('applies for leave, verifies Pending Approval status, then cancels it', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const leavePage = new LeavePage(page);

    const fromDate = dateFromToday(10);
    const toDate = dateFromToday(12);

    await test.step('Login with valid credentials', async () => {
      await loginPage.goto();
      await loginPage.login('Admin', 'admin123');
      await loginPage.expectLoginSuccessful();
    });

    await test.step('Ensure a leave balance exists, then apply with specific dates', async () => {
      await leavePage.ensureLeaveBalance();
      await leavePage.open();
      await leavePage.applyForLeave(fromDate, toDate);
    });

    await test.step('Verify it appears under "My Leave" with status Pending Approval', async () => {
      await leavePage.goToMyLeave();
      await leavePage.expectLeaveWithStatus(fromDate, 'Pending Approval');
    });

    await test.step('Cancel the request and verify the status updates', async () => {
      await leavePage.cancelLeave(fromDate);
      await leavePage.expectLeaveWithStatus(fromDate, 'Cancelled');
    });
  });
});
