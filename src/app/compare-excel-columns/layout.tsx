import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Excel Columns - CompareList | Free Online Tool",
  description:
    "Compare two Excel columns instantly. Find differences, common values, and unique entries. Free, private, no signup required.",
};

export default function CompareExcelColumnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
