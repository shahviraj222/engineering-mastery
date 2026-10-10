import { test, expect } from "@playwright/test";
const key = "engineering-mastery:v1:progress";
test("first session, persistence, mastery gates and revocation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByText("Skills mastered", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Continue learning" }).click();
  await expect(page).toHaveURL(/python-core-l1/);
  const status = page.getByRole("combobox", { name: /Status for/ });
  await status.first().selectOption("learning");
  await page.getByRole("checkbox").first().check();
  await page
    .getByRole("textbox", { name: "Your notes & evidence notes" })
    .fill("Built and tested a CLI with independent changes.");
  await page.getByRole("button", { name: "Save notes", exact: true }).click();
  await page.reload();
  await expect(status.first()).toHaveValue("learning");
  await expect(page.getByRole("checkbox").first()).toBeChecked();
  await expect(page.getByText(/0\/5 skills mastered/)).toBeVisible();
  await page.getByRole("button", { name: "Verify level" }).click();
  await expect(page.getByText("What’s left to demonstrate")).toBeVisible();
  for (const s of await status.all()) await s.selectOption("mastered");
  for (const c of await page.getByRole("checkbox").all()) await c.check();
  await page
    .getByRole("combobox", { name: "Assessment status", exact: true })
    .selectOption("passed");
  await expect(
    page.getByText("Self-assessed mastered", { exact: true }),
  ).toBeVisible();
  await status.first().selectOption("practiced");
  await expect(
    page.getByText("Self-assessed mastered", { exact: true }),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("backup export, cancel reset, reset, import and exact round-trip", async ({
  page,
}) => {
  await page.goto("/#/learn/python-core-l1");
  await page
    .getByRole("combobox", { name: /Status for/ })
    .first()
    .selectOption("practiced");
  await page.getByRole("checkbox").first().check();
  await page
    .getByRole("textbox", { name: "Assessment evidence" })
    .fill("Verified unknown input cases.");
  await page
    .getByRole("combobox", { name: "Assessment status", exact: true })
    .selectOption("attempted");
  await page
    .getByRole("textbox", { name: "Your notes & evidence notes" })
    .fill("My source and experiments.");
  await page.getByRole("button", { name: "Save notes", exact: true }).click();
  await page.locator(".skill-more summary").first().click();
  await page
    .getByLabel(/^Review date for/)
    .first()
    .fill("2026-10-10");
  await page.goto("/#/projects/p3");
  await page.getByRole("checkbox").first().check();
  await page.goto("/#/settings");
  const original = await page.evaluate((k) => localStorage.getItem(k), key);
  const dl = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export backup", exact: true })
    .click();
  const file = await dl;
  const path = await file.path();
  expect(path).toBeTruthy();
  await page.getByRole("button", { name: "Reset all progress" }).click();
  await page.getByRole("button", { name: "Keep my progress" }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toEqual(
    original,
  );
  await page.getByRole("button", { name: "Reset all progress" }).click();
  await page.getByLabel("Type RESET to confirm").fill("RESET");
  await page
    .getByRole("button", { name: "Reset everything", exact: true })
    .click();
  await page.getByLabel("Import backup file").setInputFiles(path!);
  await expect(
    page.getByRole("heading", { name: "Review your backup" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Replace with this backup" }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toEqual(
    original,
  );
});
test("applications create, edit, filter, reload and delete confirmation", async ({
  page,
}) => {
  await page.goto("/#/applications");
  await page
    .getByRole("button", { name: "Add application", exact: true })
    .click();
  await page.getByLabel("Company", { exact: true }).fill("Acme");
  await page.getByLabel("Role", { exact: true }).fill("Backend Engineer");
  await page.getByLabel("Application stage").selectOption("applied");
  await page.getByLabel("Follow up on").fill("2026-10-09");
  await page
    .getByLabel("Notes & next action")
    .fill("Ask about the backend role.");
  await page.getByRole("button", { name: "Save application" }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Backend Engineer" }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Stage for Acme" })
    .selectOption("interview");
  await page
    .getByRole("combobox", { name: "Application filter" })
    .selectOption("interview");
  await page.getByRole("button", { name: "Details", exact: true }).click();
  await expect(page.getByLabel("Notes & next action")).toHaveValue(
    "Ask about the backend role.",
  );
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("button", { name: "Keep application" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Backend Engineer" }),
  ).toBeVisible();
});
test("future content, planner, reviews and safe notes", async ({ page }) => {
  await page.goto("/#/learn?q=agents&level=L3");
  await page.locator('a[href="#/learn/ai-agents-l3"]').click();
  await expect(
    page.getByText(/Later specialization · Available/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Verify level" }).click();
  await expect(page.getByText("What’s left to demonstrate")).toBeVisible();
  await page.goto("/#/plan");
  await page.getByLabel("Sprint start date").fill("2026-09-30");
  await page.getByRole("checkbox").first().check();
  await expect(page.getByText("2026-09-30 → 2026-10-06")).toBeVisible();
  await page.goto("/#/learn/python-core-l1");
  await page.locator(".skill-more summary").first().click();
  await page
    .getByLabel(/^Review date for/)
    .first()
    .fill("2020-01-01");
  await page.goto("/#/reviews");
  await expect(page.getByText("Overdue · 2020-01-01")).toBeVisible();
  await page.getByRole("button", { name: "Reviewed", exact: true }).click();
  await page.getByRole("button", { name: /^Reviewed 1/ }).click();
  await expect(page.locator(".review-row")).toHaveCount(1);
});
test("360px mobile routes fit, navigation drawer works, desktop screenshot", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of [
    "/",
    "/learn",
    "/learn/python-core-l1",
    "/projects",
    "/projects/p3",
    "/plan",
    "/reviews",
    "/resources",
    "/applications",
    "/settings",
  ]) {
    await page.goto("/#" + path);
    await expect(page.locator("h1").first()).toBeVisible();
    const width = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(width, `Overflow on ${path}`).toBeLessThanOrEqual(360);
  }
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Overview" })
    .click();
  await expect(
    page.getByRole("link", { name: "Continue learning" }),
  ).toBeVisible();
  await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
  await page.screenshot({
    path: "test-results/mobile-overview.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/desktop-overview.png",
    fullPage: true,
    animations: "disabled",
  });
});
test("keyboard navigation, dark theme and rejected imports", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(page).not.toHaveURL(/#main/);
  await page.goto("/#/settings");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const before = await page.evaluate((k) => localStorage.getItem(k), key);
  await page
    .getByLabel("Import backup file")
    .setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"version":99}'),
    });
  await expect(page.getByText(/Import failed/)).toBeVisible();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toEqual(
    before,
  );
  await page.setViewportSize({ width: 360, height: 800 });
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation", exact: true }),
  ).toBeFocused();
  await expect(page.locator(".sidebar")).toHaveAttribute("inert", "");
  await page.screenshot({
    path: "test-results/mobile-dark-settings.png",
    fullPage: true,
    animations: "disabled",
  });
});
test("corrupted storage is recoverable and cannot be silently overwritten", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate((k) => localStorage.setItem(k, "{broken"), key);
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("kept untouched");
  await page.goto("/#/learn/python-core-l1");
  await page
    .getByRole("combobox", { name: /Status for/ })
    .first()
    .selectOption("learning");
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(
    "{broken",
  );
  await page.goto("/#/settings");
  await page.getByRole("button", { name: "Reset all progress" }).click();
  await page.getByLabel("Type RESET to confirm").fill("RESET");
  await page
    .getByRole("button", { name: "Reset everything", exact: true })
    .click();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
