import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Two Columns in Excel Online Free - No Formulas Needed | CompareList",
  description:
    "Compare two Excel columns online for free. Find matching values, unique entries, and duplicates instantly. No VLOOKUP or formulas needed. Copy-paste and compare.",
  keywords: ["compare two columns in excel", "compare excel columns", "find matching values in two columns", "excel column comparison"],
  openGraph: {
    title: "Compare Two Excel Columns Online - Free Tool",
    description: "Paste two Excel columns to find matches, differences, and duplicates. No formulas needed.",
  },
  alternates: { canonical: "https://comparelist.com/compare-two-columns-excel" },
  twitter: {
    card: "summary_large_image",
    title: "Compare Two Excel Columns Online - Free Tool",
    description: "Paste two Excel columns to find matches, differences, and duplicates. No formulas needed.",
  },
};

export default function CompareTwoColumnsExcelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
