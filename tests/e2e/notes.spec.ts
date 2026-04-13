import { expect, test } from "@playwright/test";

import { createTestUser, registerViaUi } from "./helpers/auth";

test("authenticated users can create notes, autosave edits, and get the custom 404 for missing notes", async ({
  page,
}, testInfo) => {
  const user = createTestUser(testInfo);

  await registerViaUi(page, user);
  await page.goto("/notes/new");

  const createButton = page.getByRole("button", { name: "Create note" });
  const editor = page.getByLabel("Note content");

  await expect(createButton).toBeDisabled();
  await expect(editor).toBeVisible();

  await page.getByLabel("Title").fill("Quarterly planning");
  await editor.click();
  await page.keyboard.type("Agenda and action items for the quarter.");

  await expect(createButton).toBeEnabled();
  await createButton.click();

  await expect(page).toHaveURL(/\/notes\/[^/]+$/);
  await expect(page.getByLabel("Title")).toHaveValue("Quarterly planning");

  await page.waitForTimeout(500);
  await page.getByLabel("Title").fill("Quarterly planning updated");
  await editor.click();
  await page.keyboard.press("End");
  await page.keyboard.type(" Autosave should persist this change.");

  await expect(page.getByLabel("Title")).toHaveValue("Quarterly planning updated");
  await page.waitForTimeout(1600);

  await page.goto("/notes");
  await expect(
    page.getByRole("heading", { level: 3, name: /Quarterly planning updated/i }),
  ).toBeVisible();
  await expect(page.getByText(/Autosave should persist this change\./)).toBeVisible();
  await page.goto("/notes/does-not-exist");

  await expect(
    page.getByRole("heading", { name: "This page drifted out of the acqua current" }),
  ).toBeVisible();
});
