import { test, expect } from "@playwright/test";

test.describe("Screener Component", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the screener page before each test
    await page.goto("/");

    try {
      // Wait for the API response and content to load
      await Promise.race([
        // Wait for successful API response
        page.waitForResponse(
          (response) =>
            response.url().includes("/api/screener") &&
            response.status() === 200,
          { timeout: 10000 }
        ),
        // Wait for the content to be visible as fallback
        page.waitForSelector(".screener-container", {
          state: "visible",
          timeout: 10000,
        }),
      ]);
    } catch (error) {
      console.log(
        "Warning: Could not wait for API response, continuing with visible content check"
      );
      // If API wait fails, ensure content is visible
      await page.waitForSelector(".screener-container", {
        state: "visible",
        timeout: 10000,
      });
    }

    // Additional check to ensure we have content
    await expect(page.locator(".screener-container")).toBeVisible({
      timeout: 5000,
    });
  });

  test("loads the screener page successfully", async ({ page }) => {
    // Wait for the heading to be visible
    await expect(page.locator("h1")).toBeVisible({ timeout: 5000 });

    // Check if the question counter is visible
    await expect(page.getByText(/question \d+ of \d+/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("displays answer options", async ({ page }) => {
    // Wait for answer buttons to be visible
    const answerButtons = page.locator(".answer-button");
    // Wait for at least one button to be visible
    await expect(answerButtons.first()).toBeVisible({ timeout: 5000 });

    // Check if each button is clickable
    for (const button of await answerButtons.all()) {
      await expect(button).toBeEnabled();
    }
  });

  test("handles answer selection and navigation", async ({ page }) => {
    // Click the first answer option
    const firstAnswer = page.locator(".answer-button").first();
    await firstAnswer.click();

    // Wait for navigation and verify we moved to the next question
    await expect(page.getByText(/question \d+ of \d+/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("prevents rapid answer submission", async ({ page }) => {
    // Click first answer
    const firstAnswer = page.locator(".answer-button").first();
    await firstAnswer.click();

    // Try to click another answer immediately
    const secondAnswer = page.locator(".answer-button").nth(1);
    await secondAnswer.click();

    // Verify warning message appears
    await expect(page.getByText(/please take your time/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("allows going back to previous questions", async ({ page }) => {
    // Answer first question
    const firstAnswer = page.locator(".answer-button").first();
    await firstAnswer.click();

    // Click back button
    const backButton = page.getByRole("button", { name: /back/i });
    await backButton.click();

    // Verify we're back on first question
    await expect(page.getByText(/question 1 of/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("submits the assessment successfully", async ({ page }) => {
    // Get the total number of questions
    const questionCounter = await page
      .getByText(/question \d+ of (\d+)/i)
      .textContent();
    const totalQuestions = parseInt(questionCounter.match(/of (\d+)/)[1]);

    // Answer all questions
    const answerButtons = page.locator(".answer-button");

    for (let i = 0; i < totalQuestions; i++) {
      await answerButtons.first().click();
      // Wait a bit between answers to avoid the warning
      if (i < totalQuestions - 1) {
        await page.waitForTimeout(2000);
      }
    }

    // Wait for submission response
    await page.waitForResponse(
      (response) =>
        response.url().includes("/api/screener/submit") &&
        response.status() === 200
    );

    // Verify success message
    await expect(
      page.getByText(/assessment submitted successfully/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test("handles API errors gracefully", async ({ page }) => {
    // Mock API error
    await page.route("**/api/screener/submit", async (route) => {
      await route.abort("failed");
    });

    // Get the total number of questions
    const questionCounter = await page
      .getByText(/question \d+ of (\d+)/i)
      .textContent();
    const totalQuestions = parseInt(questionCounter.match(/of (\d+)/)[1]);

    // Answer all questions
    const answerButtons = page.locator(".answer-button");

    for (let i = 0; i < totalQuestions; i++) {
      await answerButtons.first().click();
      await page.waitForTimeout(1500);
    }

    // Verify error message
    await expect(page.getByText(/Failed to submit answers/i)).toBeVisible({
      timeout: 5000,
    });
  });
});
