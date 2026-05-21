import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";
  const now = new Date();

  const toolPages = [
    { path: "/compare-email-lists", priority: 0.8, freq: "monthly" as const },
    { path: "/compare-excel-columns", priority: 0.8, freq: "monthly" as const },
    { path: "/compare-ip-addresses", priority: 0.8, freq: "monthly" as const },
    { path: "/compare-keywords", priority: 0.8, freq: "monthly" as const },
    { path: "/compare-name-lists", priority: 0.8, freq: "monthly" as const },
    { path: "/compare-phone-numbers", priority: 0.8, freq: "monthly" as const },
    { path: "/compare-urls", priority: 0.8, freq: "monthly" as const },
    { path: "/list-diff", priority: 0.8, freq: "monthly" as const },
  ];

  const guidePages = [
    { path: "/how-to-compare-two-lists", priority: 0.7, freq: "monthly" as const },
    { path: "/how-to-compare-csv-files", priority: 0.7, freq: "monthly" as const },
    { path: "/how-to-find-differences", priority: 0.7, freq: "monthly" as const },
  ];

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...toolPages.map((p) => ({ url: `${baseUrl}${p.path}`, lastModified: now, changeFrequency: p.freq, priority: p.priority })),
    ...guidePages.map((p) => ({ url: `${baseUrl}${p.path}`, lastModified: now, changeFrequency: p.freq, priority: p.priority })),
  ];
}
