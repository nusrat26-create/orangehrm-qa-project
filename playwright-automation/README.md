# OrangeHRM UI Automation (Playwright + TypeScript, POM)

Automates the four Part A scenarios against the OrangeHRM demo site:
`https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`

| Spec file | Scenario | Marks |
|---|---|---|
| `tests/01-login.spec.ts` | Q1 – Invalid login shows the correct error | 10 |
| `tests/02-pim-add-employee.spec.ts` | Q2 – Add employee (random data), verify via search, logout | 15 |
| `tests/03-admin-search-edit.spec.ts` | Q3 – Search user, edit role/status, refresh, verify persisted | 15 |
| `tests/04-leave-apply-cancel.spec.ts` | Q4 – Apply leave, verify Pending Approval, cancel, verify status | 10 |

## Tech stack

- **Playwright Test** (`@playwright/test`) + **TypeScript**
- **Page Object Model** — one class per page in `pages/`
- **@faker-js/faker** for randomly generated test data
- **allure-playwright** for Allure reporting, plus Playwright's built-in HTML reporter

## Project structure

```
playwright-automation/
├── pages/                # Page Objects (LoginPage, PimPage, AdminPage, LeavePage)
├── tests/                # One spec per scenario (Q1-Q4), each independently runnable
├── utils/                # Random data generator
├── playwright.config.ts  # baseURL, reporters (HTML + Allure), retries, screenshots/video/trace
└── package.json
```

## Setup

Requires Node.js 18+.

```bash
cd playwright-automation
npm install
npx playwright install --with-deps chromium
```

## Running the tests

Each scenario runs independently:

```bash
npm run test:login   # Q1 only
npm run test:pim     # Q2 only
npm run test:admin   # Q3 only
npm run test:leave   # Q4 only
```

All four, sequentially, in one suite:

```bash
npm test
```

Run headed (see the browser) for debugging:

```bash
npm run test:headed
```
screenshots:

![image alt](https://github.com/nusrat26-create/orangehrm-qa-project/blob/3b5bcb039beaff95cdda9fcf54b4fa5f31918425/playwright.jpeg)

## Reports

An HTML report and Allure results are generated **after every run** (configured in
`playwright.config.ts`).

- **Playwright HTML report:**
  ```bash
  npm run report:html
  ```
  Opens `playwright-report/index.html` in the browser.

- **Allure report:** (requires the Allure commandline; easiest via `npx`)
  ```bash
  npx allure generate allure-results --clean -o allure-report
  npx allure open allure-report
  ```


- If `npx playwright install` fails behind a proxy/firewall, see the
  [Playwright browser install docs](https://playwright.dev/docs/browsers).
- The OrangeHRM demo instance is a shared public sandbox that Admin resets periodically;
  if a run fails because expected demo data is missing, re-run — Q2 and Q4 create their
  own data, and Q3 no longer depends on any pre-seeded data.
