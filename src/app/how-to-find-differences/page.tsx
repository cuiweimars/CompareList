import type { Metadata } from "next";
import { ArrowRightLeft, ArrowRight, Check } from "lucide-react";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "How to Find Differences Between Two Lists - Free Guide | CompareList",
  description:
    "Learn how to find differences between two lists. Discover items only in list A, only in list B, and common items. Includes exact and AI-powered fuzzy matching methods.",
  keywords: [
    "find differences between lists",
    "list difference finder",
    "items only in one list",
    "compare lists find differences",
    "list diff tool",
    "symmetric difference lists",
  ],
  openGraph: {
    title: "How to Find Differences Between Two Lists",
    description: "Free guide to finding differences between lists using exact matching and AI fuzzy matching.",
  },
};

export default function HowToFindDifferencesPage() {
  const methods = [
    {
      title: "Exact Matching",
      badge: "Free",
      desc: "Compares items character-by-character. Items match only if they are identical (with optional case-insensitive comparison). Fast and deterministic.",
      best: "Emails, IDs, product codes, exact strings",
    },
    {
      title: "AI Fuzzy Matching",
      badge: "1 Credit",
      desc: "Uses Levenshtein distance and token-based similarity to find near-matches. Catches typos, reordered words, and similar entries that exact matching misses.",
      best: 'Names ("John Smith" vs "Smith, John"), addresses, keywords with typos',
    },
  ];

  const terms = [
    { term: "Only in A", desc: "Items present in List A but not found in List B." },
    { term: "Only in B", desc: "Items present in List B but not found in List A." },
    { term: "In Both (Intersection)", desc: "Items present in both List A and List B." },
    { term: "Union", desc: "All unique items from both lists combined." },
    { term: "Symmetric Difference", desc: "Items in either list but not in both (Only in A + Only in B)." },
  ];

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", path: "/" },
        { name: "Tutorials", path: "/" },
        { name: "How to Find Differences", path: "/how-to-find-differences" },
      ]} />
      <header className="border-b border-border bg-surface/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ArrowRightLeft size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg font-[family-name:var(--font-sora)]">CompareList</span>
          </a>
          <span className="text-text-muted text-sm">/ Tutorials</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Tutorial</span>
          <h1 className="text-4xl font-bold font-[family-name:var(--font-sora)] mt-3 mb-4">
            How to Find Differences Between Two Lists
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            A practical guide to identifying what&apos;s different and what&apos;s the same between any two lists, using both exact and AI-powered methods.
          </p>
        </div>

        {/* Methods */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-6">Two Ways to Find Differences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {methods.map((m, i) => (
              <div key={i} className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-lg font-[family-name:var(--font-sora)]">{m.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${i === 0 ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                    {m.badge}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{m.desc}</p>
                <div className="text-xs text-text-muted">
                  <strong className="text-text-secondary">Best for:</strong> {m.best}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Terms */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-6">Understanding the Results</h2>
          <div className="space-y-3">
            {terms.map((t, i) => (
              <div key={i} className="glass rounded-xl p-5 flex items-start gap-4">
                <div className="w-28 shrink-0">
                  <span className="text-sm font-semibold text-primary">{t.term}</span>
                </div>
                <p className="text-sm text-text-secondary">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Example */}
        <div className="glass rounded-xl p-6 mb-12">
          <h2 className="font-semibold text-lg mb-4 font-[family-name:var(--font-sora)]">Practical Example</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#818cf8]">List A (Old Subscribers)</h3>
              <div className="bg-surface-alt/30 rounded-lg p-4 font-mono text-sm text-text-secondary space-y-1">
                <p>alice@gmail.com</p>
                <p>bob@yahoo.com</p>
                <p>charlie@hotmail.com</p>
                <p>david@company.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#22d3ee]">List B (New Subscribers)</h3>
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
              <h4 className="text-xs font-medium text-amber-500 mb-1">Only in A (2)</h4>
              <p className="text-sm font-mono text-text-secondary">alice@gmail.com, david@company.com</p>
              <p className="text-xs text-text-muted mt-1">Unsubscribed / Churned</p>
            </div>
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3">
              <h4 className="text-xs font-medium text-cyan-500 mb-1">Only in B (2)</h4>
              <p className="text-sm font-mono text-text-secondary">emma@outlook.com, frank@gmail.com</p>
              <p className="text-xs text-text-muted mt-1">New subscribers</p>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
              <h4 className="text-xs font-medium text-green-500 mb-1">In Both (2)</h4>
              <p className="text-sm font-mono text-text-secondary">bob@yahoo.com, charlie@hotmail.com</p>
              <p className="text-xs text-text-muted mt-1">Retained subscribers</p>
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
            <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-3">Find Differences Now</h2>
            <p className="text-text-secondary mb-6">Paste your lists and get instant results — free and private.</p>
            <a href="/" className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-base font-semibold text-white rounded-xl">
              Start Comparing <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
