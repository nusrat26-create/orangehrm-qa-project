# OrangeHRM QA Automation Project

QA assignment submission covering UI automation, manual testing, API automation, and
GitHub workflow, against the OrangeHRM demo application.

- **Part A — UI Automation (50):** `playwright-automation/`
- **Part B — Manual Testing (20):** `manual-tests/`
- **Part C — GitHub Workflow (10):** this repo's structure, commit history, and READMEs
- **Part D — API Automation (20):** `api-automation/`

## Project overview

| Area | What it does | Where |
|---|---|---|
| UI Automation | 4 Playwright + TypeScript specs (POM) covering Login, PIM, Admin, Leave on the OrangeHRM demo site | `playwright-automation/` |
| Manual Testing | 13 manual test cases + traceability matrix + bug report, complementing the automated scenarios | `manual-tests/` |
| API Automation | Postman collection (2 requests, chained via variables) against JSONPlaceholder `/users`, runnable via Newman | `api-automation/` |
| CI (bonus) | GitHub Actions workflow running both suites and uploading reports as build artifacts on every push | `.github/workflows/ci.yml` |

## Tech stack

- **UI:** Playwright Test, TypeScript, Page Object Model, `@faker-js/faker`, Allure +
  Playwright HTML reporters
- **API:** Postman collection, executed via Newman (Node.js CLI)
- **Manual:** Excel workbook (openpyxl-compatible `.xlsx`)
- **CI:** GitHub Actions (Node 20, headless Chromium)

## Repository structure

```
.
├── playwright-automation/     # Part A — UI automation (Playwright + POM)
│   ├── pages/                 # LoginPage, PimPage, AdminPage, LeavePage
│   ├── tests/                 # 01-login, 02-pim-add-employee, 03-admin-search-edit, 04-leave-apply-cancel
│   ├── utils/                 # random data generator
│   ├── playwright.config.ts
│   └── README.md
├── manual-tests/               # Part B — manual test cases, traceability, bug report
│   ├── OrangeHRM_Manual_Test_Cases.xlsx
│   └── README.md
├── api-automation/             # Part D — Postman/Newman API suite
│   ├── JSONPlaceholder-Users-API.postman_collection.json
│   └── README.md
├── .github/workflows/ci.yml    # bonus CI pipeline
└── README.md                   # you are here
```

## Setup

Requires **Node.js 18+** and npm.

```bash
git clone <your-repo-url>
cd <repo-name>

# UI suite
cd playwright-automation
npm install
npx playwright install --with-deps chromium
cd ..

# API suite
npm install -g newman            # or use npx newman ... without a global install
```

## Running each scenario individually

```bash
cd playwright-automation
npm run test:login    # Q1 — invalid login
npm run test:pim      # Q2 — add employee via PIM
npm run test:admin    # Q3 — search/edit user in Admin
npm run test:leave    # Q4 — apply/cancel leave
```

```bash
cd api-automation
newman run JSONPlaceholder-Users-API.postman_collection.json
```

## Running everything together, in sequence

```bash
# UI: all four scenarios in one suite
cd playwright-automation && npm test

# API: standalone suite
cd ../api-automation && newman run JSONPlaceholder-Users-API.postman_collection.json
```

Both are also wired into `.github/workflows/ci.yml`, which runs them as two jobs on
every push/PR to `main`.

## Generating reports

- **UI (Playwright HTML):** `npm run report:html` inside `playwright-automation/`
  (opens `playwright-report/index.html`).
- **UI (Allure):** `npx allure generate allure-results --clean -o allure-report && npx allure open allure-report`
  inside `playwright-automation/`.
- **API (Newman HTML):** `npm install -g newman-reporter-htmlextra` once, then
  `newman run JSONPlaceholder-Users-API.postman_collection.json -r cli,htmlextra --reporter-htmlextra-export ./newman-report/report.html`
  inside `api-automation/`.

A report is generated after every execution as required, for both the UI and API
suites. See each subfolder's `README.md` for full detail.

## Manual testing & bug reports

See `manual-tests/README.md`. It also explains which two test cases (TC-07, TC-12) and
which bug-report row are left as **execute-yourself templates** — this repo was
assembled without live browser access to the demo site, so those specific rows need a
real run before submission (full explanation in that README).

## Git workflow

This repo is structured for incremental, meaningful commits, e.g.:

1. `chore: scaffold repo structure and READMEs`
2. `feat(ui): add LoginPage and Q1 invalid-login spec`
3. `feat(ui): add PimPage and Q2 add-employee spec`
4. `feat(ui): add AdminPage and Q3 search/edit spec`
5. `feat(ui): add LeavePage and Q4 apply/cancel spec`
6. `feat(api): add Postman collection for GET/PUT users`
7. `test(manual): add manual test cases, traceability matrix, bug report`
8. `ci: add GitHub Actions workflow for combined suite run`

Commit in that kind of order (or similar) as you build/adapt this locally, rather than
pushing everything as a single dump commit.
