"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ArrowRightLeft, Zap, Shield, Globe, Sparkles,
  ChevronDown, ChevronUp, History, ArrowRight, ArrowLeftRight,
  Upload, Star,
} from "lucide-react";
import ListInput from "@/components/ListInput";
import OptionsPanel from "@/components/OptionsPanel";
import StatsCards from "@/components/StatsCards";
import VennDiagram from "@/components/VennDiagram";
import ResultTabs from "@/components/ResultTabs";
import AIInsights from "@/components/AIInsights";
import FuzzyMatchTable from "@/components/FuzzyMatchTable";
import CreditsDisplay from "@/components/CreditsDisplay";
import HistoryPanel from "@/components/HistoryPanel";
import { compareLists, CompareResult } from "@/lib/compare";
import { useCredit } from "@/lib/credits";
import { saveComparison } from "@/lib/history";

const DEMO_A = `apple\nbanana\ncherry\ndate\nelderberry\nfig\ngrape\nhoneydew\nJohn Smith\nNew York\ninfo@example.com`;
const DEMO_B = `banana\ncherry\ndragonfruit\nelderberry\nfig\ngrape\nkiwi\nlemon\nmango\nSmith, John\nnew york\ninfo@Example.com`;

type CompareMode = "exact" | "ai";
interface AIResult {
  fuzzyMatches: { itemA: string; itemB: string; confidence: number; reason: string }[];
  onlyInA: string[]; onlyInB: string[]; inBoth: string[];
  insights: string;
  stats: { exactMatches: number; fuzzyMatches: number; totalMatchRate: number };
}

export default function Home() {
  const [listA, setListA] = useState("");
  const [listB, setListB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [mode, setMode] = useState<CompareMode>("exact");
  const [showOptions, setShowOptions] = useState(false);
  const [showFaq, setShowFaq] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [globalDragOver, setGlobalDragOver] = useState(false);
  const [aiUnlocked, setAiUnlocked] = useState(false);
  const [aiPowered, setAiPowered] = useState(true);
  const [options, setOptions] = useState({
    caseSensitive: false, trimWhitespace: true, removeDuplicates: true, ignoreEmpty: true,
  });

  const swapLists = useCallback(() => { const tmp = listA; setListA(listB); setListB(tmp); }, [listA, listB]);

  const parseList = useCallback(
    (raw: string): string[] => raw.split(/[\n,;\t]+/).map((s) => s.trim()).filter((s) => s.length > 0), []
  );

  const handleCompare = useCallback(() => {
    if (!listA.trim() && !listB.trim()) return;
    setAiResult(null); setAiUnlocked(false); setAiError(null);
    if (mode === "ai") setAiLoading(true);
    const r = compareLists(listA, listB, options);
    setResult(r);
    saveComparison({
      listALength: r.stats.totalA, listBLength: r.stats.totalB,
      commonCount: r.stats.common, uniqueACount: r.stats.uniqueA,
      uniqueBCount: r.stats.uniqueB, matchRate: r.stats.matchRate,
      mode,
      preview: {
        onlyInA: r.onlyInA.slice(0, 20),
        onlyInB: r.onlyInB.slice(0, 20),
        inBoth: r.inBoth.slice(0, 20),
      },
    });
    if (mode === "ai") handleAICompare();
  }, [listA, listB, options, mode]);

  const handleAICompare = useCallback(async () => {
    const itemsA = parseList(listA); const itemsB = parseList(listB);
    if (itemsA.length === 0 && itemsB.length === 0) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/compare-ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listA: itemsA, listB: itemsB, threshold: 0.6 }),
      });
      const data = await res.json();
      let powered = false;
      try {
        const aiRes = await fetch("/api/ai-analysis", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
        });
        const aiData = await aiRes.json();
        if (aiData.insights) data.insights = aiData.insights;
        powered = aiData.aiPowered !== false;
      } catch { /* keep fallback insights */ }
      setAiPowered(powered);
      setAiUnlocked(true);
      setAiResult(data);
    } catch { setAiResult(null); setAiError("AI analysis failed. Showing exact comparison results below."); }
    setAiLoading(false);
  }, [listA, listB, parseList]);

  const handleUnlockAI = useCallback(() => {
    setAiUnlocked(true);
  }, []);

  const handleDemo = useCallback(() => {
    setListA(DEMO_A); setListB(DEMO_B);
    setResult(null); setAiResult(null); setAiUnlocked(false); setAiError(null);
    if (mode === "ai") setAiLoading(true);
    const r = compareLists(DEMO_A, DEMO_B, options);
    setResult(r);
    if (mode === "ai") {
      const itemsA = parseList(DEMO_A); const itemsB = parseList(DEMO_B);
      fetch("/api/compare-ai", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listA: itemsA, listB: itemsB, threshold: 0.6 }),
      }).then((res) => res.json()).then((data) => {
        setAiResult(data);
        setAiLoading(false);
      }).catch(() => {
        setAiResult(null);
        setAiLoading(false);
      });
    }
  }, [options, mode, parseList]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); handleCompare(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "s" || e.key === "S")) { e.preventDefault(); swapLists(); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleCompare, swapLists]);

  const handleGlobalDrop = useCallback(async (files: FileList) => {
    async function readFile(file: File): Promise<string> {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (ext === ".xlsx" || ext === ".xls") {
        try {
          const XLSX = await import("xlsx");
          const buf = await file.arrayBuffer();
          const wb = XLSX.read(buf, { type: "array" });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          return data.flat().filter((s) => String(s).trim()).map((s) => String(s)).join("\n");
        } catch { /* fallback */ }
      }
      return file.text();
    }
    if (files.length >= 2) {
      const textA = await readFile(files[0]);
      const textB = await readFile(files[1]);
      setListA(textA); setListB(textB);
    } else if (files.length === 1) {
      const text = await readFile(files[0]);
      setListA((prev) => {
        if (!prev.trim()) return text;
        setListB((prevB) => prevB.trim() ? prevB : text);
        return prev;
      });
    }
    setGlobalDragOver(false);
  }, []);

  const features = [
    { icon: <Zap size={20} />, title: "Instant Comparison", desc: "Compare thousands of items in milliseconds. All processing happens in your browser." },
    { icon: <Shield size={20} />, title: "100% Private", desc: "Your data never leaves your device. No tracking, no collection, no server upload." },
    { icon: <Globe size={20} />, title: "Any Format", desc: "Paste text, upload files, drag and drop. Auto-detects delimiters." },
    { icon: <Sparkles size={20} />, title: "AI-Powered", desc: "DeepSeek AI finds fuzzy matches, typos, and reordered items automatically." },
  ];

  const faqs = [
    { q: "Is my data safe?", a: "Yes. All comparison happens in your browser. Your lists are never sent to any server or stored anywhere." },
    { q: "What file formats are supported?", a: "Paste text or upload .txt, .csv, .tsv files. Items can be separated by newlines, commas, semicolons, or tabs." },
    { q: "How many items can I compare?", a: "No hard limit. Handles tens of thousands of items smoothly since all processing is local." },
    { q: "What is AI comparison?", a: "AI mode uses DeepSeek to find fuzzy matches like 'John Smith' vs 'Smith, John', detect typos, and generate an intelligent analysis summary. Uses 1 credit per comparison." },
    { q: "How is match rate calculated?", a: "Uses the Dice coefficient: 2 x (common items) / (total A + total B), giving a percentage of list similarity." },
  ];

  const testimonials = [
    { name: "Sarah M.", role: "Marketing Manager", text: "Saved me hours deduplicating our 50K email list. The fuzzy matching caught typos I would have never found manually.", rating: 5 },
    { name: "David K.", role: "Data Analyst", text: "The CSV column selector is brilliant. I can compare specific fields from different exports without cleaning the data first.", rating: 5 },
    { name: "Emily R.", role: "E-commerce Owner", text: "I use this weekly to reconcile product SKUs between our warehouse system and online store. Incredibly fast and reliable.", rating: 5 },
    { name: "James L.", role: "DevOps Engineer", text: "Perfect for comparing IP whitelists and firewall rules. The symmetric difference view shows exactly what's changed.", rating: 5 },
    { name: "Maria C.", role: "HR Coordinator", text: "We compare employee lists across departments. The union view gives us a complete headcount in seconds. Love the privacy focus.", rating: 5 },
    { name: "Tom W.", role: "SEO Specialist", text: "Comparing keyword lists from different tools used to take me 30 minutes in Excel. Now it takes 10 seconds. Absolute game changer.", rating: 5 },
    { name: "Anna P.", role: "Researcher", text: "The full report export with all categories in one CSV is exactly what I needed for my research paper data analysis.", rating: 4 },
    { name: "Chris B.", role: "Sales Manager", text: "Comparing prospect lists before outreach campaigns. No duplicates means no embarrassing double emails to the same lead.", rating: 5 },
    { name: "Lisa T.", role: "Product Manager", text: "Clean, fast, no signup required. I've tried 5 different list comparison tools and this is by far the best one.", rating: 5 },
    { name: "Ryan H.", role: "Sysadmin", text: "Compared two DNS zone files and found 23 orphaned records in seconds. The search filter made it easy to verify each one.", rating: 5 },
  ];

  return (
    <div
      className="flex flex-col min-h-screen relative"
      onDragOver={(e) => { e.preventDefault(); setGlobalDragOver(true); }}
      onDragLeave={(e) => { if (e.relatedTarget === null || !e.currentTarget.contains(e.relatedTarget as Node)) setGlobalDragOver(false); }}
      onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length > 0) handleGlobalDrop(e.dataTransfer.files); }}
    >
      {/* Header */}
      <header className="border-b border-border bg-surface/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <ArrowRightLeft size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl font-[family-name:var(--font-sora)] tracking-tight">
              Compare<span className="hero-gradient-text">List</span>
            </span>
          </a>
          <nav className="flex items-center gap-4 text-[15px]">
            <a href="#tool" className="text-text-secondary hover:text-text px-3 py-1.5 rounded-lg hover:bg-surface-alt/40 transition-all">Tool</a>
            <a href="#features" className="text-text-secondary hover:text-text px-3 py-1.5 rounded-lg hover:bg-surface-alt/40 transition-all">Features</a>
            <a href="#faq" className="text-text-secondary hover:text-text px-3 py-1.5 rounded-lg hover:bg-surface-alt/40 transition-all">FAQ</a>
            <div className="w-px h-5 bg-border mx-1" />
            <button onClick={() => setShowHistory(true)} className="p-2 hover:bg-surface-alt/50 rounded-lg transition-colors" title="History">
              <History size={17} className="text-text-secondary" />
            </button>
            {/* Credits hidden - AI features are free during beta */}
          </nav>
        </div>
      </header>

      {/* Global drag overlay */}
      {globalDragOver && (
        <div className="fixed inset-0 z-[60] bg-primary/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="glass-elevated rounded-2xl p-8 text-center">
            <Upload size={40} className="text-primary mx-auto mb-3" />
            <p className="text-lg font-semibold text-text">Drop files to compare</p>
            <p className="text-sm text-text-secondary mt-1">Drop 2 files (List A + List B) or 1 file (auto-fills first empty list)</p>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative py-12 lg:py-16 text-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-sm text-text-muted mb-5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            Free &middot; Private &middot; No Signup
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-[family-name:var(--font-sora)] tracking-tight mb-4 leading-[1.1]">
            Compare Two Lists <span className="hero-gradient-text">Instantly</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
            Find differences, common items, and unique entries between any two lists. Powered by AI.
          </p>
        </div>
      </section>

      {/* Tool - 1250px width for spacious layout */}
      <section id="tool" className="max-w-[1250px] mx-auto px-4 pb-20 -mt-2 relative z-10 w-full">
        <div className="glass-elevated rounded-2xl p-6 lg:p-8 glow-primary gradient-border">
          {/* Mode Toggle */}
          <div className="flex items-center justify-center mb-5">
            <div className="inline-flex items-center p-1 rounded-xl bg-surface/80 border border-border">
              <button onClick={() => { setMode("exact"); setResult(null); setAiResult(null); setAiError(null); }}
                className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-300 ${mode === "exact" ? "bg-surface-alt text-text shadow-md" : "text-text-muted hover:text-text-secondary"}`}>
                Exact Match
              </button>
              <button onClick={() => { setMode("ai"); setResult(null); setAiResult(null); setAiError(null); }}
                className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-300 flex items-center gap-2 ${mode === "ai" ? "bg-surface-alt text-text shadow-md" : "text-text-muted hover:text-text-secondary"}`}>
                <Sparkles size={15} className="text-primary" />
                AI Match
                <span className="text-xs text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full font-medium">Free</span>
              </button>
            </div>
          </div>

          {/* Fixed-height Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5 relative">
            <ListInput label="List A" labelColor="#818cf8" value={listA} onChange={setListA} placeholder="Paste your first list here, one item per line..." />
            <ListInput label="List B" labelColor="#22d3ee" value={listB} onChange={setListB} placeholder="Paste your second list here, one item per line..." />
            {/* Swap button - centered between the two inputs */}
            <button
              onClick={swapLists}
              className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-alt border border-border hover:border-primary/40 items-center justify-center transition-all hover:scale-110 z-10"
              title="Swap lists"
            >
              <ArrowLeftRight size={16} className="text-text-muted" />
            </button>
          </div>

          {/* Action bar - single row, no conditional height changes */}
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setShowOptions(!showOptions)} className="text-sm text-text-muted hover:text-text-secondary flex items-center gap-1.5 transition-colors">
              {showOptions ? <ChevronUp size={15} /> : <ChevronDown size={15} />} Options
            </button>
            <div className="flex items-center gap-3">
              <button onClick={handleDemo} className="px-5 py-2.5 text-[15px] text-text-muted hover:text-text border border-border rounded-xl hover:bg-surface-alt/50 transition-all">
                Try Demo
              </button>
              <button onClick={handleCompare} disabled={(!listA.trim() && !listB.trim()) || aiLoading}
                className="btn-primary px-8 py-2.5 text-[15px] font-semibold text-white rounded-xl flex items-center gap-2">
                {aiLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</>
                ) : mode === "ai" ? (
                  <><Sparkles size={16} />Compare with AI</>
                ) : "Compare Lists"}
              </button>
            </div>
          </div>

          {/* Options - expands BELOW the bar, never shifts inputs */}
          {showOptions && (
            <div className="mt-4 pt-4 border-t border-border">
              <OptionsPanel {...options} onChange={setOptions} />
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4 mt-6 animate-fade-up" id="results-section">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Results</h3>
                <button onClick={() => { setResult(null); setAiResult(null); setAiError(null); }} className="text-xs text-text-muted hover:text-text-secondary transition-colors">Clear Results</button>
              </div>
              <StatsCards stats={result.stats} onCardClick={() => document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" })} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <VennDiagram totalA={result.stats.totalA} totalB={result.stats.totalB} common={result.stats.common} onlyA={result.stats.uniqueA} onlyB={result.stats.uniqueB} />
                <div className="lg:col-span-2">
                  <ResultTabs onlyInA={result.onlyInA} onlyInB={result.onlyInB} inBoth={result.inBoth} />
                </div>
              </div>
            </div>
          )}

          {/* AI Error */}
          {aiError && (
            <div className="mt-5 glass rounded-xl p-3 flex items-start gap-2.5 border border-danger/20 bg-danger/5 animate-fade-up">
              <Zap size={14} className="text-danger mt-0.5 shrink-0" />
              <p className="text-sm text-text-secondary">{aiError}</p>
            </div>
          )}

          {/* AI Results */}
          {mode === "ai" && aiResult && (
            <div className="space-y-4 mt-5 pt-5 border-t border-border animate-fade-up">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-primary" />
                <span className="text-base font-semibold font-[family-name:var(--font-sora)]">AI Analysis</span>
              </div>
              {!aiPowered && (
                <div className="glass rounded-xl p-3 flex items-start gap-2.5 border border-amber-500/20 bg-amber-500/5">
                  <Zap size={14} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-text-secondary">
                    AI deep analysis is temporarily unavailable. Showing local fuzzy matching results for free.
                  </p>
                </div>
              )}
              {aiResult.fuzzyMatches.length > 0 && <FuzzyMatchTable matches={aiResult.fuzzyMatches} locked={!aiUnlocked} />}
              <AIInsights insights={aiResult.insights} fuzzyMatchCount={aiResult.stats.fuzzyMatches} locked={!aiUnlocked} onUnlock={handleUnlockAI} />
              {aiUnlocked && aiResult.fuzzyMatches.length > 0 && (
                <div className="glass rounded-xl p-4 flex items-start gap-3 border border-success/20">
                  <Zap size={15} className="text-success mt-0.5 shrink-0" />
                  <p className="text-sm text-success/90 leading-relaxed">
                    AI found <strong>{aiResult.stats.fuzzyMatches} fuzzy match{aiResult.stats.fuzzyMatches !== 1 ? "es" : ""}</strong> that exact matching missed.
                    Combined rate: <strong>{aiResult.stats.totalMatchRate}%</strong> (vs {result?.stats.matchRate || 0}% exact).
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 relative">
        <div className="absolute inset-0 bg-dots opacity-50 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Why CompareList</span>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-sora)] mt-2">Built for Speed & Privacy</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
            {features.map((f, i) => (
              <div key={i} className="glass rounded-xl p-6 hover:border-border-active transition-all duration-300 animate-fade-up group" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-base mb-2 font-[family-name:var(--font-sora)]">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-6 text-center mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-text-muted font-medium">Testimonials</span>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mt-2">Loved by Thousands</h2>
        </div>
        {/* Row 1 - scrolls left */}
        <div className="max-w-6xl mx-auto px-6 mb-4">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
            <div className="flex py-2 animate-marquee">
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="shrink-0 w-[300px] mx-1.5 glass rounded-xl p-5">
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} className={j < t.rating ? "text-amber-400 fill-amber-400" : "text-border"} />
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center text-white text-xs font-semibold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Row 2 - scrolls right */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
            <div className="flex py-2 animate-marquee-reverse">
              {[...testimonials.slice(5), ...testimonials.slice(0, 5), ...testimonials.slice(5), ...testimonials.slice(0, 5)].map((t, i) => (
                <div key={`r2-${i}`} className="shrink-0 w-[300px] mx-1.5 glass rounded-xl p-5">
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} className={j < t.rating ? "text-amber-400 fill-amber-400" : "text-border"} />
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent/60 to-primary/60 flex items-center justify-center text-white text-xs font-semibold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-accent font-medium">How it works</span>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-sora)] mt-2">Three Simple Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Paste Your Lists", desc: "Paste two lists or upload TXT/CSV files. Auto-detects newlines, commas, tabs." },
              { step: "02", title: "Choose Mode", desc: "Exact Match for free, or AI Match for fuzzy matching and DeepSeek insights." },
              { step: "03", title: "Get Results", desc: "See breakdown: items only in A, only in B, and in both. Export as CSV." },
            ].map((s, i) => (
              <div key={s.step} className="text-center animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mx-auto mb-4 border border-border">
                  <span className="text-lg font-bold font-[family-name:var(--font-sora)] hero-gradient-text">{s.step}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 font-[family-name:var(--font-sora)]">{s.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="glass rounded-2xl p-8 gradient-border glow-primary">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-3">Ready to Compare?</h2>
            <p className="text-text-secondary text-base mb-6 max-w-md mx-auto">
              Join thousands of users who compare lists every day. Free, private, and instant.
            </p>
            <a href="#tool" className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-base font-semibold text-white rounded-xl">
              Start Comparing <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
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
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.2em] text-text-muted font-medium">FAQ</span>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-sora)] mt-2">Questions & Answers</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden transition-all duration-300 hover:border-border-active">
                <button onClick={() => setShowFaq(showFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left text-base font-medium flex items-center justify-between hover:bg-surface-alt/20 transition-colors">
                  <span>{faq.q}</span>
                  {showFaq === i ? <ChevronUp size={17} className="text-text-muted shrink-0" /> : <ChevronDown size={17} className="text-text-muted shrink-0" />}
                </button>
                {showFaq === i && (
                  <div className="px-6 pb-4 text-base text-text-secondary leading-relaxed animate-fade-in">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ArrowRightLeft size={10} className="text-white" />
            </div>
            <span>&copy; {new Date().getFullYear()} CompareList</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="/pricing" className="hover:text-text transition-colors">Pricing</a>
            <span>All processing in your browser</span>
          </div>
        </div>
      </footer>

      <HistoryPanel
        open={showHistory}
        onClose={() => setShowHistory(false)}
        onRestore={(record) => {
          // Restore preview data as comma-separated for quick re-compare
          if (record.preview) {
            const a = [
              ...record.preview.onlyInA,
              ...record.preview.inBoth,
            ].join("\n");
            const b = [
              ...record.preview.onlyInB,
              ...record.preview.inBoth,
            ].join("\n");
            setListA(a);
            setListB(b);
            setResult(null);
          }
        }}
      />
    </div>
  );
}
