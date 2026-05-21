import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Two CSV Files Online Free - Find Differences Instantly | CompareList",
  description:
    "Free CSV comparison tool. Upload two CSV files and find differences instantly. Compare specific columns, detect duplicates, and export results. No signup required.",
  keywords: ["compare csv files", "csv comparison tool", "compare two csv", "csv diff", "find differences in csv files"],
  openGraph: {
    title: "Compare Two CSV Files Online - Free Tool",
    description: "Upload two CSV files and find differences instantly. Compare specific columns and export results.",
  },
  alternates: { canonical: "https://comparelist.com/compare-csv-files" },
  twitter: {
    card: "summary_large_image",
    title: "Compare Two CSV Files Online - Free Tool",
    description: "Upload two CSV files and find differences instantly. Compare specific columns and export results.",
  },
};

export default function CompareCsvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
