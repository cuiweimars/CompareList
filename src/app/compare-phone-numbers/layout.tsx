import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Phone Number Lists Online Free - Match & Deduplicate | CompareList",
  description:
    "Free phone number comparison tool. Find matching, missing, and duplicate phone numbers between two lists. Supports all formats including international numbers. Private.",
  keywords: [
    "compare phone numbers",
    "phone number comparison",
    "compare phone lists",
    "find duplicate phone numbers",
    "phone number deduplication",
    "match phone numbers online",
  ],
  openGraph: {
    title: "Compare Phone Number Lists Online - Free Tool",
    description: "Find matching, missing, and duplicate phone numbers between two lists instantly.",
  },
};

export default function ComparePhoneNumbersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
