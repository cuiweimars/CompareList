import type { Metadata } from "next";

export const metadata: Metadata = {
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
    card: "summary_large_image",
    title: "Compare CSV Columns Online - Free Tool",
    description: "Find matching values, unique entries, and differences between two CSV columns instantly.",
  },
  alternates: { canonical: "https://comparelist.com/compare-csv-columns" },
};

export default function CompareCsvColumnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
