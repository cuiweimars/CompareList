import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Name Lists Online Free - Find Matching Names Instantly | CompareList",
  description:
    "Free name list comparison tool. Find matching names, unique entries, and duplicates between two name lists. Works with CSV, Excel, and text. Private and instant.",
  keywords: [
    "compare name lists",
    "compare two name lists",
    "find matching names",
    "name list comparison",
    "compare names online",
    "find duplicate names",
  ],
  openGraph: {
    title: "Compare Two Name Lists Online - Free Tool",
    description: "Find matching names, unique entries, and duplicates between two name lists instantly.",
  },
};

export default function CompareNameListsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
