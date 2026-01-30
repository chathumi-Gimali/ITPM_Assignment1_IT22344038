import { test, expect } from "@playwright/test";
import { positiveCases } from "./data/positive.cases";
import { negativeCases } from "./data/negative.cases";

test.describe("SwiftTranslator - Singlish to Sinhala", () => {
  // Run before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.swifttranslator.com/");
  });

  // Helper: fill input and read output
  async function convert(page: any, text: string) {
    const input = page.locator("textarea");
    await expect(input).toBeVisible();
    await input.fill(text);

    // Wait until Sinhala text appears anywhere in the page
    await page.waitForFunction(
      () => {
        return /[\u0D80-\u0DFF]/.test(document.body.innerText);
      },
      { timeout: 10_000 },
    );

    // Find the rendered output (NOT textarea)
    const output = page
      .locator("div, p, span")
      .filter({ hasText: /[\u0D80-\u0DFF]/ })
      .first();

    await expect(output).toBeVisible();

    return (await output.textContent())?.trim();
  }

  // ✅ 24 Positive Functional Test Cases
  for (const tc of positiveCases) {
    test(tc.id, async ({ page }) => {
      const actual = await convert(page, tc.input);
      expect(actual).toBe(tc.expected);
    });
  }

  // ✅ 10 Negative Functional Test Cases (expected to fail / mismatch)
  for (const tc of negativeCases) {
    test(tc.id, async ({ page }) => {
      const actual = await convert(page, tc.input);

      // Negative means: it does NOT match the expected correct Sinhala
      // (because the system behaves incorrectly)
      expect(actual).not.toBe(tc.expected);
    });
  }

  // ✅ 1 UI Test: real-time update behavior (mentioned in PDF)
  test("Pos_UI_0001 - Output updates in real-time", async ({ page }) => {
    const input = page.locator("textarea").first();
    const output = page
      .locator("div, p, span")
      .filter({ hasText: /[\u0D80-\u0DFF]/ })
      .first();

    await input.fill("mama");
    await page.waitForTimeout(300);
    const out1 = (await output.inputValue()).trim();

    await input.fill("mama gedhara");
    await page.waitForTimeout(300);
    const out2 = (await output.inputValue()).trim();

    // Output should change as input changes
    expect(out2).not.toBe(out1);
  });
});
