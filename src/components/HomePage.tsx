"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ArrowRightLeft, Zap, Shield, Globe, Sparkles,
  ChevronDown, ChevronUp, History, ArrowRight, ArrowLeftRight,
  Upload,
} from "lucide-react";
import ListInput from "@/components/ListInput";
import OptionsPanel from "@/components/OptionsPanel";
import StatsCards from "@/components/StatsCards";
import VennDiagram from "@/components/VennDiagram";
import ResultTabs from "@/components/ResultTabs";
import FuzzyMatchTable from "@/components/FuzzyMatchTable";
import HistoryPanel from "@/components/HistoryPanel";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { compareLists, CompareResult, type CompareUiOptions } from "@/lib/compare";
import { smartCompareLists, SmartCompareResult } from "@/lib/ai-compare";
import { saveComparison } from "@/lib/history";
import { safeJsonLd } from "@/lib/seo";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const DEMO_A = `apple\nbanana\ncherry\ndate\nelderberry\nfig\ngrape\nhoneydew\nJohn Smith\nNew York\ninfo@example.com`;
const DEMO_B = `banana\ncherry\ndragonfruit\nelderberry\nfig\ngrape\nkiwi\nlemon\nmango\nSmith, John\nnew york\ninfo@Example.com`;

type CompareMode = "exact" | "smart";

export default function HomePage() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");
  const [listA, setListA] = useState("");
  const [listB, setListB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [smartResult, setSmartResult] = useState<SmartCompareResult | null>(null);
  const [mode, setMode] = useState<CompareMode>("exact");
  const [smartThreshold, setSmartThreshold] = useState(0.8);
  const [showOptions, setShowOptions] = useState(false);
  const [showFaq, setShowFaq] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [globalDragOver, setGlobalDragOver] = useState(false);
  const [options, setOptions] = useState<CompareUiOptions>({
    caseSensitive: false, trimWhitespace: true, removeDuplicates: true, ignoreEmpty: true,
    delimiter: "auto", customDelimiter: "", normalization: "generic",
  });

  const swapLists = useCallback(() => { const tmp = listA; setListA(listB); setListB(tmp); }, [listA, listB]);

  const handleCompare = useCallback(() => {
    if (!listA.trim() && !listB.trim()) return;
    const r = compareLists(listA, listB, options);
    const smart = mode === "smart" ? smartCompareLists(listA, listB, options, smartThreshold) : null;
    setResult(r);
    setSmartResult(smart);
    const commonCount = smart ? smart.stats.exactMatches + smart.stats.fuzzyMatches : r.stats.common;
    saveComparison({
      listALength: r.stats.totalA, listBLength: r.stats.totalB,
      commonCount, uniqueACount: smart?.onlyInA.length ?? r.stats.uniqueA,
      uniqueBCount: smart?.onlyInB.length ?? r.stats.uniqueB, matchRate: smart?.stats.totalMatchRate ?? r.stats.matchRate,
      mode,
    });
  }, [listA, listB, options, mode, smartThreshold]);

  const handleDemo = useCallback(() => {
    setListA(DEMO_A); setListB(DEMO_B);
    setResult(null); setSmartResult(null);
    const r = compareLists(DEMO_A, DEMO_B, options);
    setResult(r);
    if (mode === "smart") setSmartResult(smartCompareLists(DEMO_A, DEMO_B, options, smartThreshold));
  }, [options, mode, smartThreshold]);

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
      if (ext === ".xlsx") {
        try {
          const { default: readWorkbook } = await import("read-excel-file/browser");
          const workbook = await readWorkbook(file);
          return (workbook[0]?.data ?? []).flat().filter((cell) => String(cell ?? "").trim()).map((cell) => cell instanceof Date ? cell.toISOString() : String(cell ?? "")).join("\n");
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

  const featureIcons = [Zap, Shield, Globe, Sparkles];

  const faqs = [0, 1, 2, 3, 4].map((i) => ({
    q: t(`faq.${i}.q`),
    a: t(`faq.${i}.a`),
  }));

  const displayedResult: CompareResult | null = result && mode === "smart" && smartResult
    ? {
        onlyInA: smartResult.onlyInA,
        onlyInB: smartResult.onlyInB,
        inBoth: [...smartResult.inBoth, ...smartResult.fuzzyMatches.map((match) => match.itemA)],
        stats: {
          ...result.stats,
          uniqueA: smartResult.onlyInA.length,
          uniqueB: smartResult.onlyInB.length,
          common: smartResult.stats.exactMatches + smartResult.stats.fuzzyMatches,
          matchRate: smartResult.stats.totalMatchRate,
        },
      }
    : result;

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
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <ArrowRightLeft size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl font-[family-name:var(--font-sora)] tracking-tight">
              Compare<span className="hero-gradient-text">List</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-[15px]">
            <a href="#tool" className="text-text-secondary hover:text-text px-3 py-1.5 rounded-lg hover:bg-surface-alt/40 transition-all">{tNav('tool')}</a>
            <a href="#features" className="text-text-secondary hover:text-text px-3 py-1.5 rounded-lg hover:bg-surface-alt/40 transition-all">{tNav('features')}</a>
            <a href="#faq" className="text-text-secondary hover:text-text px-3 py-1.5 rounded-lg hover:bg-surface-alt/40 transition-all">{tNav('faq')}</a>
            <LanguageSwitcher />
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
            <p className="text-lg font-semibold text-text">{t('dragOverlay.title')}</p>
            <p className="text-sm text-text-secondary mt-1">{t('dragOverlay.subtitle')}</p>
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
            {t('hero.badge')}
          </div>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-[family-name:var(--font-sora)] tracking-tight mb-4 leading-[1.1]">
            {t.rich('hero.title', {
              gradient: (chunks) => <span className="hero-gradient-text">{chunks}</span>,
            })}
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Tool - 1250px width for spacious layout */}
      <section id="tool" className="max-w-[1250px] mx-auto px-4 pb-20 -mt-2 relative z-10 w-full">
        <div className="glass-elevated rounded-2xl p-6 lg:p-8 glow-primary gradient-border">
          {/* Mode Toggle */}
          <div className="flex items-center justify-center mb-5">
            <div className="inline-flex items-center p-1 rounded-xl bg-surface/80 border border-border">
              <button onClick={() => { setMode("exact"); setResult(null); setSmartResult(null); }}
                className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-300 ${mode === "exact" ? "bg-surface-alt text-text shadow-md" : "text-text-muted hover:text-text-secondary"}`}>
                {t('tool.modeExact')}
              </button>
              <button onClick={() => { setMode("smart"); setResult(null); setSmartResult(null); }}
                className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-300 flex items-center gap-2 ${mode === "smart" ? "bg-surface-alt text-text shadow-md" : "text-text-muted hover:text-text-secondary"}`}>
                <Sparkles size={15} className="text-primary" />
                {t('tool.modeAi')}
                <span className="text-xs text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full font-medium">{t('tool.modeAiFree')}</span>
              </button>
            </div>
          </div>
          {mode === "smart" && (
            <div className="max-w-sm mx-auto -mt-2 mb-5 flex items-center gap-3 text-xs text-text-muted">
              <span className="shrink-0">{t("tool.similarityThreshold")}</span>
              <input
                type="range"
                min="60"
                max="95"
                step="1"
                value={Math.round(smartThreshold * 100)}
                onChange={(event) => { setSmartThreshold(Number(event.target.value) / 100); setSmartResult(null); }}
                className="w-full accent-primary"
              />
              <span className="w-9 text-right tabular-nums">{Math.round(smartThreshold * 100)}%</span>
            </div>
          )}

          {/* Fixed-height Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5 relative">
            <ListInput label={t('tool.listALabel')} labelColor="#818cf8" value={listA} onChange={setListA} placeholder={t('tool.listAPlaceholder')} />
            <ListInput label={t('tool.listBLabel')} labelColor="#22d3ee" value={listB} onChange={setListB} placeholder={t('tool.listBPlaceholder')} />
            {/* Swap button - centered between the two inputs */}
            <button
              onClick={swapLists}
              className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-alt border border-border hover:border-primary/40 items-center justify-center transition-all hover:scale-110 z-10"
              title={t('tool.swapLists')}
            >
              <ArrowLeftRight size={16} className="text-text-muted" />
            </button>
          </div>

          {/* Action bar - single row, no conditional height changes */}
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setShowOptions(!showOptions)} className="text-sm text-text-muted hover:text-text-secondary flex items-center gap-1.5 transition-colors">
              {showOptions ? <ChevronUp size={15} /> : <ChevronDown size={15} />} {t('tool.options')}
            </button>
            <div className="flex items-center gap-3">
              <button onClick={handleDemo} className="px-5 py-2.5 text-[15px] text-text-muted hover:text-text border border-border rounded-xl hover:bg-surface-alt/50 transition-all">
                {t('tool.tryDemo')}
              </button>
              <button onClick={handleCompare} disabled={!listA.trim() && !listB.trim()}
                className="btn-primary px-8 py-2.5 text-[15px] font-semibold text-white rounded-xl flex items-center gap-2">
                {mode === "smart" ? (
                  <><Sparkles size={16} />{t('tool.compareWithAi')}</>
                ) : t('tool.compareLists')}
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
          {displayedResult && (
            <div className="space-y-4 mt-6 animate-fade-up" id="results-section">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{t('tool.results')}</h3>
                <button onClick={() => { setResult(null); setSmartResult(null); }} className="text-xs text-text-muted hover:text-text-secondary transition-colors">{t('tool.clearResults')}</button>
              </div>
              <StatsCards stats={displayedResult.stats} onCardClick={() => document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" })} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <VennDiagram totalA={displayedResult.stats.totalA} totalB={displayedResult.stats.totalB} common={displayedResult.stats.common} onlyA={displayedResult.stats.uniqueA} onlyB={displayedResult.stats.uniqueB} />
                <div className="lg:col-span-2">
                  <ResultTabs onlyInA={displayedResult.onlyInA} onlyInB={displayedResult.onlyInB} inBoth={displayedResult.inBoth} />
                </div>
              </div>
            </div>
          )}

          {/* Smart Match Results */}
          {mode === "smart" && smartResult && (
            <div className="space-y-4 mt-5 pt-5 border-t border-border animate-fade-up">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-primary" />
                <span className="text-base font-semibold font-[family-name:var(--font-sora)]">{t('aiAnalysis.title')}</span>
              </div>
              {smartResult.fuzzyMatches.length > 0 && <FuzzyMatchTable matches={smartResult.fuzzyMatches} />}
              {smartResult.fuzzyMatches.length > 0 && (
                <div className="glass rounded-xl p-4 flex items-start gap-3 border border-success/20">
                  <Zap size={15} className="text-success mt-0.5 shrink-0" />
                  <p className="text-sm text-success/90 leading-relaxed">
                    {t.rich('aiAnalysis.foundFuzzy', {
                      count: smartResult.stats.fuzzyMatches,
                      plural: smartResult.stats.fuzzyMatches !== 1 ? "es" : "",
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                    {" "}
                    {t.rich('aiAnalysis.combinedRate', {
                      aiRate: String(smartResult.stats.totalMatchRate),
                      exactRate: String(result?.stats.matchRate || 0),
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
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
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">{t('features.sectionTag')}</span>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-sora)] mt-2">{t('features.sectionTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
            {featureIcons.map((FeatureIcon, i) => (
              <div key={i} className="glass rounded-xl p-6 hover:border-border-active transition-all duration-300 animate-fade-up group" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <FeatureIcon size={20} />
                </div>
                <h3 className="font-semibold text-base mb-2 font-[family-name:var(--font-sora)]">{t(`features.${i}.title`)}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{t(`features.${i}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-accent font-medium">{t('howItWorks.sectionTag')}</span>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-sora)] mt-2">{t('howItWorks.sectionTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((s, i) => (
              <div key={s} className="text-center animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mx-auto mb-4 border border-border">
                  <span className="text-lg font-bold font-[family-name:var(--font-sora)] hero-gradient-text">{t(`howItWorks.${s}.step`)}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 font-[family-name:var(--font-sora)]">{t(`howItWorks.${s}.title`)}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{t(`howItWorks.${s}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="glass rounded-2xl p-8 gradient-border glow-primary">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-sora)] mb-3">{t('cta.title')}</h2>
            <p className="text-text-secondary text-base mb-6 max-w-md mx-auto">
              {t('cta.subtitle')}
            </p>
            <a href="#tool" className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-base font-semibold text-white rounded-xl">
              {t('cta.button')} <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
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
            <span className="text-xs uppercase tracking-[0.2em] text-text-muted font-medium">{t('faq.sectionTag')}</span>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-sora)] mt-2">{t('faq.sectionTitle')}</h2>
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
            <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/about" className="hover:text-text transition-colors">{tNav('about')}</Link>
            <Link href="/privacy" className="hover:text-text transition-colors">{tNav('privacy')}</Link>
            <span>{t('footer.processing')}</span>
          </div>
        </div>
      </footer>

      {showHistory && <HistoryPanel
        open={showHistory}
        onClose={() => setShowHistory(false)}
        onRestore={(record) => {
          // Older records may include a local preview that can be restored.
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
      />}
    </div>
  );
}
