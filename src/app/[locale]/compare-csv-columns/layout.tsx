import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/compare-csv-columns";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "Compare CSV Columns Online Free - Find Matching Values Instantly | CompareList",
    description:
      "Free CSV column comparison tool. Find matching values, unique entries, and differences between two CSV columns. No signup, works with any delimiter.",
    keywords: [
      "compare csv columns",
      "compare two csv columns",
      "csv column comparison",
      "find matching values csv",
      "compare csv data online",
      "csv column diff",
    ],
    openGraph: {
      title: "Compare CSV Columns Online - Free Tool",
      description: "Find matching values, unique entries, and differences between two CSV columns instantly.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Compare CSV Columns Online - Free Tool",
      description: "Find matching values, unique entries, and differences between two CSV columns instantly.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function CompareCsvColumnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
