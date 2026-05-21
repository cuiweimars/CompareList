"use client";

import { useState } from "react";
import { ArrowRightLeft, Phone, ChevronDown, ChevronUp } from "lucide-react";
import ListInput from "@/components/ListInput";
import OptionsPanel from "@/components/OptionsPanel";
import StatsCards from "@/components/StatsCards";
import ResultTabs from "@/components/ResultTabs";
import { compareLists, CompareResult } from "@/lib/compare";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const DEMO_A = `+1 (555) 123-4567
+1-555-234-5678
(555) 345-6789
+1 555 456 7890
555-567-8901
+1 (555) 678-9012
+1-555-789-0123`;

const DEMO_B = `+15551234567
+1-555-234-5678
555-345-6789
(555) 456-7890
5555678901
+1 555 678 9012
+1-555-999-0000`;

export default function ComparePhoneNumbersPage() {
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

  function handleDemo() {
    setListA(DEMO_A); setListB(DEMO_B);
    setResult(compareLists(DEMO_A, DEMO_B, options));
  }

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={[
        { name: "Home", path: "/" },
        { name: "Compare Phone Numbers", path: "/compare-phone-numbers" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Compare Phone Numbers - CompareList",
            description: "Find matching, missing, and duplicate phone numbers between two lists. Works with all formats including international numbers.",
            url: "https://comparelist.org/compare-phone-numbers",
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
        {/* SEO Content */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface/50 text-sm text-text-muted mb-4">
            <Phone size={14} className="text-primary" />
            Phone Number Comparison
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-sora)] mb-4">
            Compare Phone Number Lists Online
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Find matching, missing, and duplicate phone numbers between two lists. Works with all formats including international numbers.
          </p>
        </div>

        {/* Tool */}
        <div className="glass-elevated rounded-2xl p-5 lg:p-7 gradient-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <ListInput label="List A" labelColor="#818cf8" value={listA} onChange={setListA} placeholder="Paste phone numbers here..." />
            <ListInput label="List B" labelColor="#22d3ee" value={listB} onChange={setListB} placeholder="Paste phone numbers here..." />
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => setShowOptions(!showOptions)} className="text-sm text-text-muted hover:text-text-secondary flex items-center gap-1.5">
              {showOptions ? <ChevronUp size={15} /> : <ChevronDown size={15} />} Options
            </button>
            <div className="flex items-center gap-3">
              <button onClick={handleDemo} className="px-5 py-2.5 text-sm text-text-muted border border-border rounded-xl hover:bg-surface-alt/50 transition-all">
                Try Demo
              </button>
              <button onClick={handleCompare} disabled={!listA.trim() && !listB.trim()}
                className="btn-primary px-8 py-2.5 text-sm font-semibold text-white rounded-xl">
                Compare Lists
              </button>
            </div>
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

        {/* SEO Footer Content */}
        <div className="mt-16 space-y-8">
          <div className="glass rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-3 font-[family-name:var(--font-sora)]">How Phone Number Comparison Works</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Phone numbers can appear in many different formats: with or without country codes, with different separators (dashes, spaces, dots, parentheses), and with or without the + prefix. Our comparison tool normalizes these differences so you can accurately match phone numbers regardless of formatting. For the most accurate results, use case-insensitive comparison and enable whitespace trimming.
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-3 font-[family-name:var(--font-sora)]">Common Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "CRM Deduplication", desc: "Find and merge duplicate contacts across CRM systems." },
                { title: "Call List Reconciliation", desc: "Compare outreach lists to avoid calling the same number twice." },
                { title: "Do-Not-Call Compliance", desc: "Cross-reference your call lists against DNC registries." },
                { title: "Contact Migration", desc: "Verify all phone numbers transferred correctly between systems." },
              ].map((uc, i) => (
                <div key={i} className="bg-surface-alt/30 rounded-lg p-3">
                  <h3 className="font-medium text-sm mb-1">{uc.title}</h3>
                  <p className="text-xs text-text-secondary">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <RelatedTools current="/compare-phone-numbers" />
      </main>
    </div>
  );
}
