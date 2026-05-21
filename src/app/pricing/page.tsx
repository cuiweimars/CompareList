"use client";

import { ArrowRightLeft, Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    icon: <Zap size={20} />,
    features: [
      "Exact list comparison",
      "Unlimited items",
      "Copy & CSV export",
      "File upload (TXT, CSV)",
      "All comparison options",
      "Privacy-first (client-side)",
    ],
    cta: "Start Free",
    href: "/#tool",
    highlighted: false,
  },
  {
    name: "Pay Per Use",
    price: "$0.99",
    period: "per AI comparison",
    icon: <Sparkles size={20} />,
    features: [
      "Everything in Free",
      "AI fuzzy matching",
      "Semantic similarity detection",
      "AI-generated insights",
      "Typo & reorder detection",
      "No subscription needed",
    ],
    cta: "Buy Credits",
    href: "/#tool",
    highlighted: true,
  },
  {
    name: "Credit Packs",
    price: "$4.99",
    period: "10 credits (save 33%)",
    icon: <Crown size={20} />,
    features: [
      "Everything in Pay Per Use",
      "10 AI comparisons",
      "Best value per comparison",
      "Credits never expire",
      "Priority processing",
      "Bulk analysis support",
    ],
    cta: "Get Credit Pack",
    href: "/#tool",
    highlighted: false,
  },
];

export default function PricingPage() {
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
          <Link href="/" className="text-sm text-text-secondary hover:text-text transition-colors">
            Back to Tool
          </Link>
        </div>
      </header>

      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            Simple, Transparent Pricing
          </h1>
          <p className="text-text-secondary text-lg">
            Free for exact comparisons. Pay only when you need AI-powered analysis.
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
                  Most Popular
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
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4 text-left">
            {[
              { q: "Do credits expire?", a: "No. Your credits never expire. Use them whenever you need AI comparison." },
              { q: "What counts as one AI comparison?", a: "One AI comparison means comparing two lists with fuzzy matching, semantic analysis, and AI-generated insights. It uses 1 credit regardless of list size." },
              { q: "Is the free version limited?", a: "The free version gives you full exact comparison with no limits on items, file uploads, or exports. AI features (fuzzy matching, insights) require credits." },
              { q: "Can I get a refund?", a: "Yes. If you're not satisfied with the AI analysis quality, contact us for a full refund." },
            ].map((faq) => (
              <div key={faq.q}>
                <h4 className="font-medium text-sm mb-1">{faq.q}</h4>
                <p className="text-sm text-text-secondary">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-border text-center text-sm text-text-muted">
        <Link href="/" className="hover:text-text transition-colors">CompareList</Link> &middot; Free Online List Comparison Tool
      </footer>
    </div>
  );
}
