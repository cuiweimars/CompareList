import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/compare-two-columns-excel";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "Compare Two Columns in Excel Online Free - No Formulas Needed | CompareList",
    description:
      "Compare two Excel columns online for free. Find matching values, unique entries, and duplicates instantly. No VLOOKUP or formulas needed. Copy-paste and compare.",
    keywords: ["compare two columns in excel", "compare excel columns", "find matching values in two columns", "excel column comparison"],
    openGraph: {
      title: "Compare Two Excel Columns Online - Free Tool",
      description: "Paste two Excel columns to find matches, differences, and duplicates. No formulas needed.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Compare Two Excel Columns Online - Free Tool",
      description: "Paste two Excel columns to find matches, differences, and duplicates. No formulas needed.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function CompareTwoColumnsExcelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
