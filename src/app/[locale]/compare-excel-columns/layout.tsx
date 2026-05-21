import type { Metadata } from "next";

export const metadata: Metadata = {
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
  alternates: { canonical: "https://comparelist.com/compare-excel-columns" },
  twitter: {
    card: "summary_large_image",
    title: "Compare Two Excel Columns Online - Free Tool",
    description: "Find matching values, unique entries, and differences between two Excel columns. No formulas needed.",
  },
};

export default function CompareExcelColumnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
