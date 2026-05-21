import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/list-diff";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "List Diff Tool - Find Differences Between Two Lists Online Free | CompareList",
    description:
      "Free list diff tool. Compare two lists and instantly see added items, removed items, and unchanged items. Like git diff but for lists. Export results as CSV.",
    keywords: [
      "list diff",
      "compare two lists",
      "list difference tool",
      "find differences between lists",
      "list comparison online",
      "diff two lists",
    ],
    openGraph: {
      title: "List Diff - Find Differences Between Two Lists",
      description: "Compare two lists and instantly see what's different. Added, removed, and unchanged items.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "List Diff - Find Differences Between Two Lists",
      description: "Compare two lists and instantly see what's different. Added, removed, and unchanged items.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function ListDiffLayout({ children }: { children: React.ReactNode }) {
  return children;
}
