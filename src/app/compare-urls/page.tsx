"use client";

import { useState } from "react";
import { ArrowRightLeft, Link, ChevronDown, ChevronUp } from "lucide-react";
import ListInput from "@/components/ListInput";
import OptionsPanel from "@/components/OptionsPanel";
import StatsCards from "@/components/StatsCards";
import ResultTabs from "@/components/ResultTabs";
import { compareLists, CompareResult } from "@/lib/compare";
import RelatedTools from "@/components/RelatedTools";

export default function CompareUrlsPage() {
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
    { q: "How do I compare two lists of URLs?", a: "Paste one list of URLs into List A and the other into List B, one URL per line. Click Compare to instantly see which URLs are unique to each list and which appear in both." },
    { q: "Does it compare full URLs or just domains?", a: "By default, it compares full URLs as-is. For domain-level comparison, you can enable Case Sensitive off (default) so HTTP vs https differences are handled." },
    { q: "Can I compare sitemaps or crawl data?", a: "Yes. Export URLs from your sitemap XML or crawl tool (like Screaming Frog) as a text list, then paste them here to compare." },
    { q: "What about trailing slashes and www prefixes?", a: "These are treated as different entries by default. Use the Trim Whitespace option and consider normalizing your URLs before comparing for best results." },
  ];

  return (
    <div className="flex flex-col min-h-screen">
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
            <Link size={24} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Compare Two URL Lists Online</h1>
          <p className="text-text-secondary text-lg">
            Find differences between two lists of URLs. Compare sitemaps, backlink lists, or crawled pages.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-12 -mt-2">
        <div className="bg-white rounded-2xl border border-border shadow-lg p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <ListInput label="URL List A" labelColor="#6366f1" value={listA} onChange={setListA} placeholder="Paste your first URL list, one per line..." />
            <ListInput label="URL List B" labelColor="#06b6d4" value={listB} onChange={setListB} placeholder="Paste your second URL list, one per line..." />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <button onClick={() => setShowOptions(!showOptions)} className="text-xs text-text-secondary hover:text-text flex items-center gap-1">
              {showOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Options
            </button>
            {showOptions && <OptionsPanel {...options} onChange={setOptions} />}
            <button onClick={handleCompare} disabled={!listA.trim() && !listB.trim()}
              className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
              Compare URLs
            </button>
          </div>
          {result && (
            <div className="space-y-4">
              <StatsCards stats={result.stats} />
              <ResultTabs onlyInA={result.onlyInA} onlyInB={result.onlyInB} inBoth={result.inBoth} />
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Common Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "SEO & Sitemaps", desc: "Compare old vs new sitemaps to find missing or new pages after a site migration or redesign." },
              { title: "Backlink Analysis", desc: "Compare backlink lists from different tools (Ahrefs, Moz, SEMrush) to find unique and overlapping links." },
              { title: "Broken Link Audit", desc: "Compare crawled URLs against your current page inventory to identify broken links and orphan pages." },
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
        <RelatedTools current="/compare-urls" />
      </div>

      <footer className="py-6 border-t border-border text-center text-sm text-text-muted">
        <a href="/" className="hover:text-text transition-colors">CompareList</a> &middot; Free Online URL Comparison Tool
      </footer>
    </div>
  );
}
