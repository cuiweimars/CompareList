import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remove Duplicates from List Online Free - Instant Deduplication | CompareList",
  description:
    "Free online tool to remove duplicates from any list. Paste your list and get a clean, deduplicated result instantly. Works with emails, names, IDs, and any text data.",
  keywords: ["remove duplicates from list", "deduplicate list", "remove duplicate entries", "list deduplication tool", "find duplicates"],
  openGraph: {
    title: "Remove Duplicates from List - Free Online Tool",
    description: "Paste any list to instantly remove duplicate entries. Free, private, and instant.",
  },
};

export default function RemoveDuplicatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
