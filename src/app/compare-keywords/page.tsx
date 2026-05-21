"use client";

import { useState } from "react";
import { ArrowRightLeft, Search, ChevronDown, ChevronUp } from "lucide-react";
import ListInput from "@/components/ListInput";
import OptionsPanel from "@/components/OptionsPanel";
import StatsCards from "@/components/StatsCards";
import VennDiagram from "@/components/VennDiagram";
import ResultTabs from "@/components/ResultTabs";
import { compareLists, CompareResult } from "@/lib/compare";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export default function CompareKeywordsPage() {
  const [listA, setListA] = useState("");
  const [listB, setListB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showFaq, setShowFaq] = useState<number | null>(null);
  const [options, setOptions] = useState({
    caseSensitive: false, trimWhitespace: true, removeDuplicates: true, ignoreEmpty: true,
  });

  function handleCompare() {
    if (!listA.trim() && !listB.trim()) return;
    setResult(compareLists(listA, listB, options));
  }

  const faqs = [
    { q: "How do I compare two keyword lists?", a: "Paste your first keyword list into List A and the second into List B (one keyword per line). Click Compare to see which keywords are shared, unique to each list, and get overlap statistics." },
    { q: "Can I compare keywords from different SEO tools?", a: "Yes. Export keyword lists from Ahrefs, SEMrush, Google Search Console, or any other tool, then paste them here to find overlaps and gaps." },
    { q: "Does it handle keyword variations?", a: "By default, comparison is exact (case-insensitive). For detecting similar keywords like 'running shoes' vs 'shoes for running', use the AI Match mode." },
    { q: "How can I find keyword gaps?", a: "Compare your target keyword list against a competitor's ranked keywords. Items 'Only in B' represent keyword gaps - keywords your competitor ranks for but you don't target." },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", path: "/" },
        { name: "Compare Keywords", path: "/compare-keywords" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Compare Keywords - CompareList",
            description: "Find overlapping keywords, keyword gaps, and unique opportunities between two keyword lists. Free SEO tool.",
            url: "https://comparelist.com/compare-keywords",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ArrowRightLeft size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg">Compare<span className="text-primary">List</span></span>
          </a>
          <a href="/" className="text-sm text-text-secondary hover:text-text transition-colors">All Tools</a>
        </div>
      </header>

      <section className="py-10 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Search size={24} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Compare Keyword Lists Online</h1>
          <p className="text-text-secondary text-lg">
            Find overlapping keywords, keyword gaps, and unique opportunities between two keyword lists. Free SEO tool.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-12 -mt-2">
        <div className="bg-white rounded-2xl border border-border shadow-lg p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <ListInput label="Keyword List A" labelColor="#6366f1" value={listA} onChange={setListA} placeholder="Paste your first keyword list..." />
            <ListInput label="Keyword List B" labelColor="#06b6d4" value={listB} onChange={setListB} placeholder="Paste your second keyword list..." />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <button onClick={() => setShowOptions(!showOptions)} className="text-xs text-text-secondary hover:text-text flex items-center gap-1">
              {showOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Options
            </button>
            {showOptions && <OptionsPanel {...options} onChange={setOptions} />}
            <button onClick={handleCompare} disabled={!listA.trim() && !listB.trim()}
              className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
              Compare Keywords
            </button>
          </div>
          {result && (
            <div className="space-y-4">
              <StatsCards stats={result.stats} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <VennDiagram totalA={result.stats.totalA} totalB={result.stats.totalB} common={result.stats.common} onlyA={result.stats.uniqueA} onlyB={result.stats.uniqueB} />
                <div className="lg:col-span-2">
                  <ResultTabs onlyInA={result.onlyInA} onlyInB={result.onlyInB} inBoth={result.inBoth} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">SEO Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Keyword Gap Analysis", desc: "Compare your keyword list with a competitor's to discover keyword opportunities you're missing." },
              { title: "Content Planning", desc: "Compare keywords from different topics to find overlapping terms and plan content clusters." },
              { title: "Search Console Audit", desc: "Compare keywords you rank for vs keywords you target to find optimization opportunities." },
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
        <h2 className="text-2xl font-bold text-center mb-6">FAQ</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              <button onClick={() => setShowFaq(showFaq === i ? null : i)}
                className="w-full px-5 py-4 text-left text-sm font-medium flex items-center justify-between hover:bg-gray-50">
                {faq.q}
                {showFaq === i ? <ChevronUp size={16} className="text-text-muted shrink-0" /> : <ChevronDown size={16} className="text-text-muted shrink-0" />}
              </button>
              {showFaq === i && <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <RelatedTools current="/compare-keywords" />
      </div>

      <footer className="py-6 border-t border-border text-center text-sm text-text-muted">
        <a href="/" className="hover:text-text transition-colors">CompareList</a> &middot; Free Keyword List Comparison Tool
      </footer>
    </div>
  );
}
