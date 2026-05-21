import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/compare-phone-numbers";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "Compare Phone Number Lists Online Free - Match & Deduplicate | CompareList",
    description:
      "Free phone number comparison tool. Find matching, missing, and duplicate phone numbers between two lists. Supports all formats including international numbers. Private.",
    keywords: [
      "compare phone numbers",
      "phone number comparison",
      "compare phone lists",
      "find duplicate phone numbers",
      "phone number deduplication",
      "match phone numbers online",
    ],
    openGraph: {
      title: "Compare Phone Number Lists Online - Free Tool",
      description: "Find matching, missing, and duplicate phone numbers between two lists instantly.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Compare Phone Number Lists Online - Free Tool",
      description: "Find matching, missing, and duplicate phone numbers between two lists instantly.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function ComparePhoneNumbersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
