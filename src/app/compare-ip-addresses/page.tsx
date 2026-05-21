"use client";

import { useState } from "react";
import { ArrowRightLeft, Globe, ChevronDown, ChevronUp } from "lucide-react";
import ListInput from "@/components/ListInput";
import OptionsPanel from "@/components/OptionsPanel";
import StatsCards from "@/components/StatsCards";
import ResultTabs from "@/components/ResultTabs";
import { compareLists, CompareResult } from "@/lib/compare";
import RelatedTools from "@/components/RelatedTools";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const DEMO_A = `192.168.1.1
192.168.1.100
10.0.0.1
10.0.0.50
172.16.0.1
172.16.0.254
192.168.2.1
8.8.8.8`;

const DEMO_B = `192.168.1.1
192.168.1.200
10.0.0.1
10.0.0.100
172.16.0.1
172.16.0.100
1.1.1.1
8.8.4.4`;

export default function CompareIPAddressesPage() {
  const [listA, setListA] = useState("");
  const [listB, setListB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({
    caseSensitive: true, trimWhitespace: true, removeDuplicates: true, ignoreEmpty: true,
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
        { name: "Compare IP Addresses", path: "/compare-ip-addresses" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Compare IP Addresses - CompareList",
            description: "Find matching, unique, and overlapping IP addresses between two lists. Supports IPv4 addresses with exact matching.",
            url: "https://comparelist.org/compare-ip-addresses",
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
            <Globe size={14} className="text-primary" />
            IP Address Comparison
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold font-[family-name:var(--font-sora)] mb-4">
            Compare IP Address Lists
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Find matching, unique, and overlapping IP addresses between two lists. Supports IPv4 addresses with exact matching.
          </p>
        </div>

        <div className="glass-elevated rounded-2xl p-5 lg:p-7 gradient-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <ListInput label="Network A" labelColor="#818cf8" value={listA} onChange={setListA} placeholder="Paste IP addresses here..." />
            <ListInput label="Network B" labelColor="#22d3ee" value={listB} onChange={setListB} placeholder="Paste IP addresses here..." />
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

        <div className="mt-16 space-y-8">
          <div className="glass rounded-xl p-6">
            <h2 className="font-semibold text-lg mb-3 font-[family-name:var(--font-sora)]">IP Address Comparison Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Firewall Rule Audit", desc: "Compare allowed IPs across different firewall configurations." },
                { title: "Network Inventory", desc: "Find active IPs present in one scan but missing from another." },
                { title: "Access Control Review", desc: "Compare whitelists and blacklists between systems." },
                { title: "Incident Response", desc: "Cross-reference suspicious IPs against known threat lists." },
              ].map((uc, i) => (
                <div key={i} className="bg-surface-alt/30 rounded-lg p-3">
                  <h3 className="font-medium text-sm mb-1">{uc.title}</h3>
                  <p className="text-xs text-text-secondary">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <RelatedTools current="/compare-ip-addresses" />
      </main>
    </div>
  );
}
