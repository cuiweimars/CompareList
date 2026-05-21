import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Keywords - CompareList | Free Online Tool",
  description:
    "Compare two keyword lists instantly. Find differences, common keywords, and unique entries. Free, private, no signup required.",
};

export default function CompareKeywordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
