import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare URL Lists Online Free - Sitemap & Backlink Comparison | CompareList",
  description:
    "Free URL comparison tool. Find differences between two URL lists. Compare sitemaps, backlink lists, or crawled pages. Works with Ahrefs, Moz, and SEMrush exports.",
  keywords: [
    "compare url lists",
    "url comparison tool",
    "compare sitemaps",
    "compare backlink lists",
    "find duplicate urls",
    "url diff tool",
  ],
  openGraph: {
    title: "Compare Two URL Lists Online - Free Tool",
    description: "Find differences between two URL lists. Compare sitemaps, backlinks, or crawled pages.",
  },
};

export default function CompareUrlsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
