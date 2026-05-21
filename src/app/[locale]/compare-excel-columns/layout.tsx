import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/compare-excel-columns";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "Compare Excel Columns Online Free - No VLOOKUP Needed | CompareList",
    description:
      "Compare two Excel columns instantly without formulas. Find matching values, unique entries, and differences. Works with Google Sheets too. Free and private.",
    keywords: [
      "compare excel columns",
      "compare two columns in excel",
      "find matching values excel",
      "excel column comparison",
      "compare columns without VLOOKUP",
      "google sheets column compare",
    ],
    openGraph: {
      title: "Compare Two Excel Columns Online - Free Tool",
      description: "Find matching values, unique entries, and differences between two Excel columns. No formulas needed.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Compare Two Excel Columns Online - Free Tool",
      description: "Find matching values, unique entries, and differences between two Excel columns. No formulas needed.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function CompareExcelColumnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
