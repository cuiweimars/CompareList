"use client";

import { useTranslations } from "next-intl";
import { ArrowRightLeft, Check, Sparkles, Zap, Crown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function PricingPage() {
  const t = useTranslations("pricing");

  const plans = [
    {
      name: t("plans.0.name"),
      price: t("plans.0.price"),
      period: t("plans.0.period"),
      icon: <Zap size={20} />,
      features: [
        t("plans.0.features.0"),
        t("plans.0.features.1"),
        t("plans.0.features.2"),
        t("plans.0.features.3"),
        t("plans.0.features.4"),
        t("plans.0.features.5"),
      ],
      cta: t("plans.0.cta"),
      href: "/#tool",
      highlighted: false,
    },
    {
      name: t("plans.1.name"),
      price: t("plans.1.price"),
      period: t("plans.1.period"),
      icon: <Sparkles size={20} />,
      features: [
        t("plans.1.features.0"),
        t("plans.1.features.1"),
        t("plans.1.features.2"),
        t("plans.1.features.3"),
        t("plans.1.features.4"),
        t("plans.1.features.5"),
      ],
      cta: t("plans.1.cta"),
      href: "/#tool",
      highlighted: true,
    },
    {
      name: t("plans.2.name"),
      price: t("plans.2.price"),
      period: t("plans.2.period"),
      icon: <Crown size={20} />,
      features: [
        t("plans.2.features.0"),
        t("plans.2.features.1"),
        t("plans.2.features.2"),
        t("plans.2.features.3"),
        t("plans.2.features.4"),
        t("plans.2.features.5"),
      ],
      cta: t("plans.2.cta"),
      href: "/#tool",
      highlighted: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface text-text">
      <header className="border-b border-border bg-surface/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <ArrowRightLeft size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg">
              Compare<span className="hero-gradient-text">List</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-text-secondary hover:text-text transition-colors">
              {t('nav.backToTool')}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            {t('hero.title')}
          </h1>
          <p className="text-text-secondary text-lg">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border-2 p-6 relative ${
                plan.highlighted
                  ? "border-primary shadow-xl scale-[1.02] bg-surface-alt"
                  : "border-border bg-surface-alt/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                  {t('plans.popular')}
                </div>
              )}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    plan.highlighted ? "bg-primary/10 text-primary" : "bg-surface text-text-secondary"
                  }`}
                >
                  {plan.icon}
                </div>
                <h3 className="font-bold text-lg">{plan.name}</h3>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-text-muted text-sm ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check size={14} className="text-success mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block w-full py-2.5 rounded-lg text-sm font-medium text-center transition-all ${
                  plan.highlighted
                    ? "bg-primary text-white hover:bg-primary-dark shadow-sm"
                    : "border border-border text-text-secondary hover:text-text hover:bg-surface-alt/50"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-surface-alt/30 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold mb-4">{t('faq.heading')}</h2>
          <div className="space-y-4 text-left">
            {[0, 1, 2, 3].map((i) => (
              <div key={i}>
                <h4 className="font-medium text-sm mb-1">{t(`faq.${i}.q`)}</h4>
                <p className="text-sm text-text-secondary">{t(`faq.${i}.a`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-border text-center text-sm text-text-muted">
        <Link href="/" className="hover:text-text transition-colors">CompareList</Link> &middot; {t('footer.tagline')}
      </footer>
    </div>
  );
}
