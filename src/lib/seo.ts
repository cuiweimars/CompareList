import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

export const BASE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.org"
).replace(/\/$/, "");

export function localizedUrl(locale: string, path = ""): string {
  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  if (!normalizedPath) return `${BASE_URL}${localePrefix}`;
  return `${BASE_URL}${localePrefix}${normalizedPath}`;
}

export function languageAlternates(path = ""): Record<string, string> {
  return Object.fromEntries([
    ...routing.locales.map((locale) => [locale, localizedUrl(locale, path)]),
    ["x-default", localizedUrl(routing.defaultLocale, path)],
  ]);
}

interface BuildMetadataOptions {
  locale: Locale | string;
  path?: string;
  title: string;
  description: string;
}

export function buildMetadata({
  locale,
  path = "",
  title,
  description,
}: BuildMetadataOptions): Metadata {
  const url = localizedUrl(locale, path);

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: "CompareList",
      locale,
      url,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
