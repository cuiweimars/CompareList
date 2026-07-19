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
  await expect(panel.getByRole("cell", { name: "status" })).toBeVisible();
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
});
