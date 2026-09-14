# OrangeHRM QA Automation Project


- **Part A — UI Automation (50):** `playwright-automation/`
- **Part B — Manual Testing (20):** `manual-tests/`
- **Part C — GitHub Workflow (10):** this repo's structure, commit history, and READMEs
- **Part D — API Automation (20):** `api-automation/`


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

