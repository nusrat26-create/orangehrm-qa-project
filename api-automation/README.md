# JSONPlaceholder Users API Automation (Postman + Newman)

Automates Part D for `https://jsonplaceholder.typicode.com/users`.

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

screenshot:

![image alt](https://github.com/nusrat26-create/orangehrm-qa-project/blob/e8d34f202e81b6849e8c8c56a2f1fd576b9d0201/Screenshot%202026-09-14%20201830.png)

### Option B — Command line via Newman 

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

screenshot:

![image alt](https://github.com/nusrat26-create/orangehrm-qa-project/blob/966337c97a28c5e5bbdb4e4f4f5779fc3116fe56/Screenshot%202026-09-14%20202646.png)
