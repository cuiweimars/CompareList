"use client";

import { useState } from "react";
import { ArrowRightLeft, FileSpreadsheet, ChevronDown, ChevronUp } from "lucide-react";
import ListInput from "@/components/ListInput";
import OptionsPanel from "@/components/OptionsPanel";
import StatsCards from "@/components/StatsCards";
import ResultTabs from "@/components/ResultTabs";
import { compareLists, CompareResult } from "@/lib/compare";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export default function CompareCSVColumnsPage() {
  const [listA, setListA] = useState("");
  const [listB, setListB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({
    caseSensitive: false,
    trimWhitespace: true,
    removeDuplicates: true,
    ignoreEmpty: true,
  });

  function handleCompare() {
    if (!listA.trim() && !listB.trim()) return;
    setResult(compareLists(listA, listB, options));
  }

  return (
    <div className="flex flex-col min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", path: "/" },
        { name: "Compare Name Lists", path: "/compare-name-lists" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Compare Name Lists - CompareList",
            description: "Find differences between two columns of data from CSV or Excel files. Paste, compare, export.",
            url: "https://comparelist.org/compare-name-lists",
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
            <span className="font-bold text-lg">
              Compare<span className="text-primary">List</span>
            </span>
          </a>
          <a href="/" className="text-sm text-text-secondary hover:text-text transition-colors">All Tools</a>
        </div>
      </header>

      <section className="py-10 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileSpreadsheet size={24} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            Compare Two CSV Columns Online
          </h1>
          <p className="text-text-secondary text-lg">
            Find differences between two columns of data from CSV or Excel files. Paste, compare, export.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl border border-border shadow-lg p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <ListInput label="Column A" labelColor="#6366f1" value={listA} onChange={setListA} placeholder="Paste your first column data here..." />
            <ListInput label="Column B" labelColor="#06b6d4" value={listB} onChange={setListB} placeholder="Paste your second column data here..." />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-xs text-text-secondary hover:text-text flex items-center gap-1 transition-colors"
            >
              {showOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Options
            </button>
            {showOptions && <OptionsPanel {...options} onChange={setOptions} />}
            <button
              onClick={handleCompare}
              disabled={!listA.trim() && !listB.trim()}
              className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
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
          <h2 className="text-2xl font-bold text-center mb-6">How to Compare CSV Columns</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Copy Column Data", desc: "Open your CSV or Excel file, select the column you want to compare, and copy it." },
              { step: "2", title: "Paste Into Tool", desc: "Paste each column into the respective text area. Data can be separated by newlines, commas, or tabs." },
              { step: "3", title: "Compare & Export", desc: "Click Compare to see differences. Export results as CSV for further analysis in your spreadsheet." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  {s.step}
                </div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <RelatedTools current="/compare-name-lists" />
      </div>

      <footer className="py-6 border-t border-border text-center text-sm text-text-muted">
        <a href="/" className="hover:text-text transition-colors">CompareList</a> &middot; Free Online List Comparison Tool
      </footer>
    </div>
  );
}
