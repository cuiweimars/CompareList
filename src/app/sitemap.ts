import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo";

const paths = [
  "",
  "/about",
  "/privacy",
  "/compare-csv-files",
  "/compare-email-lists",
  "/compare-excel-columns",
  "/compare-ip-addresses",
  "/compare-keywords",
  "/compare-name-lists",
  "/compare-phone-numbers",
  "/compare-urls",
  "/list-diff",
  "/remove-duplicates-from-list",
  "/how-to-compare-two-lists",
  "/how-to-compare-csv-files",
  "/how-to-find-differences",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      alternates: {
        languages: Object.fromEntries([
          ...routing.locales.map((language) => [language, localizedUrl(language, path)]),
          ["x-default", localizedUrl(routing.defaultLocale, path)],
        ]),
      },
    }))
  );
}
