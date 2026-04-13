import { randomUUID } from "node:crypto";

import type { Page, TestInfo } from "@playwright/test";
import { expect } from "@playwright/test";

type TestUser = {
  email: string;
  password: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function createTestUser(testInfo: TestInfo): TestUser {
  const suffix = randomUUID().slice(0, 8);
  const slug = slugify(`${testInfo.project.name}-${suffix}-${testInfo.title}`).slice(0, 40);

  return {
    email: `${slug}@example.com`,
    password: `Password-${suffix}-1234`,
  };
}

export async function registerViaUi(page: Page, user: TestUser) {
  await page.goto("/register");
  const emailField = page.getByLabel("Email address");
  const passwordField = page.getByLabel("Password");
  const submitButton = page.getByRole("button", { name: "Create account" });

  await expect(emailField).toBeEnabled();
  await expect(passwordField).toBeEnabled();
  await expect(submitButton).toBeEnabled();
  await emailField.fill(user.email);
  await passwordField.fill(user.password);
  await submitButton.click();

  await expect(page).toHaveURL(/\/notes$/, { timeout: 10000 });
}

export async function loginViaUi(page: Page, user: TestUser) {
  await page.goto("/login");
  const emailField = page.getByLabel("Email address");
  const passwordField = page.getByLabel("Password");
  const submitButton = page.getByRole("button", { name: "Sign in" });

  await expect(emailField).toBeEnabled();
  await expect(passwordField).toBeEnabled();
  await expect(submitButton).toBeEnabled();
  await emailField.fill(user.email);
  await passwordField.fill(user.password);
  await submitButton.click();

  await expect(page).toHaveURL(/\/notes$/, { timeout: 10000 });
}

export async function loginViaApi(page: Page, user: TestUser) {
  const response = await page.request.post("/api/auth/sign-in/email", {
    data: {
      email: user.email,
      password: user.password,
    },
  });

  expect(response.ok()).toBeTruthy();
}

export async function signOutViaUi(page: Page) {
  await page.getByRole("banner").getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/, { timeout: 10000 });
}
