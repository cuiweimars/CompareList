import type { MetadataRoute } from "next";

const locales = ["en", "zh", "ja", "es", "fr", "de"];
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

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

const priorities: Record<string, number> = {
  "": 1,
  pricing: 0.6,
};

const toolPages = [
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
];

const guidePages = [
  "how-to-compare-two-lists",
  "how-to-compare-csv-files",
  "how-to-find-differences",
];

function getPriority(path: string): number {
  if (priorities[path] !== undefined) return priorities[path];
  const segment = path.slice(1);
  if (toolPages.includes(segment)) return 0.8;
  if (segment.startsWith("compare-") && segment.includes("csv-columns")) return 0.7;
  if (guidePages.includes(segment)) return 0.7;
  return 0.5;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: getPriority(path),
    }))
  );
}
