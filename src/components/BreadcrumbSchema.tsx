"use client";

import JsonLd from "@/components/JsonLd";
import { useLocale } from "next-intl";
import { localizedUrl } from "@/lib/seo";

export default function BreadcrumbSchema({ items }: { items: { name: string; path: string }[] }) {
  const locale = useLocale();
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
        item: localizedUrl(locale, item.path),
    })),
  };
  return <JsonLd data={schema} />;
}
