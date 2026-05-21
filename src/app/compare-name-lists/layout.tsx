import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Name Lists - CompareList | Free Online Tool",
  description:
    "Compare two name lists instantly. Find differences, common names, and unique entries. Free, private, no signup required.",
};

export default function CompareNameListsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
