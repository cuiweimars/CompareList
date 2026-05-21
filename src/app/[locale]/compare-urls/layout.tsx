import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/compare-urls";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "Compare URL Lists Online Free - Sitemap & Backlink Comparison | CompareList",
    description:
      "Free URL comparison tool. Find differences between two URL lists. Compare sitemaps, backlink lists, or crawled pages. Works with Ahrefs, Moz, and SEMrush exports.",
    keywords: [
      "compare url lists",
      "url comparison tool",
      "compare sitemaps",
      "compare backlink lists",
      "find duplicate urls",
      "url diff tool",
    ],
    openGraph: {
      title: "Compare Two URL Lists Online - Free Tool",
      description: "Find differences between two URL lists. Compare sitemaps, backlinks, or crawled pages.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Compare Two URL Lists Online - Free Tool",
      description: "Find differences between two URL lists. Compare sitemaps, backlinks, or crawled pages.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function CompareUrlsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
