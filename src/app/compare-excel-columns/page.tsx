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

export default function CompareExcelColumnsPage() {
  const [listA, setListA] = useState("");
  const [listB, setListB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({
    caseSensitive: false, trimWhitespace: true, removeDuplicates: true, ignoreEmpty: true,
  });

  function handleCompare() {
    if (!listA.trim() && !listB.trim()) return;
    setResult(compareLists(listA, listB, options));
  }

  const steps = [
    { step: "1", title: "Open Your Excel File", desc: "Open the Excel or Google Sheets file containing the columns you want to compare." },
    { step: "2", title: "Copy Each Column", desc: "Select the first column, copy it (Ctrl+C), then paste it into List A. Repeat for the second column into List B." },
    { step: "3", title: "Compare & Export", desc: "Click Compare. Download results as CSV to paste back into your spreadsheet." },
  ];

  const faqs = [
    { q: "How do I compare two columns in Excel?", a: "Copy the first column from your Excel file and paste it into the List A text area. Then copy the second column and paste it into List B. Click Compare to instantly see the differences." },
    { q: "Does this work with Google Sheets?", a: "Yes. Copy any column from Google Sheets and paste it directly. The tool handles tab-separated and comma-separated data automatically." },
    { q: "Can I compare columns with numbers?", a: "Yes. The tool compares items as text by default. Use the Case Sensitive option if you need exact matching, or leave it off for flexible comparison." },
    { q: "How do I get results back into Excel?", a: "Click the download button in the results section to export as CSV. You can then open or paste the CSV back into your Excel file." },
  ];

  const [showFaq, setShowFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", path: "/" },
        { name: "Compare Excel Columns", path: "/compare-excel-columns" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Compare Excel Columns - CompareList",
            description: "Quickly find differences between two columns in Excel or Google Sheets. No formulas, no VLOOKUP needed.",
            url: "https://comparelist.org/compare-excel-columns",
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
            <Table size={24} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">Compare Two Excel Columns Online</h1>
          <p className="text-text-secondary text-lg">
            Quickly find differences between two columns in Excel or Google Sheets. No formulas, no VLOOKUP needed.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-12 -mt-2">
        <div className="bg-white rounded-2xl border border-border shadow-lg p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <ListInput label="Column A" labelColor="#6366f1" value={listA} onChange={setListA} placeholder="Paste your first Excel column here..." />
            <ListInput label="Column B" labelColor="#06b6d4" value={listB} onChange={setListB} placeholder="Paste your second Excel column here..." />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <button onClick={() => setShowOptions(!showOptions)} className="text-xs text-text-secondary hover:text-text flex items-center gap-1">
              {showOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Options
            </button>
            {showOptions && <OptionsPanel {...options} onChange={setOptions} />}
            <button onClick={handleCompare} disabled={!listA.trim() && !listB.trim()}
              className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
              Compare Columns
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
          <h2 className="text-2xl font-bold text-center mb-8">How to Compare Excel Columns</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">{s.step}</div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
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
        <RelatedTools current="/compare-excel-columns" />
      </div>

      <footer className="py-6 border-t border-border text-center text-sm text-text-muted">
        <a href="/" className="hover:text-text transition-colors">CompareList</a> &middot; Free Online List Comparison Tool
      </footer>
    </div>
  );
}
