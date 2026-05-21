import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/compare-name-lists";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "Compare Name Lists Online Free - Find Matching Names Instantly | CompareList",
    description:
      "Free name list comparison tool. Find matching names, unique entries, and duplicates between two name lists. Works with CSV, Excel, and text. Private and instant.",
    keywords: [
      "compare name lists",
      "compare two name lists",
      "find matching names",
      "name list comparison",
      "compare names online",
      "find duplicate names",
    ],
    openGraph: {
      title: "Compare Two Name Lists Online - Free Tool",
      description: "Find matching names, unique entries, and duplicates between two name lists instantly.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Compare Two Name Lists Online - Free Tool",
      description: "Find matching names, unique entries, and duplicates between two name lists instantly.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function CompareNameListsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
