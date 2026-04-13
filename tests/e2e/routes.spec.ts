import { expect, test } from "@playwright/test";

import { SEEDED_SHARED_NOTE } from "./config";

const notFoundHeading = "This page drifted out of the acqua current";

test("unauthenticated visitors are redirected away from protected routes", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Welcome back to TinyNotes" })).toBeVisible();

  await page.goto("/notes", { waitUntil: "commit" });
  await expect(page).toHaveURL(/\/login$/);
});

test("public share routes resolve valid tokens and hide invalid ones behind the same 404", async ({
  page,
}) => {
  await page.goto(`/s/${SEEDED_SHARED_NOTE.enabledToken}`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Shared note placeholder" })).toBeVisible();
  await expect(page.getByRole("heading", { name: SEEDED_SHARED_NOTE.title })).toBeVisible();

  await page.goto(`/s/${SEEDED_SHARED_NOTE.disabledToken}`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: notFoundHeading })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shared note placeholder" })).not.toBeVisible();

  await page.goto("/s/not-a-real-token", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: notFoundHeading })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shared note placeholder" })).not.toBeVisible();
});
