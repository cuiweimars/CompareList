"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const tools = [
  { href: "/compare-email-lists", message: "tools.0.label" },
  { href: "/compare-excel-columns", message: "tools.1.label" },
  { href: "/compare-csv-files", message: "tools.2.label" },
  { href: "/compare-ip-addresses", message: "tools.4.label" },
  { href: "/compare-keywords", message: "tools.5.label" },
  { href: "/compare-name-lists", message: "tools.6.label" },
  { href: "/compare-phone-numbers", message: "tools.7.label" },
  { href: "/compare-urls", message: "tools.8.label" },
  { href: "/list-diff", message: "tools.9.label" },
  { href: "/remove-duplicates-from-list", message: "tools.10.label" },
];

const guides = [
  { href: "/how-to-compare-two-lists", label: "How to Compare Two Lists" },
  { href: "/how-to-compare-csv-files", label: "How to Compare CSV Files" },
  { href: "/how-to-find-differences", label: "How to Find Differences" },
];

export default function RelatedTools({ current }: { current: string }) {
  const t = useTranslations("components.relatedTools");
  const otherTools = tools.filter((tool) => tool.href !== current);
  return (
    <section className="py-8 border-t border-border">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">{t("title")}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {otherTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="text-sm px-3 py-2 rounded-lg border border-border hover:border-primary/40 hover:bg-surface-alt/30 transition-all text-text-secondary hover:text-text"
          >
            {t(tool.message)}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        {guides.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="text-xs text-text-muted hover:text-primary transition-colors"
          >
            {t(`guides.${guides.indexOf(g)}.label`)}
          </Link>
        ))}
      </div>
    </section>
  );
}
