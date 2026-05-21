import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/compare-email-lists";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "Compare Two Email Lists Online Free - Find Duplicates & Subscribers | CompareList",
    description:
      "Free email list comparison tool. Find duplicate subscribers, unique addresses, and common emails between two lists instantly. No signup, 100% private.",
    keywords: [
      "compare email lists",
      "email list comparison",
      "find duplicate emails",
      "compare subscriber lists",
      "email deduplication tool",
      "compare two email lists online",
    ],
    openGraph: {
      title: "Compare Two Email Lists Online - Free Tool",
      description: "Find duplicate subscribers, unique addresses, and common emails between two lists instantly.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Compare Two Email Lists Online - Free Tool",
      description: "Find duplicate subscribers, unique addresses, and common emails between two lists instantly.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function CompareEmailListsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
