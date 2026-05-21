import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Two Email Lists Online Free - Find Duplicates & Subscribers | CompareList",
  description:
    "Free email list comparison tool. Find duplicate subscribers, unique addresses, and common emails between two lists instantly. No signup, 100% private.",
  keywords: [
    "compare email lists",
    "email list comparison",
    "find duplicate emails",
    "compare subscriber lists",
    "email deduplication tool",
    "compare two email lists online",
  ],
  openGraph: {
    title: "Compare Two Email Lists Online - Free Tool",
    description: "Find duplicate subscribers, unique addresses, and common emails between two lists instantly.",
  },
  alternates: { canonical: "https://comparelist.com/compare-email-lists" },
  twitter: {
    card: "summary_large_image",
    title: "Compare Two Email Lists Online - Free Tool",
    description: "Find duplicate subscribers, unique addresses, and common emails between two lists instantly.",
  },
};

export default function CompareEmailListsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
