import { test, expect } from "@playwright/test";

test("redirects to login when not authenticated, then allows login", async ({ page }) => {
  // 1) Try to open a protected page while logged out
  await page.goto("/en/projects");

  // 2) Expect to land on login page
  await expect(page).toHaveURL(/\/en\/login/);

  // 3) Fill login form
  await page.getByTestId("login-email").fill("admin@example.com");
  await page.getByTestId("login-password").fill("admin12345");

  // Wait for the login API call
  const responsePromise = page.waitForResponse(
    (response) => response.url().includes("/auth/login"),
    { timeout: 10000 }
  );

  await page.getByTestId("login-submit").click();

  // Wait for login response and check it
  const response = await responsePromise;
  const status = response.status();

  if (status !== 200) {
    const body = await response.text();
    throw new Error(`Login failed with status ${status}: ${body}`);
  }

  // 4) Expect redirect to projects after login
  await expect(page).toHaveURL(/\/en\/projects/, { timeout: 10000 });
});
