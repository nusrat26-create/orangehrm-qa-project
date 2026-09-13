# JSONPlaceholder Users API Automation (Postman + Newman)

Automates Part D against `https://jsonplaceholder.typicode.com/users`.

| Request | Step(s) covered |
|---|---|
| `1 - GET all users` | Step 1: GET all users, validate status 200, non-empty response, each user has `id`/`name`/`email`. Also stores one user's `id` into `storedUserId` (Step 2). |
| `2 - PUT update user by stored id` | Steps 3-4: builds `/users/{id}` from `storedUserId`, sends PUT with dynamically generated `name`, `email`, `company.name`; validates status 200, returned `id` matches the stored variable, and `phone` is not empty. |

Every request validates its status code, as required.

## File

- `JSONPlaceholder-Users-API.postman_collection.json` — self-contained collection with
  Postman test scripts (`pm.test`) and collection variables (`baseUrl`, `storedUserId`,
  `dynamicName`, `dynamicEmail`, `dynamicCompanyName`). No separate environment file is
  needed.

## Running locally

### Option A — Postman GUI
1. Import `JSONPlaceholder-Users-API.postman_collection.json` into Postman.
2. Click **Run collection**, keep requests in order, run all iterations.

### Option B — Command line via Newman (required deliverable format)

```bash
npm install -g newman
newman run JSONPlaceholder-Users-API.postman_collection.json
```

With an HTML report (add the `newman-reporter-htmlextra` package once):

```bash
npm install -g newman-reporter-htmlextra
newman run JSONPlaceholder-Users-API.postman_collection.json \
  -r cli,htmlextra \
  --reporter-htmlextra-export ./newman-report/report.html
```

This generates an HTML report after every execution, satisfying the general reporting
requirement alongside the UI suite's Allure/HTML report.

## Design notes

- **Order matters within the collection:** the PUT request's pre-request script reads
  `storedUserId`, which is only set once `1 - GET all users` has run in the same Newman
  process. Newman runs collection items top-to-bottom by default, so `newman run
  <file>.json` with no extra flags executes them in the correct order.
- **Dynamic values:** the pre-request script for the PUT request generates a
  timestamp-based `name`/`email`/`company.name` on every run, so the update body is never
  static/hardcoded.
- **JSONPlaceholder is a mock API** — it does not persist writes. A PUT to
  `/users/{id}` returns the request body merged back with a `200`, echoing an `id` that
  matches the URL and a non-empty `phone` field from the original fake record. This is
  expected behavior of the service itself and is exactly what the test assertions check
  for.
- **Standalone + combined run:** this collection is independent of the UI suite and can
  be run on its own (as above) or invoked as a step in a combined CI pipeline alongside
  `npm test` in `playwright-automation/` (see the root `README.md`).
