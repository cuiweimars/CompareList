import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRightLeft, ArrowRight, FileSpreadsheet, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "How to Compare Two CSV Files Online - Free CSV Comparison Guide | CompareList",
  description:
    "Learn how to compare two CSV files online for free. Find differences between CSV files, compare specific columns, and export comparison results. Step-by-step tutorial.",
  keywords: [
    "compare csv files",
    "compare two csv files",
    "csv comparison tool",
    "find differences in csv",
    "compare csv columns",
    "csv diff tool",
  ],
  openGraph: {
    title: "How to Compare Two CSV Files Online",
    description: "Free guide to comparing CSV files. Find differences, compare columns, and export results instantly.",
  },
  alternates: { canonical: "https://comparelist.com/how-to-compare-csv-files" },
  twitter: {
    card: "summary_large_image",
    title: "How to Compare Two CSV Files Online",
    description: "Free guide to comparing CSV files. Find differences, compare columns, and export results instantly.",
  },
};

export default async function HowToCompareCSVFilesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("howToCompareCsvFiles");

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", path: "/" },
        { name: "Tutorials", path: "/" },
        { name: "How to Compare CSV Files", path: "/how-to-compare-csv-files" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: t("jsonLd.name"),
            description: t("jsonLd.description"),
            totalTime: "PT2M",
            step: [0, 1, 2, 3].map((i) => ({
              "@type": "HowToStep",
              name: t(`steps.${i}.title`),
              text: t(`steps.${i}.desc`),
            })),
          }),
        }}
      />
      <header className="border-b border-border bg-surface/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <ArrowRightLeft size={14} className="text-white" />
              </div>
              <span className="font-bold text-lg font-[family-name:var(--font-sora)]">CompareList</span>
            </Link>
            <span className="text-text-muted text-sm">/ {t('nav.tutorials')}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">{t('hero.badge')}</span>
          <h1 className="text-4xl font-bold font-[family-name:var(--font-sora)] mt-3 mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Why compare CSVs */}
        <div className="glass rounded-xl p-6 mb-12">
          <h2 className="font-semibold text-lg mb-4 font-[family-name:var(--font-sora)]">{t('whyCompare.heading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Check size={16} className="text-success mt-1 shrink-0" />
                <div>
                  <h3 className="font-medium text-sm mb-1">{t(`whyCompare.${i}.title`)}</h3>
                  <p className="text-xs text-text-secondary">{t(`whyCompare.${i}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)]">{t('steps.heading')}</h2>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0 border border-border">
                  <span className="text-lg font-bold font-[family-name:var(--font-sora)] hero-gradient-text">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 font-[family-name:var(--font-sora)]">{t(`steps.${i}.title`)}</h3>
                  <p className="text-text-secondary leading-relaxed">{t(`steps.${i}.desc`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supported Formats */}
        <div className="glass rounded-xl p-6 mb-12">
          <h2 className="font-semibold text-lg mb-4 font-[family-name:var(--font-sora)]">{t('formats.heading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <FileSpreadsheet size={18} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-medium text-sm mb-1">{t(`formats.${i}.name`)}</h3>
                  <p className="text-xs text-text-secondary">{t(`formats.${i}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mb-16">
          <RelatedTools current="/how-to-compare-csv-files" />
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="glass rounded-2xl p-8 gradient-border glow-primary inline-block">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-3">{t('cta.title')}</h2>
            <p className="text-text-secondary mb-6">{t('cta.subtitle')}</p>
            <Link href="/" className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-base font-semibold text-white rounded-xl">
              {t('cta.button')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
