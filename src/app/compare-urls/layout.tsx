import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare URLs - CompareList | Free Online Tool",
  description:
    "Compare two URL lists instantly. Find differences, common URLs, and unique entries. Free, private, no signup required.",
};

export default function CompareUrlsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
