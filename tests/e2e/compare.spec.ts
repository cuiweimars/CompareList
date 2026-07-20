import { expect, test } from "@playwright/test";
import path from "node:path";

test("exact and smart comparison workflows work", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Compare Two Lists Online Free/);

  await page.getByRole("textbox", { name: "List A" }).fill("apple\nbanana");
  await page.getByRole("textbox", { name: "List B" }).fill("banana\ncherry");
  await page.getByRole("button", { name: "Compare Lists" }).click();
  await expect(page.getByText("50%", { exact: true })).toBeVisible();
  await expect(page.getByTitle("apple")).toBeVisible();

  await page.getByRole("button", { name: "Smart Match Local" }).click();
  await page.getByRole("textbox", { name: "List A" }).fill("John Smith\nAlice");
  await page.getByRole("textbox", { name: "List B" }).fill("Smith, John\nAlyce");
  await page.getByRole("button", { name: "Smart Compare" }).click();
  await expect(page.getByText("Smart Match Results")).toBeVisible();
  await expect(page.getByTitle("Smith, John")).toBeVisible();
});

test("CSV files support composite-key row comparison", async ({ page }) => {
  await page.goto("/compare-csv-files");
  const files = page.locator('input[type="file"]');
  await files.nth(0).setInputFiles(path.join(process.cwd(), "tests/fixtures/rows-a.csv"));
  await files.nth(1).setInputFiles(path.join(process.cwd(), "tests/fixtures/rows-b.csv"));

  const panel = page.getByRole("heading", { name: "Row-level comparison" }).locator("..").locator("..");
  await expect(panel).toBeVisible();
  await panel.getByRole("button", { name: "Compare rows" }).click();
  await expect(panel.getByText("paused", { exact: true })).toBeVisible();
  await expect(panel.getByRole("row", { name: "2 status active paused" })).toBeVisible();
  await panel.getByRole("tab", { name: "1 Added rows" }).click();
  await expect(panel.getByRole("cell", { name: "Dana" })).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await panel.getByRole("button", { name: "Excel report" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("comparelist-row-report.xlsx");
});

test("local projects and privacy-first share links are reusable", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: "Try Demo" }).click();
  await page.getByRole("button", { name: "Save project" }).click();

  const saveDialog = page.getByRole("dialog", { name: "Save project" });
  await saveDialog.getByRole("textbox", { name: "Project name" }).fill("Weekly QA project");
  await saveDialog.getByRole("checkbox").check();
  await saveDialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Project saved", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Local projects" }).click();
  const projectsDialog = page.getByRole("dialog", { name: "Local projects" });
  await expect(projectsDialog.getByRole("heading", { name: "Weekly QA project" })).toBeVisible();
  await projectsDialog.getByRole("button", { name: "Close" }).click();

  await page.getByRole("button", { name: "Share workspace" }).click();
  const shareDialog = page.getByRole("dialog", { name: "Share workspace" });
  await expect(shareDialog.getByRole("checkbox")).not.toBeChecked();
  await shareDialog.getByRole("button", { name: "Copy link" }).click();
  const sharedUrl = await page.evaluate(() => navigator.clipboard.readText());
  expect(sharedUrl).toContain("#share=");
  expect(sharedUrl).not.toContain("?share=");
});

test("canonical and language alternate URLs are consistent", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://comparelist.org");
  await expect(page.locator('link[hreflang="zh"]')).toHaveAttribute("href", "https://comparelist.org/zh/");

  await page.goto("/zh");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://comparelist.org/zh/");
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", "https://comparelist.org");

  await page.goto("/en");
  await expect(page).toHaveURL("http://localhost:43127/");
  await page.goto("/compare-csv-columns");
  await expect(page).toHaveURL("http://localhost:43127/compare-csv-files");
  await page.goto("/compare-two-columns-excel");
  await expect(page).toHaveURL("http://localhost:43127/compare-excel-columns");
  await page.goto("/pricing");
  await expect(page).toHaveURL("http://localhost:43127/");

  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("comparelist.org/en/");
  expect(sitemap).not.toContain("/pricing");
  expect(sitemap).not.toContain("/compare-csv-columns");
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();

  const manifest = await (await page.request.get("/manifest.webmanifest")).json();
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons).toHaveLength(2);
  await expect.poll(async () => page.evaluate(async () => Boolean((await navigator.serviceWorker.ready).active))).toBe(true);
});

test.describe("mobile comparison experience", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("keeps primary controls readable and results accessible", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Tool", exact: true })).toBeHidden();
    await expect(page.getByRole("button", { name: "Swap lists" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Local projects" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.getByRole("button", { name: "Try Demo" }).click();
    await expect(page.getByRole("heading", { name: "Results", exact: true })).toBeVisible();
    await expect(page.getByRole("tab")).toHaveCount(6);
    await expect(page.getByRole("button", { name: "Export" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.getByRole("button", { name: "Export" }).click();
    await expect(page.getByRole("menuitem", { name: "Download CSV" })).toBeVisible();

    await page.getByRole("button", { name: "Local projects" }).click();
    const dialog = page.getByRole("dialog", { name: "Local projects" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Local projects" })).toBeFocused();
  });
});
