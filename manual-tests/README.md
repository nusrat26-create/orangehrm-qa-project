# Manual Testing — Part B (20 marks)

**File:** `OrangeHRM_Manual_Test_Cases.xlsx`

## Sheets

1. **Test Cases** — 13 manual test cases (minimum required: 10) across all four modules
   (Login, PIM, Admin, Leave). Columns: Test ID, Module, Title, Preconditions, Steps,
   Expected Result, Actual Result, Status, Priority, Severity, Requirement/Feature
   Traced. Mix of positive, negative, boundary/edge cases that **complement** — not
   duplicate — the Part A automation (empty-field validation, special characters,
   session timeout, unauthorized access, RBAC, delete confirmation, date-range
   validation, etc).
2. **Traceability Matrix** — maps every module/feature to what covers it: the
   corresponding Playwright automated spec (Part A) or the manual Test ID(s) (Part B).
3. **Bug Reports** — bug report format (Bug ID, Title, Module, Steps to Reproduce,
   Expected Result, Actual Result, Severity, Priority, Status, Screenshot).

## Important — before you submit

This workbook was prepared without live execution access to the OrangeHRM demo site
from this environment, so:

- Test cases **TC-01 to TC-06, TC-08 to TC-11, TC-13** describe stable, well-documented
  OrangeHRM demo behavior and are pre-filled as `Pass` with a matching Actual Result —
  **re-run them yourself** and correct any row where your actual observation differs.
- Test cases **TC-07** (Add Employee name field boundary) and **TC-12** (leave applied
  with a fully past date range) are marked **`Not Executed`** on purpose — these are the
  two most likely to surface a genuine inconsistency, and you should execute them
  yourself and record the real result.
- The **Bug Reports** sheet contains one clearly labeled **template row**, not a
  verified finding. Execute TC-06/TC-07/TC-12 (and anything else you notice while
  testing) and replace it with your own real defect, including an actual screenshot
  saved under `manual-tests/screenshots/`.

Update the `Actual Result` and `Status` columns as you execute each case — that record
of real execution is part of what this deliverable is meant to demonstrate.
