"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const tools = [
  { href: "/compare-email-lists", label: "Compare Email Lists" },
  { href: "/compare-excel-columns", label: "Compare Excel Columns" },
  { href: "/compare-csv-files", label: "Compare CSV Files" },
  { href: "/compare-two-columns-excel", label: "Compare Two Columns in Excel" },
  { href: "/compare-ip-addresses", label: "Compare IP Addresses" },
  { href: "/compare-keywords", label: "Compare Keywords" },
  { href: "/compare-name-lists", label: "Compare Name Lists" },
  { href: "/compare-phone-numbers", label: "Compare Phone Numbers" },
  { href: "/compare-urls", label: "Compare URLs" },
  { href: "/list-diff", label: "List Diff" },
  { href: "/remove-duplicates-from-list", label: "Remove Duplicates" },
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
            {t(`tools.${tools.indexOf(tool)}.label`)}
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
