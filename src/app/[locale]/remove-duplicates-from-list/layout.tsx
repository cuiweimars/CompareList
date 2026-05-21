import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/remove-duplicates-from-list";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "Remove Duplicates from List Online Free - Instant Deduplication | CompareList",
    description:
      "Free online tool to remove duplicates from any list. Paste your list and get a clean, deduplicated result instantly. Works with emails, names, IDs, and any text data.",
    keywords: ["remove duplicates from list", "deduplicate list", "remove duplicate entries", "list deduplication tool", "find duplicates"],
    openGraph: {
      title: "Remove Duplicates from List - Free Online Tool",
      description: "Paste any list to instantly remove duplicate entries. Free, private, and instant.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Remove Duplicates from List - Free Online Tool",
      description: "Paste any list to instantly remove duplicate entries. Free, private, and instant.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function RemoveDuplicatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
