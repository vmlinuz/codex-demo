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
  await page.keyboard.press("Enter");

  await page.getByRole("button", { name: "Bullets" }).click();
  await page.waitForTimeout(150);
  await page.keyboard.type("First bullet");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Second bullet");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");

  await page.getByRole("button", { name: "Numbers" }).click();
  await page.waitForTimeout(150);
  await page.keyboard.type("First numbered item");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Second numbered item");

  await expect(page.getByLabel("Title")).toHaveValue("Quarterly planning updated");
  await page.waitForTimeout(1600);
  await page.reload();

  const bulletList = page.locator(".note-editor-surface ul").first();
  const orderedList = page.locator(".note-editor-surface ol").first();

  await expect(page.getByLabel("Title")).toHaveValue("Quarterly planning updated");
  await expect(bulletList).toBeVisible();
  await expect(orderedList).toBeVisible();
  await expect(page.getByText("First bullet")).toBeVisible();
  await expect(page.getByText("Second numbered item")).toBeVisible();
  expect(await bulletList.evaluate((element) => getComputedStyle(element).listStyleType)).not.toBe(
    "none",
  );
  expect(await orderedList.evaluate((element) => getComputedStyle(element).listStyleType)).not.toBe(
    "none",
  );

  await page.goto("/notes");
  await expect(
    page.getByRole("heading", { level: 3, name: /Quarterly planning updated/i }),
  ).toBeVisible();
  await expect(page.getByText(/Autosave should persist this change\./)).toBeVisible();
  await expect(page.getByText(/First bullet/)).toBeVisible();
  await page.goto("/notes/does-not-exist");

  await expect(
    page.getByRole("heading", { name: "This page drifted out of the acqua current" }),
  ).toBeVisible();
});
