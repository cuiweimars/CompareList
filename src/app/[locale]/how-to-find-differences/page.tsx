import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRightLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { safeJsonLd } from "@/lib/seo";

const basePath = "/how-to-find-differences";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "howToFindDifferences" });
  return buildMetadata({
    locale,
    path: basePath,
    title: `${t("hero.title")} | CompareList`,
    description: t("hero.subtitle"),
  });
}

export default async function HowToFindDifferencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("howToFindDifferences");

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", path: "/" },
        { name: "Tutorials", path: "/" },
        { name: "How to Find Differences", path: "/how-to-find-differences" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: t("jsonLd.name"),
            description: t("jsonLd.description"),
            author: { "@type": "Organization", name: "CompareList" },
            publisher: { "@type": "Organization", name: "CompareList", logo: { "@type": "ImageObject", url: "https://comparelist.org/favicon-32.png" } },
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
            <span className="text-text-muted text-sm">/ {t('hero.badge')}</span>
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

        {/* Methods */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-6">{t('methods.heading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-lg font-[family-name:var(--font-sora)]">{t(`methods.${i}.title`)}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${i === 0 ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                    {t(`methods.${i}.badge`)}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{t(`methods.${i}.desc`)}</p>
                <div className="text-xs text-text-muted">
                  <strong className="text-text-secondary">{t('methods.bestFor')}</strong> {t(`methods.${i}.best`)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Terms */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-6">{t('terms.heading')}</h2>
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="glass rounded-xl p-5 flex items-start gap-4">
                <div className="w-28 shrink-0">
                  <span className="text-sm font-semibold text-primary">{t(`terms.${i}.term`)}</span>
                </div>
                <p className="text-sm text-text-secondary">{t(`terms.${i}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Example */}
        <div className="glass rounded-xl p-6 mb-12">
          <h2 className="font-semibold text-lg mb-4 font-[family-name:var(--font-sora)]">{t('example.heading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#818cf8]">{t('example.listA.title')}</h3>
              <div className="bg-surface-alt/30 rounded-lg p-4 font-mono text-sm text-text-secondary space-y-1">
                <p>alice@gmail.com</p>
                <p>bob@yahoo.com</p>
                <p>charlie@hotmail.com</p>
                <p>david@company.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#22d3ee]">{t('example.listB.title')}</h3>
              <div className="bg-surface-alt/30 rounded-lg p-4 font-mono text-sm text-text-secondary space-y-1">
                <p>bob@yahoo.com</p>
                <p>charlie@hotmail.com</p>
                <p>emma@outlook.com</p>
                <p>frank@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
              <h4 className="text-xs font-medium text-amber-500 mb-1">{t('example.onlyA.title')}</h4>
              <p className="text-sm font-mono text-text-secondary">alice@gmail.com, david@company.com</p>
              <p className="text-xs text-text-muted mt-1">{t('example.onlyA.desc')}</p>
            </div>
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3">
              <h4 className="text-xs font-medium text-cyan-500 mb-1">{t('example.onlyB.title')}</h4>
              <p className="text-sm font-mono text-text-secondary">emma@outlook.com, frank@gmail.com</p>
              <p className="text-xs text-text-muted mt-1">{t('example.onlyB.desc')}</p>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
              <h4 className="text-xs font-medium text-green-500 mb-1">{t('example.both.title')}</h4>
              <p className="text-sm font-mono text-text-secondary">bob@yahoo.com, charlie@hotmail.com</p>
              <p className="text-xs text-text-muted mt-1">{t('example.both.desc')}</p>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mb-16">
          <RelatedTools current="/how-to-find-differences" />
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
