import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Diff Tool - Find Differences Between Two Lists Online Free | CompareList",
  description:
    "Free list diff tool. Compare two lists and instantly see added items, removed items, and unchanged items. Like git diff but for lists. Export results as CSV.",
  keywords: [
    "list diff",
    "compare two lists",
    "list difference tool",
    "find differences between lists",
    "list comparison online",
    "diff two lists",
  ],
  openGraph: {
    title: "List Diff - Find Differences Between Two Lists",
    description: "Compare two lists and instantly see what's different. Added, removed, and unchanged items.",
  },
};

export default function ListDiffLayout({ children }: { children: React.ReactNode }) {
  return children;
}
