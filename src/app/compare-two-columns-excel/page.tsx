"use client";

import { useState } from "react";
import { ArrowRightLeft, Table, ChevronDown, ChevronUp } from "lucide-react";
import ListInput from "@/components/ListInput";
import OptionsPanel from "@/components/OptionsPanel";
import StatsCards from "@/components/StatsCards";
import ResultTabs from "@/components/ResultTabs";
import { compareLists, CompareResult } from "@/lib/compare";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export default function CompareTwoColumnsExcelPage() {
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
    { q: "How do I compare two columns in Excel?", a: "Copy the cells from each column in your Excel file and paste them into List A and List B above. Click Compare to instantly see matching values, unique entries in each column, and statistics." },
    { q: "Do I need to format the data before pasting?", a: "No. Just select the column cells in Excel, copy (Ctrl+C), and paste directly. The tool auto-detects delimiters and handles whitespace." },
    { q: "Can I compare columns from different Excel files?", a: "Yes. Open both files, copy the column you want from each, and paste into List A and List B respectively." },
    { q: "Will it find partial matches or only exact matches?", a: "By default it finds exact matches. Enable AI Match mode to find fuzzy matches like typos, extra spaces, and reordered text." },
    { q: "How is this different from Excel VLOOKUP?", a: "VLOOKUP only checks if a value exists in another column. This tool gives you a complete breakdown: items in both columns, items only in column A, items only in column B, plus statistics and export options." },
  ];

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={[{ name: "Home", path: "/" }, { name: "Compare Excel Columns", path: "/compare-two-columns-excel" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Compare Two Columns in Excel - CompareList",
            description: "Free tool to compare two Excel columns online. Find matches, differences, and unique values instantly without formulas.",
            url: "https://comparelist.org/compare-two-columns-excel",
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
            <Table size={14} className="text-primary" />
            Excel Column Comparison
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-sora)] mb-4">
            Compare Two Columns in Excel
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Paste two Excel columns to find matching values, unique entries, and duplicates. No formulas needed.
          </p>
        </div>

        <div className="glass-elevated rounded-2xl p-5 lg:p-7 gradient-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <ListInput label="Column A" labelColor="#818cf8" value={listA} onChange={setListA} placeholder="Copy and paste your first Excel column..." />
            <ListInput label="Column B" labelColor="#22d3ee" value={listB} onChange={setListB} placeholder="Copy and paste your second Excel column..." />
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => setShowOptions(!showOptions)} className="text-sm text-text-muted hover:text-text-secondary flex items-center gap-1.5">
              {showOptions ? <ChevronUp size={15} /> : <ChevronDown size={15} />} Options
            </button>
            <button onClick={handleCompare} disabled={!listA.trim() && !listB.trim()}
              className="btn-primary px-8 py-2.5 text-sm font-semibold text-white rounded-xl">
              Compare Columns
            </button>
          </div>
          {showOptions && (
            <div className="mt-4 pt-4 border-t border-border">
              <OptionsPanel {...options} onChange={setOptions} />
            </div>
          )}
          {result && (
            <div className="space-y-4 mt-6">
              <StatsCards stats={result.stats} />
              <ResultTabs onlyInA={result.onlyInA} onlyInB={result.onlyInB} inBoth={result.inBoth} />
            </div>
          )}
        </div>

        <div className="mt-16 space-y-8">
          <div className="glass rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-3 font-[family-name:var(--font-sora)]">Why Use This Instead of Excel Formulas?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "No Formulas Needed", desc: "Skip VLOOKUP, MATCH, and conditional formatting. Just paste and compare." },
                { title: "Instant Visual Results", desc: "See matching and unique values in categorized tabs with a clear overview." },
                { title: "Export Ready", desc: "Download results as CSV to bring back into Excel or share with your team." },
                { title: "Works Across Files", desc: "Compare columns from different workbooks without merging files first." },
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

          <RelatedTools current="/compare-two-columns-excel" />
        </div>
      </main>
    </div>
  );
}
