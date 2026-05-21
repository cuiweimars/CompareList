import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const basePath = "/compare-csv-files";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "Compare Two CSV Files Online Free - Find Differences Instantly | CompareList",
    description:
      "Free CSV comparison tool. Upload two CSV files and find differences instantly. Compare specific columns, detect duplicates, and export results. No signup required.",
    keywords: ["compare csv files", "csv comparison tool", "compare two csv", "csv diff", "find differences in csv files"],
    openGraph: {
      title: "Compare Two CSV Files Online - Free Tool",
      description: "Upload two CSV files and find differences instantly. Compare specific columns and export results.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Compare Two CSV Files Online - Free Tool",
      description: "Upload two CSV files and find differences instantly. Compare specific columns and export results.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default function CompareCsvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
