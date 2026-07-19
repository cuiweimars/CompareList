"use client";

import { useState } from "react";
import { ArrowRightLeft, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ListInput from "@/components/ListInput";
import OptionsPanel from "@/components/OptionsPanel";
import StatsCards from "@/components/StatsCards";
import ResultTabs from "@/components/ResultTabs";
import { compareLists, CompareResult, type CompareUiOptions } from "@/lib/compare";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { localizedUrl, safeJsonLd } from "@/lib/seo";

const DEMO_A = `alice@gmail.com
bob@yahoo.com
charlie@hotmail.com
david@company.com
emma@outlook.com
frank@gmail.com
grace@company.com
henry@yahoo.com`;

const DEMO_B = `bob@yahoo.com
charlie@hotmail.com
david@company.com
emma@outlook.com
frank@gmail.com
isabella@protonmail.com
james@company.com
karen@gmail.com
leo@yahoo.com`;

export default function CompareEmailListsPage() {
  const t = useTranslations("compareEmailLists");
  const locale = useLocale();
  const [listA, setListA] = useState("");
  const [listB, setListB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showFaq, setShowFaq] = useState<number | null>(null);

  const [options, setOptions] = useState<CompareUiOptions>({
    caseSensitive: false,
    trimWhitespace: true,
    removeDuplicates: true,
    ignoreEmpty: true,
    delimiter: "auto",
    customDelimiter: "",
    normalization: "email",
  });

  function handleCompare() {
    if (!listA.trim() && !listB.trim()) return;
    setResult(compareLists(listA, listB, options));
  }

  function handleDemo() {
    setListA(DEMO_A);
    setListB(DEMO_B);
    setResult(compareLists(DEMO_A, DEMO_B, options));
  }

  const faqs = [
    { q: t('faq.0.q'), a: t('faq.0.a') },
    { q: t('faq.1.q'), a: t('faq.1.a') },
    { q: t('faq.2.q'), a: t('faq.2.a') },
    { q: t('faq.3.q'), a: t('faq.3.a') },
    { q: t('faq.4.q'), a: t('faq.4.a') },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", path: "/" },
        { name: t('breadcrumbs.current'), path: "/compare-email-lists" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: t('jsonLd.name'),
            description: t('jsonLd.description'),
            url: localizedUrl(locale, "/compare-email-lists"),
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
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ArrowRightLeft size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg">
              Compare<span className="text-primary">List</span>
            </span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <section className="py-10 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail size={24} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            {t('hero.title')}
          </h1>
          <p className="text-text-secondary text-lg">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-12 -mt-2">
        <div className="glass-elevated rounded-2xl border border-border shadow-lg p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <ListInput label={t('listInput.listA')} labelColor="#6366f1" value={listA} onChange={setListA} placeholder={t('listInput.placeholderA')} />
            <ListInput label={t('listInput.listB')} labelColor="#06b6d4" value={listB} onChange={setListB} placeholder={t('listInput.placeholderB')} />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-xs text-text-secondary hover:text-text flex items-center gap-1 transition-colors"
            >
              {showOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {t('actions.options')}
            </button>
            {showOptions && (
              <div className="mt-2">
                <OptionsPanel {...options} onChange={setOptions} />
              </div>
            )}
            <div className="flex items-center gap-2">
              <button onClick={handleDemo} className="px-4 py-2 text-sm text-text-secondary border border-border rounded-lg hover:bg-surface-alt/30 transition-all">
                {t('actions.tryDemo')}
              </button>
              <button
                onClick={handleCompare}
                disabled={!listA.trim() && !listB.trim()}
                className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                {t('actions.compare')}
              </button>
            </div>
          </div>
          {result && (
            <div className="space-y-4">
              <StatsCards stats={result.stats} />
              <ResultTabs onlyInA={result.onlyInA} onlyInB={result.onlyInB} inBoth={result.inBoth} />
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-surface/30 border-t border-border">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">{t('useCases.heading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: t('useCases.0.title'), desc: t('useCases.0.desc') },
              { title: t('useCases.1.title'), desc: t('useCases.1.desc') },
              { title: t('useCases.2.title'), desc: t('useCases.2.desc') },
            ].map((uc) => (
              <div key={uc.title} className="p-5 rounded-xl border border-border">
                <h3 className="font-semibold mb-2">{uc.title}</h3>
                <p className="text-sm text-text-secondary">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">{t('faq.heading')}</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowFaq(showFaq === i ? null : i)}
                className="w-full px-5 py-4 text-left text-sm font-medium flex items-center justify-between hover:bg-surface-alt/30 transition-colors"
              >
                {faq.q}
                {showFaq === i ? <ChevronUp size={16} className="text-text-muted shrink-0" /> : <ChevronDown size={16} className="text-text-muted shrink-0" />}
              </button>
              {showFaq === i && (
                <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-8 max-w-5xl mx-auto px-4">
        <RelatedTools current="/compare-email-lists" />
      </section>

      <footer className="py-6 border-t border-border text-center text-sm text-text-muted">
        <Link href="/" className="hover:text-text transition-colors">CompareList</Link>
      </footer>
    </div>
  );
}
