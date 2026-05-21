import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/pricing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "Pricing - Free List Comparison Tool | CompareList",
    description:
      "CompareList is completely free. Compare two lists instantly with exact matching and AI-powered fuzzy matching. No signup, no credit card required.",
    keywords: ["comparelist pricing", "free list comparison tool", "compare lists free"],
    openGraph: {
      title: "CompareList Pricing - Free List Comparison Tool",
      description: "CompareList is completely free. Compare two lists instantly with exact matching and AI-powered fuzzy matching.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "CompareList Pricing - Free List Comparison Tool",
      description: "CompareList is completely free. Compare two lists instantly with exact matching and AI-powered fuzzy matching.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
