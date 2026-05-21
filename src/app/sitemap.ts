import type { MetadataRoute } from "next";

const baseUrl = "https://comparelist.org";

const locales = ["en", "zh", "ja", "es", "fr", "de"];

const paths = [
  "",
  "/pricing",
  "/compare-csv-files",
  "/compare-csv-columns",
  "/compare-email-lists",
  "/compare-excel-columns",
  "/compare-ip-addresses",
  "/compare-keywords",
  "/compare-name-lists",
  "/compare-phone-numbers",
  "/compare-two-columns-excel",
  "/compare-urls",
  "/list-diff",
  "/remove-duplicates-from-list",
  "/how-to-compare-two-lists",
  "/how-to-compare-csv-files",
  "/how-to-find-differences",
];

const toolPages = new Set([
  "compare-csv-files",
  "compare-email-lists",
  "compare-excel-columns",
  "compare-ip-addresses",
  "compare-keywords",
  "compare-name-lists",
  "compare-phone-numbers",
  "compare-two-columns-excel",
  "compare-urls",
  "list-diff",
  "remove-duplicates-from-list",
]);

const guidePages = new Set([
  "how-to-compare-two-lists",
  "how-to-compare-csv-files",
  "how-to-find-differences",
]);

function getPriority(path: string): number {
  if (path === "") return 1;
  if (path === "/pricing") return 0.6;
  const segment = path.slice(1);
  if (toolPages.has(segment)) return 0.8;
  if (guidePages.has(segment)) return 0.7;
  return 0.5;
}

function getFrequency(path: string): "weekly" | "monthly" {
  return path === "" ? "weekly" : "monthly";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: getFrequency(path),
      priority: getPriority(path),
    }))
  );
}
