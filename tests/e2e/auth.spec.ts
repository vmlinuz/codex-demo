import { expect, test } from "@playwright/test";

import {
  createTestUser,
  loginViaApi,
  loginViaUi,
  registerViaUi,
  signOutViaUi,
} from "./helpers/auth";
import { E2E_APP_URL } from "./config";

test("users can register, fail login with the wrong password, and sign back in", async ({
  browser,
  page,
}, testInfo) => {
  const user = createTestUser(testInfo);
  const workspaceHeading = page.getByRole("heading", { level: 1, name: "Notes workspace" });

  await registerViaUi(page, user);
  await expect(workspaceHeading).toBeVisible();
  await expect(page.getByText(user.email).first()).toBeVisible();

  await signOutViaUi(page);
  await loginViaUi(page, user);
  await expect(page.getByText(user.email).first()).toBeVisible();
  await signOutViaUi(page);

  await page.getByLabel("Email address").fill(user.email);
  await page.getByLabel("Password").fill(`${user.password}-wrong`);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Unable to sign in with those credentials.")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);

  const retryContext = await browser.newContext({ baseURL: E2E_APP_URL });
  const retryPage = await retryContext.newPage();

  await loginViaApi(retryPage, user);
  await retryPage.goto("/notes");
  await expect(retryPage.getByText(user.email).first()).toBeVisible();

  await retryPage.goto("/");
  await expect(retryPage).toHaveURL(/\/notes$/);

  await retryPage.goto("/login");
  await expect(retryPage).toHaveURL(/\/notes$/);

  await retryPage.goto("/register");
  await expect(retryPage).toHaveURL(/\/notes$/);

  await retryContext.close();
});
