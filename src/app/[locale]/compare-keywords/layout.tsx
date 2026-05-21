import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/compare-keywords";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "Compare Keyword Lists Online Free - SEO Keyword Gap Analysis | CompareList",
    description:
      "Free SEO keyword comparison tool. Find overlapping keywords, keyword gaps, and unique opportunities between two keyword lists. Compare Ahrefs, SEMrush, or GSC exports.",
    keywords: [
      "compare keyword lists",
      "keyword gap analysis",
      "seo keyword comparison",
      "compare keywords from different tools",
      "keyword overlap tool",
      "find keyword gaps",
    ],
    openGraph: {
      title: "Compare Keyword Lists Online - Free SEO Tool",
      description: "Find overlapping keywords, keyword gaps, and unique opportunities between two keyword lists.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Compare Keyword Lists Online - Free SEO Tool",
      description: "Find overlapping keywords, keyword gaps, and unique opportunities between two keyword lists.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function CompareKeywordsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
