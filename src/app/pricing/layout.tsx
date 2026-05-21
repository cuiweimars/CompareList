import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Free List Comparison Tool | CompareList",
  description:
    "CompareList is completely free. Compare two lists instantly with exact matching and AI-powered fuzzy matching. No signup, no credit card required.",
  keywords: ["comparelist pricing", "free list comparison tool", "compare lists free"],
  openGraph: {
    title: "CompareList Pricing - Free List Comparison Tool",
    description: "CompareList is completely free. Compare two lists instantly with exact matching and AI-powered fuzzy matching.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
