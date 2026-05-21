"use client";

import { useState } from "react";
import { ArrowRightLeft, ListChecks, ChevronDown, ChevronUp } from "lucide-react";
import ListInput from "@/components/ListInput";
import StatsCards from "@/components/StatsCards";
import ResultTabs from "@/components/ResultTabs";
import { compareLists, CompareResult } from "@/lib/compare";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export default function RemoveDuplicatesFromListPage() {
  const [listA, setListA] = useState("");
  const [listB, setListB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [showFaq, setShowFaq] = useState<number | null>(null);

  function handleCompare() {
    if (!listA.trim()) return;
    setResult(compareLists(listA, listB || "", {
      caseSensitive: false, trimWhitespace: true, removeDuplicates: true, ignoreEmpty: true,
    }));
  }

  const deduped = listA.trim() ? [...new Set(listA.split(/[\n,;\t]+/).map(s => s.trim()).filter(s => s))].join("\n") : "";
  const totalRaw = listA.trim() ? listA.split(/[\n,;\t]+/).map(s => s.trim()).filter(s => s).length : 0;
  const totalDedup = deduped ? deduped.split("\n").length : 0;
  const dupCount = totalRaw - totalDedup;

  const faqs = [
    { q: "How do I remove duplicates from a list?", a: "Paste your list into the text area above (one item per line) and click Remove Duplicates. You'll instantly get a clean list with all duplicates removed." },
    { q: "Does it remove duplicates across both lists?", a: "If you paste two lists, the tool shows you which items are shared (duplicates across lists) and which are unique to each. For a single list, it removes internal duplicates." },
    { q: "Is it case-sensitive?", a: "By default, no. 'Apple' and 'apple' are treated as the same item. This matches how most people expect deduplication to work." },
    { q: "Can I remove duplicates from an Excel column?", a: "Yes. Copy the column from Excel and paste it directly into the text area. The deduplicated result can be copied back to Excel." },
    { q: "What counts as a duplicate?", a: "Items that are identical after trimming whitespace. Empty lines are ignored. By default, comparison is case-insensitive." },
  ];

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={[{ name: "Home", path: "/" }, { name: "Remove Duplicates from List", path: "/remove-duplicates-from-list" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Remove Duplicates from List - CompareList",
            description: "Free online tool to remove duplicates from any list. Paste your list and get a clean, deduplicated result instantly.",
            url: "https://comparelist.org/remove-duplicates-from-list",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />

      <header className="border-b border-border bg-surface/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ArrowRightLeft size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl font-[family-name:var(--font-sora)]">Compare<span className="hero-gradient-text">List</span></span>
          </a>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface/50 text-sm text-text-muted mb-4">
            <ListChecks size={14} className="text-primary" />
            Deduplication Tool
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-sora)] mb-4">
            Remove Duplicates from List
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Paste any list to instantly remove duplicate entries. Free, private, and works entirely in your browser.
          </p>
        </div>

        <div className="glass-elevated rounded-2xl p-5 lg:p-7 gradient-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <ListInput label="Your List" labelColor="#818cf8" value={listA} onChange={setListA} placeholder="Paste your list with duplicates..." />
            <div className="space-y-4">
              <ListInput label="Second List (optional)" labelColor="#22d3ee" value={listB} onChange={setListB} placeholder="Paste a second list to find cross-list duplicates..." />
              {listA.trim() && (
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-text-secondary">Deduplicated Result</h3>
                    <span className="text-xs text-text-muted">{totalDedup} items ({dupCount} duplicates removed)</span>
                  </div>
                  <div className="bg-surface-alt/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <pre className="text-sm text-text-secondary whitespace-pre-wrap font-mono">{deduped}</pre>
                  </div>
                  {deduped && (
                    <button
                      onClick={() => navigator.clipboard.writeText(deduped)}
                      className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      Copy to clipboard
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button onClick={handleCompare} disabled={!listA.trim()}
              className="btn-primary px-8 py-2.5 text-sm font-semibold text-white rounded-xl">
              Remove Duplicates
            </button>
          </div>
          {result && (
            <div className="space-y-4 mt-6">
              <StatsCards stats={result.stats} />
              <ResultTabs onlyInA={result.onlyInA} onlyInB={result.onlyInB} inBoth={result.inBoth} />
            </div>
          )}
        </div>

        <div className="mt-16 space-y-8">
          <div className="glass rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-3 font-[family-name:var(--font-sora)]">Common Deduplication Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Email List Cleanup", desc: "Remove duplicate email addresses before sending campaigns to avoid double-emailing." },
                { title: "Contact Deduplication", desc: "Merge contact lists from different sources and remove overlapping entries." },
                { title: "Data Cleaning", desc: "Clean up messy datasets by removing repeated values before analysis." },
                { title: "Inventory Management", desc: "Find and remove duplicate SKUs or product codes across inventory lists." },
              ].map((uc, i) => (
                <div key={i} className="bg-surface-alt/30 rounded-lg p-3">
                  <h3 className="font-medium text-sm mb-1">{uc.title}</h3>
                  <p className="text-xs text-text-secondary">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-4 font-[family-name:var(--font-sora)]">FAQ</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden">
                  <button onClick={() => setShowFaq(showFaq === i ? null : i)}
                    className="w-full px-5 py-4 text-left text-sm font-medium flex items-center justify-between hover:bg-surface-alt/20 transition-colors">
                    {faq.q}
                    {showFaq === i ? <ChevronUp size={16} className="text-text-muted shrink-0" /> : <ChevronDown size={16} className="text-text-muted shrink-0" />}
                  </button>
                  {showFaq === i && <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>

          <RelatedTools current="/remove-duplicates-from-list" />
        </div>
      </main>
    </div>
  );
}
