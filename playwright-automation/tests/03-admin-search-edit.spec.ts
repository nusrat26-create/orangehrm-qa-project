// // import { test } from '@playwright/test';
// // import { LoginPage } from '../pages/LoginPage';
// // import { AdminPage } from '../pages/AdminPage';
// // import { PimPage } from '../pages/PimPage';
// // import { randomUsername } from '../utils/dataGenerator';
// //
// // test.describe('Q3 - Admin: search, edit user status, verify persistence', () => {
// //   test("creates a user, edits their status, and confirms it persists after refresh", async ({ page }) => {
// //     const loginPage = new LoginPage(page);
// //     const adminPage = new AdminPage(page);
// //     const username = randomUsername('qa');
// //
// //     await test.step('Login with valid credentials', async () => {
// //       await loginPage.goto();
// //       await loginPage.login('Admin', 'admin123');
// //       await loginPage.expectLoginSuccessful();
// //     });
// //
// //     let employeeSearchTerm = 'a';
// //     await test.step('Read a real employee name from PIM to search for in Admin', async () => {
// //       const pimPageForLookup = new PimPage(page);
// //       const fullName = await pimPageForLookup.getAnyExistingEmployeeName();
// //       employeeSearchTerm = fullName.split(' ')[0] || 'a';
// //     });
// //
// //     await test.step('Navigate to Admin and create a disposable test user', async () => {
// //       await adminPage.open();
// //       await adminPage.addSystemUser(username, 'TestPass!2024', employeeSearchTerm);
// //     });
// //
// //     await test.step('Search for the user by username and verify the results table', async () => {
// //       await adminPage.searchByUsername(username);
// //       await adminPage.expectSearchResultContainsUsername(username);
// //     });
// //
// //     await test.step("Edit that user's status and save", async () => {
// //       await adminPage.editFirstResult();
// //       await adminPage.setStatus('Disabled');
// //       await adminPage.save();
// //     });
// //
// //     await test.step('Refresh the page and verify the change persisted', async () => {
// //       await page.reload();
// //       await adminPage.searchByUsername(username);
// //       await adminPage.expectRowHasStatus(username, 'Disabled');
// //     });
// //   });
// // });
//
//
// import { test } from '@playwright/test';
// import { LoginPage } from '../pages/LoginPage';
// import { AdminPage } from '../pages/AdminPage';
// import { randomUsername } from '../utils/dataGenerator';
//
// test.describe('Q3 - Admin: search, edit user status, verify persistence', () => {
//   test("creates a user, edits their status, and confirms it persists after refresh", async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     const adminPage = new AdminPage(page);
//     const username = randomUsername('qa');
//
//     await test.step('Login with valid credentials', async () => {
//       await loginPage.goto();
//       await loginPage.login('Admin', 'admin123');
//       await loginPage.expectLoginSuccessful();
//     });
//
//     let ownFirstName = '';
//     await test.step('Read own employee first name from My Info', async () => {
//       ownFirstName = await adminPage.getOwnFirstNameFromMyInfo();
//     });
//
//     await test.step('Navigate to Admin and create a disposable test user', async () => {
//       await adminPage.open();
//       await adminPage.addSystemUser(username, 'TestPass!2024', ownFirstName);
//     });
//
//     await test.step('Search for the user by username and verify the results table', async () => {
//       await adminPage.searchByUsername(username);
//       await adminPage.expectSearchResultContainsUsername(username);
//     });
//
//     await test.step("Edit that user's status and save", async () => {
//       await adminPage.editFirstResult();
//       await adminPage.setStatus('Disabled');
//       await adminPage.save();
//     });
//
//     await test.step('Refresh the page and verify the change persisted', async () => {
//       await page.reload();
//       await adminPage.searchByUsername(username);
//       await adminPage.expectRowHasStatus(username, 'Disabled');
//     });
//   });
// });





import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';
import { randomUsername } from '../utils/dataGenerator';

test.describe('Q3 - Admin: search, edit user status, verify persistence', () => {
  test("creates a user, edits their status, and confirms it persists after refresh", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);
    const username = randomUsername('qa');

    await test.step('Login with valid credentials', async () => {
      await loginPage.goto();
      await loginPage.login('Admin', 'admin123');
      await loginPage.expectLoginSuccessful();
    });

    await test.step('Navigate to Admin and create a disposable test user', async () => {
      await adminPage.open();
      await adminPage.addSystemUser(username, 'TestPass!2024');
    });

    await test.step('Search for the user by username and verify the results table', async () => {
      await adminPage.searchByUsername(username);
      await adminPage.expectSearchResultContainsUsername(username);
    });

    await test.step("Edit that user's status and save", async () => {
      await adminPage.editFirstResult();
      await adminPage.setStatus('Disabled');
      await adminPage.save();
    });

    await test.step('Refresh the page and verify the change persisted', async () => {
      await page.reload();
      await adminPage.searchByUsername(username);
      await adminPage.expectRowHasStatus(username, 'Disabled');
    });
  });
});