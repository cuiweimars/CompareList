import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare CSV Columns - CompareList | Free Online Tool",
  description:
    "Compare two CSV columns instantly. Find differences, common values, and unique entries. Free, private, no signup required.",
};

export default function CompareCsvColumnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
