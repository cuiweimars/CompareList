import type { Metadata } from "next";
import { ArrowRightLeft, Zap, Shield, Globe, ArrowRight, Check } from "lucide-react";
import RelatedTools from "@/components/RelatedTools";

export const metadata: Metadata = {
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
};

export default function HowToCompareTwoListsPage() {
  const steps = [
    {
      num: "1",
      title: "Paste or Upload Your Lists",
      desc: "Copy and paste your first list into List A and your second list into List B. You can also upload TXT, CSV, or TSV files by clicking the Upload button or dragging files directly into the input area.",
      tip: "Lists can contain emails, names, URLs, numbers, keywords, or any text items. Items are auto-detected regardless of separator (newlines, commas, tabs, semicolons).",
    },
    {
      num: "2",
      title: "Choose Your Comparison Mode",
      desc: 'Select "Exact Match" for precise item-by-item comparison, or "AI Match" to find fuzzy matches like typos, reordered names ("John Smith" vs "Smith, John"), and similar entries using DeepSeek AI.',
      tip: "Exact Match is always free. AI Match uses 1 credit per comparison and includes fuzzy matching and intelligent analysis.",
    },
    {
      num: "3",
      title: "Configure Options (Optional)",
      desc: "Click the Options button to toggle case sensitivity, whitespace trimming, duplicate removal, and empty line filtering. Defaults work well for most cases.",
      tip: "Enable case-sensitive matching if you need to distinguish between uppercase and lowercase differences.",
    },
    {
      num: "4",
      title: "Click Compare",
      desc: "Hit the Compare button and get instant results. You'll see statistics, a Venn diagram, and categorized results in tabs.",
      tip: "Results are computed entirely in your browser. Your data is never uploaded to any server.",
    },
    {
      num: "5",
      title: "Explore and Export Results",
      desc: "Browse results in categorized tabs: Only in A, Only in B, In Both, Union, and Symmetric Difference. Use the search bar to filter, sort alphabetically, and export as CSV, TXT, or a full report.",
      tip: "The Full Report export creates a single CSV with all categories clearly labeled — perfect for spreadsheets.",
    },
  ];

  const useCases = [
    { title: "Email List Comparison", desc: "Find subscribers in one list but not another, detect duplicates across campaigns." },
    { title: "Inventory Reconciliation", desc: "Compare product SKUs or item lists between systems to find discrepancies." },
    { title: "Data Cleaning", desc: "Identify and remove duplicate or near-duplicate entries across datasets." },
    { title: "Keyword Research", desc: "Compare keyword lists from different tools to find unique opportunities." },
    { title: "Name Matching", desc: "Find matching names across lists with AI fuzzy matching for spelling variations." },
    { title: "URL Comparison", desc: "Compare sitemaps, backlink lists, or page inventories between sites." },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
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
        {/* Hero */}
        <div className="mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Tutorial</span>
          <h1 className="text-4xl font-bold font-[family-name:var(--font-sora)] mt-3 mb-4">
            How to Compare Two Lists Online
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            A complete guide to finding differences, common items, and unique entries between any two lists — in under 30 seconds.
          </p>
        </div>

        {/* Quick Summary */}
        <div className="glass rounded-xl p-6 mb-12">
          <h2 className="font-semibold text-lg mb-4 font-[family-name:var(--font-sora)]">Quick Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><Zap size={16} /></div>
              <div>
                <h3 className="font-medium text-sm mb-1">Instant Results</h3>
                <p className="text-xs text-text-secondary">Compare thousands of items in milliseconds, entirely in your browser.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><Shield size={16} /></div>
              <div>
                <h3 className="font-medium text-sm mb-1">100% Private</h3>
                <p className="text-xs text-text-secondary">Your data never leaves your device. No server uploads, no tracking.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><Globe size={16} /></div>
              <div>
                <h3 className="font-medium text-sm mb-1">Any Format</h3>
                <p className="text-xs text-text-secondary">Paste text, upload files, drag and drop. Auto-detects delimiters.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)]">Step-by-Step Guide</h2>
          {steps.map((step) => (
            <div key={step.num} className="glass rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0 border border-border">
                  <span className="text-lg font-bold font-[family-name:var(--font-sora)] hero-gradient-text">{step.num}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 font-[family-name:var(--font-sora)]">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed mb-3">{step.desc}</p>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm text-text-secondary">
                    <strong className="text-primary">Tip:</strong> {step.tip}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-6">Common Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCases.map((uc, i) => (
              <div key={i} className="glass rounded-xl p-5 hover:border-border-active transition-colors">
                <h3 className="font-medium text-base mb-1.5 font-[family-name:var(--font-sora)]">{uc.title}</h3>
                <p className="text-sm text-text-secondary">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is there a file size limit?", a: "There is no strict limit. The tool handles tens of thousands of items smoothly since all processing happens locally in your browser." },
              { q: "Can I compare more than two lists?", a: "Currently, the tool compares exactly two lists at a time. For multiple lists, you can compare them pairwise and combine the results." },
              { q: "What is the match rate percentage?", a: "The match rate uses the Dice coefficient formula: 2 × (common items) / (total A + total B). It gives a percentage showing how similar the two lists are." },
              { q: "How does AI fuzzy matching work?", a: "AI matching uses a combination of Levenshtein edit distance and Jaccard token similarity to find items that are similar but not identical — like typos, reordered words, or partial matches." },
              { q: "Is my data stored anywhere?", a: "No. All comparison happens in your browser. Your lists are never sent to any server. History is stored locally in your browser and can be cleared at any time." },
            ].map((faq, i) => (
              <div key={i} className="glass rounded-xl p-5">
                <h3 className="font-medium text-base mb-2">{faq.q}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
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
            <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-3">Ready to Try It?</h2>
            <p className="text-text-secondary mb-6">Compare your first two lists in under 30 seconds — free, private, and instant.</p>
            <a href="/" className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-base font-semibold text-white rounded-xl">
              Start Comparing <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
