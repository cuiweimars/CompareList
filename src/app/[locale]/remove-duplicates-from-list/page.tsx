"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRightLeft, ListChecks, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ListInput from "@/components/ListInput";
import { parseList } from "@/lib/compare";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { localizedUrl, safeJsonLd } from "@/lib/seo";
import { copyToClipboard } from "@/lib/export";

export default function RemoveDuplicatesFromListPage() {
  const t = useTranslations("removeDuplicatesFromList");
  const locale = useLocale();
  const [listA, setListA] = useState("");
  const [showFaq, setShowFaq] = useState<number | null>(null);

  const rawItems = parseList(listA, { removeDuplicates: false });
  const dedupedItems = parseList(listA, { removeDuplicates: true });
  const deduped = dedupedItems.join("\n");
  const totalRaw = rawItems.length;
  const totalDedup = dedupedItems.length;
  const dupCount = totalRaw - totalDedup;

  function downloadDeduped() {
    const blob = new Blob([deduped], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "comparelist-deduplicated.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={[{ name: "Home", path: "/" }, { name: "Remove Duplicates from List", path: "/remove-duplicates-from-list" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: t("jsonLd.name"),
            description: t("jsonLd.description"),
            url: localizedUrl(locale, "/remove-duplicates-from-list"),
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [0, 1, 2, 3, 4].map((i) => ({
              "@type": "Question",
              name: t(`faq.${i}.q`),
              acceptedAnswer: { "@type": "Answer", text: t(`faq.${i}.a`) },
            })),
          }),
        }}
      />

      <header className="border-b border-border bg-surface/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ArrowRightLeft size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl font-[family-name:var(--font-sora)]">Compare<span className="hero-gradient-text">List</span></span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface/50 text-sm text-text-muted mb-4">
            <ListChecks size={14} className="text-primary" />
            {t('hero.badge')}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-sora)] mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        <div className="glass-elevated rounded-2xl p-5 lg:p-7 gradient-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <ListInput label={t('listInput.listA')} labelColor="#818cf8" value={listA} onChange={setListA} placeholder={t('listInput.placeholderA')} />
            <div className="space-y-4">
              {listA.trim() && (
                <div className="glass rounded-xl p-4 min-h-[460px] flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-text-secondary">{t('result.heading')}</h3>
                    <span className="text-xs text-text-muted">{t('result.stats', { count: totalDedup, dupCount })}</span>
                  </div>
                  <div className="bg-surface-alt/30 rounded-lg p-3 flex-1 min-h-64 max-h-[360px] overflow-y-auto">
                    <pre className="text-sm text-text-secondary whitespace-pre-wrap font-mono">{deduped}</pre>
                  </div>
                  {deduped && (
                    <div className="flex items-center gap-4 mt-3">
                      <button onClick={() => copyToClipboard(deduped)} className="text-xs text-primary hover:text-primary/80 transition-colors">{t('actions.copyToClipboard')}</button>
                      <button onClick={downloadDeduped} className="text-xs text-primary hover:text-primary/80 transition-colors">{t('actions.download')}</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-8">
          <div className="glass rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-3 font-[family-name:var(--font-sora)]">{t('useCases.heading')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="bg-surface-alt/30 rounded-lg p-3">
                  <h3 className="font-medium text-sm mb-1">{t(`useCases.${i}.title`)}</h3>
                  <p className="text-xs text-text-secondary">{t(`useCases.${i}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4 font-[family-name:var(--font-sora)]">{t('faq.heading')}</h2>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden">
                  <button onClick={() => setShowFaq(showFaq === i ? null : i)}
                    className="w-full px-5 py-4 text-left text-sm font-medium flex items-center justify-between hover:bg-surface-alt/20 transition-colors">
                    {t(`faq.${i}.q`)}
                    {showFaq === i ? <ChevronUp size={16} className="text-text-muted shrink-0" /> : <ChevronDown size={16} className="text-text-muted shrink-0" />}
                  </button>
                  {showFaq === i && <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{t(`faq.${i}.a`)}</div>}
                </div>
              ))}
            </div>
          </div>

          <RelatedTools current="/remove-duplicates-from-list" />
        </div>
      </main>
    </div>
  );
}
