#IT22344038
# IT3040 - ITPM Assignment 1 (Playwright + TypeScript)

## Setup
1. Install Node.js (LTS)
2. Install dependencies:
   npm install
3. Install Playwright browsers:
   npx playwright install

## Run Tests
- Run all:
  npx playwright test

- Run only positive:
  npx playwright test --grep "Pos_Fun"

- Run only negative:
  npx playwright test --grep "Neg_Fun"

- Run UI tests:
  npx playwright test --grep "UI"

## Reports
- HTML report:
  npx playwright test --reporter=html
  npx playwright show-report
