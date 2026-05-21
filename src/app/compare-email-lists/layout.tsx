import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Email Lists - CompareList | Free Online Tool",
  description:
    "Compare two email lists instantly. Find differences, common emails, and unique entries. Free, private, no signup required.",
};

export default function CompareEmailListsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
