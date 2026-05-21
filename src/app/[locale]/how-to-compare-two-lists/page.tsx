import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRightLeft, Zap, Shield, Globe, ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const basePath = "/how-to-compare-two-lists";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comparelist.com";

  return {
    title: "How to Compare Two Lists Online - Free Step-by-Step Guide | CompareList",
    description:
      "Learn how to compare two lists online for free. Find common items, differences, and unique entries between any two lists instantly. Step-by-step tutorial with examples.",
    keywords: [
      "how to compare two lists",
      "compare two lists online",
      "compare two lists step by step",
      "find common items in two lists",
      "list comparison tutorial",
    ],
    openGraph: {
      title: "How to Compare Two Lists Online - Free Guide",
      description: "Step-by-step tutorial for comparing two lists online. Find differences, common items, and unique entries instantly.",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "How to Compare Two Lists Online - Free Guide",
      description: "Step-by-step tutorial for comparing two lists online. Find differences, common items, and unique entries instantly.",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === "en" ? "" : locale + "/"}${basePath.slice(1)}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}${basePath}`])
      ),
    },
  };
}

export default async function HowToCompareTwoListsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("howToCompareTwoLists");

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", path: "/" },
        { name: "Tutorials", path: "/" },
        { name: "How to Compare Two Lists", path: "/how-to-compare-two-lists" },
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
            step: [0, 1, 2, 3, 4].map((i) => ({
              "@type": "HowToStep",
              name: t(`steps.${i}.title`),
              text: t(`steps.${i}.desc`),
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
      {/* Header */}
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
        {/* Hero */}
        <div className="mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">{t('hero.badge')}</span>
          <h1 className="text-4xl font-bold font-[family-name:var(--font-sora)] mt-3 mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Quick Summary */}
        <div className="glass rounded-xl p-6 mb-12">
          <h2 className="font-semibold text-lg mb-4 font-[family-name:var(--font-sora)]">{t('quickSummary.heading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><Zap size={16} /></div>
              <div>
                <h3 className="font-medium text-sm mb-1">{t('quickSummary.0.title')}</h3>
                <p className="text-xs text-text-secondary">{t('quickSummary.0.desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><Shield size={16} /></div>
              <div>
                <h3 className="font-medium text-sm mb-1">{t('quickSummary.1.title')}</h3>
                <p className="text-xs text-text-secondary">{t('quickSummary.1.desc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><Globe size={16} /></div>
              <div>
                <h3 className="font-medium text-sm mb-1">{t('quickSummary.2.title')}</h3>
                <p className="text-xs text-text-secondary">{t('quickSummary.2.desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)]">{t('steps.heading')}</h2>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="glass rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0 border border-border">
                  <span className="text-lg font-bold font-[family-name:var(--font-sora)] hero-gradient-text">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 font-[family-name:var(--font-sora)]">{t(`steps.${i}.title`)}</h3>
                  <p className="text-text-secondary leading-relaxed mb-3">{t(`steps.${i}.desc`)}</p>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm text-text-secondary">
                    <strong className="text-primary">{t('steps.tipLabel')}</strong> {t(`steps.${i}.tip`)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-6">{t('useCases.heading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass rounded-xl p-5 hover:border-border-active transition-colors">
                <h3 className="font-medium text-base mb-1.5 font-[family-name:var(--font-sora)]">{t(`useCases.${i}.title`)}</h3>
                <p className="text-sm text-text-secondary">{t(`useCases.${i}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-6">{t('faq.heading')}</h2>
          <div className="space-y-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="glass rounded-xl p-5">
                <h3 className="font-medium text-base mb-2">{t(`faq.${i}.q`)}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{t(`faq.${i}.a`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mb-16">
          <RelatedTools current="/how-to-compare-two-lists" />
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
