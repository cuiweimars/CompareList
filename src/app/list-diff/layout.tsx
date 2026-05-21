import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Diff - CompareList | Free Online Tool",
  description:
    "Compare two lists and find the diff instantly. Find differences, common items, and unique entries. Free, private, no signup required.",
};

export default function ListDiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
