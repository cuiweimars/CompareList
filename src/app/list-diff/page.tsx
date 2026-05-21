"use client";

import { useState } from "react";
import { ArrowRightLeft, GitCompare, ChevronDown, ChevronUp } from "lucide-react";
import ListInput from "@/components/ListInput";
import OptionsPanel from "@/components/OptionsPanel";
import StatsCards from "@/components/StatsCards";
import VennDiagram from "@/components/VennDiagram";
import ResultTabs from "@/components/ResultTabs";
import { compareLists, CompareResult } from "@/lib/compare";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export default function ListDiffPage() {
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
    { q: "What is list diff?", a: "List diff is the process of finding the differences between two lists. It shows you items that exist only in the first list, only in the second list, and items common to both." },
    { q: "How is this different from text diff?", a: "Text diff compares text line by line in order. List diff treats each item independently regardless of order, like set operations in math (union, intersection, difference)." },
    { q: "Can I diff large lists?", a: "Yes. The tool handles lists with tens of thousands of items smoothly, since all processing happens in your browser using efficient set algorithms." },
    { q: "What output formats are supported?", a: "You can copy results to clipboard, download as CSV, or download as plain text. Each category (only in A, only in B, common) can be exported separately." },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", path: "/" },
        { name: "List Diff", path: "/list-diff" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "List Diff - CompareList",
            description: "Compare two lists and instantly see what's different. Get added items, removed items, and unchanged items.",
            url: "https://comparelist.org/list-diff",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
            <GitCompare size={24} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">List Diff - Find Differences Between Lists</h1>
          <p className="text-text-secondary text-lg">
            Compare two lists and instantly see what's different. Get added items, removed items, and unchanged items.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-12 -mt-2">
        <div className="bg-white rounded-2xl border border-border shadow-lg p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <ListInput label="Original List" labelColor="#6366f1" value={listA} onChange={setListA} placeholder="Paste your original list here..." />
            <ListInput label="New List" labelColor="#06b6d4" value={listB} onChange={setListB} placeholder="Paste your new list here..." />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <button onClick={() => setShowOptions(!showOptions)} className="text-xs text-text-secondary hover:text-text flex items-center gap-1">
              {showOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Options
            </button>
            {showOptions && <OptionsPanel {...options} onChange={setOptions} />}
            <button onClick={handleCompare} disabled={!listA.trim() && !listB.trim()}
              className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
              Diff Lists
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
          <h2 className="text-2xl font-bold text-center mb-6">How List Diff Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Removed Items", desc: "Items in your original list that are missing from the new list. Think of these as 'deleted' entries.", color: "#f59e0b" },
              { title: "Added Items", desc: "Items in your new list that weren't in the original. These are the 'newly added' entries.", color: "#06b6d4" },
              { title: "Unchanged Items", desc: "Items present in both lists. These entries stayed the same between versions.", color: "#10b981" },
            ].map((cat) => (
              <div key={cat.title} className="p-5 rounded-xl border border-border">
                <div className="w-3 h-3 rounded-full mb-3" style={{ backgroundColor: cat.color }} />
                <h3 className="font-semibold mb-2">{cat.title}</h3>
                <p className="text-sm text-text-secondary">{cat.desc}</p>
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
        <RelatedTools current="/list-diff" />
      </div>

      <footer className="py-6 border-t border-border text-center text-sm text-text-muted">
        <a href="/" className="hover:text-text transition-colors">CompareList</a> &middot; Free Online List Diff Tool
      </footer>
    </div>
  );
}
