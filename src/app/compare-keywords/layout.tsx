import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Keyword Lists Online Free - SEO Keyword Gap Analysis | CompareList",
  description:
    "Free SEO keyword comparison tool. Find overlapping keywords, keyword gaps, and unique opportunities between two keyword lists. Compare Ahrefs, SEMrush, or GSC exports.",
  keywords: [
    "compare keyword lists",
    "keyword gap analysis",
    "seo keyword comparison",
    "compare keywords from different tools",
    "keyword overlap tool",
    "find keyword gaps",
  ],
  openGraph: {
    title: "Compare Keyword Lists Online - Free SEO Tool",
    description: "Find overlapping keywords, keyword gaps, and unique opportunities between two keyword lists.",
  },
};

export default function CompareKeywordsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
