"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  ArrowRightLeft, Zap, Shield, Globe, Sparkles,
  ChevronDown, ChevronUp, FolderClock, ArrowRight, ArrowLeftRight,
  Upload, Save, RefreshCcw, BarChart3, Share2,
} from "lucide-react";
import ListInput from "@/components/ListInput";
import OptionsPanel from "@/components/OptionsPanel";
import StatsCards from "@/components/StatsCards";
import VennDiagram from "@/components/VennDiagram";
import ResultTabs from "@/components/ResultTabs";
import FuzzyMatchTable from "@/components/FuzzyMatchTable";
import ProjectPanel from "@/components/ProjectPanel";
import SaveProjectDialog from "@/components/SaveProjectDialog";
import ShareProjectDialog from "@/components/ShareProjectDialog";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { compareLists, CompareResult, type CompareUiOptions } from "@/lib/compare";
import { fuzzyMatchId, smartCompareLists, SmartCompareResult } from "@/lib/ai-compare";
import { saveComparison } from "@/lib/history";
import { saveProject, type LocalCompareProject } from "@/lib/project-store";
import { getWorkspaceCopy } from "@/lib/workspace-copy";
import { event as trackEvent, itemCountBucket } from "@/lib/gtag";
import { parseSupportedFile } from "@/lib/file-parsers";
import { runComparisonInWorker } from "@/lib/compare-worker-client";
import { COMPARISON_TEMPLATES, localizedTemplate } from "@/lib/comparison-templates";
import { decodeSharedComparison } from "@/lib/share-project";
import { safeJsonLd } from "@/lib/seo";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const DEMO_A = `apple\nbanana\ncherry\ndate\nelderberry\nfig\ngrape\nhoneydew\nJohn Smith\nNew York\ninfo@example.com`;
const DEMO_B = `banana\ncherry\ndragonfruit\nelderberry\nfig\ngrape\nkiwi\nlemon\nmango\nSmith, John\nnew york\ninfo@Example.com`;

type CompareMode = "exact" | "smart";

export default function HomePage() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const workspaceCopy = getWorkspaceCopy(locale);
  const [listA, setListA] = useState("");
  const [listB, setListB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [smartResult, setSmartResult] = useState<SmartCompareResult | null>(null);
  const [rejectedFuzzyMatches, setRejectedFuzzyMatches] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<CompareMode>("exact");
  const [activeTemplate, setActiveTemplate] = useState("");
  const [smartThreshold, setSmartThreshold] = useState(0.8);
  const [showOptions, setShowOptions] = useState(false);
  const [showFaq, setShowFaq] = useState<number | null>(null);
  const [showProjects, setShowProjects] = useState(false);
  const [showSaveProject, setShowSaveProject] = useState(false);
  const [showShareProject, setShowShareProject] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | undefined>();
  const [activeProjectName, setActiveProjectName] = useState("");
  const [fileNameA, setFileNameA] = useState<string | null>(null);
  const [fileNameB, setFileNameB] = useState<string | null>(null);
  const [workspaceNotice, setWorkspaceNotice] = useState<string | null>(null);
  const [showVennOnMobile, setShowVennOnMobile] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonProgress, setComparisonProgress] = useState(0);
  const comparisonAbortRef = useRef<AbortController | null>(null);
  const [globalDragOver, setGlobalDragOver] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<CompareUiOptions>({
    caseSensitive: false, trimWhitespace: true, removeDuplicates: true, ignoreEmpty: true,
    delimiter: "auto", customDelimiter: "", normalization: "generic",
  });

  const swapLists = useCallback(() => { const tmp = listA; setListA(listB); setListB(tmp); }, [listA, listB]);

  const handleCompare = useCallback(async () => {
    if (!listA.trim() && !listB.trim()) return;
    comparisonAbortRef.current?.abort();
    const controller = new AbortController();
    comparisonAbortRef.current = controller;
    setIsComparing(true);
    setComparisonProgress(5);
    trackEvent("comparison_started", { mode, source: "home" });
    try {
      const output = await runComparisonInWorker({
        listA,
        listB,
        options,
        mode,
        smartThreshold,
        signal: controller.signal,
        onProgress: setComparisonProgress,
      });
      const r = output.result;
      const smart = output.smartResult;
      setResult(r);
      setSmartResult(smart);
      setRejectedFuzzyMatches(new Set());
      const commonCount = smart ? smart.stats.exactMatches + smart.stats.fuzzyMatches : r.stats.common;
      saveComparison({
        listALength: r.stats.totalA, listBLength: r.stats.totalB,
        commonCount, uniqueACount: smart?.onlyInA.length ?? r.stats.uniqueA,
        uniqueBCount: smart?.onlyInB.length ?? r.stats.uniqueB, matchRate: smart?.stats.totalMatchRate ?? r.stats.matchRate,
        mode,
      });
      trackEvent("comparison_completed", {
        mode,
        source: "home",
        item_bucket: itemCountBucket(r.stats.totalA + r.stats.totalB),
        match_rate_bucket: `${Math.floor(r.stats.matchRate / 10) * 10}-${Math.min(100, Math.floor(r.stats.matchRate / 10) * 10 + 9)}`,
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        trackEvent("comparison_failed", { mode, source: "home" });
      }
    } finally {
      if (comparisonAbortRef.current === controller) {
        comparisonAbortRef.current = null;
        setIsComparing(false);
        setComparisonProgress(0);
      }
    }
  }, [listA, listB, options, mode, smartThreshold]);

  const cancelComparison = useCallback(() => {
    comparisonAbortRef.current?.abort();
    trackEvent("comparison_cancelled", { mode, source: "home" });
  }, [mode]);

  const handleTemplateChange = useCallback((templateId: string) => {
    setActiveTemplate(templateId);
    if (!templateId) return;
    const template = COMPARISON_TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;
    setOptions((current) => ({ ...current, ...template.options }));
    setResult(null);
    setSmartResult(null);
    setRejectedFuzzyMatches(new Set());
    setWorkspaceNotice(workspaceCopy.templateApplied);
    window.setTimeout(() => setWorkspaceNotice(null), 3000);
    trackEvent("comparison_template_applied", { template: template.id });
  }, [workspaceCopy.templateApplied]);

  const handleDemo = useCallback(() => {
    setListA(DEMO_A); setListB(DEMO_B);
    setResult(null); setSmartResult(null);
    setRejectedFuzzyMatches(new Set());
    const r = compareLists(DEMO_A, DEMO_B, options);
    setResult(r);
    if (mode === "smart") setSmartResult(smartCompareLists(DEMO_A, DEMO_B, options, smartThreshold));
    trackEvent("demo_used", { mode });
  }, [options, mode, smartThreshold]);

  const handleSaveProject = useCallback(async (name: string, saveContent: boolean) => {
    const project = await saveProject({
      id: activeProjectId,
      name,
      saveContent,
      listA,
      listB,
      labelA: fileNameA || t("tool.listALabel"),
      labelB: fileNameB || t("tool.listBLabel"),
      mode,
      smartThreshold,
      options,
      result,
      smartResult,
      rejectedFuzzyMatches: [...rejectedFuzzyMatches],
    });
    setActiveProjectId(project.id);
    setActiveProjectName(project.name);
    setWorkspaceNotice(workspaceCopy.saved);
    window.setTimeout(() => setWorkspaceNotice(null), 3000);
    trackEvent("project_saved", { content_saved: saveContent ? 1 : 0, mode });
  }, [activeProjectId, fileNameA, fileNameB, listA, listB, mode, options, rejectedFuzzyMatches, result, smartResult, smartThreshold, t, workspaceCopy.saved]);

  const handleOpenProject = useCallback((project: LocalCompareProject) => {
    setActiveProjectId(project.id);
    setActiveProjectName(project.name);
    setMode(project.mode);
    setSmartThreshold(project.smartThreshold);
    setOptions(project.options);
    setActiveTemplate("");
    setFileNameA(project.labelA);
    setFileNameB(project.labelB);
    if (project.saveContent) {
      setListA(project.listA);
      setListB(project.listB);
      setResult(project.result);
      setSmartResult(project.smartResult);
      setRejectedFuzzyMatches(new Set(project.rejectedFuzzyMatches ?? []));
    } else {
      setListA("");
      setListB("");
      setResult(null);
      setSmartResult(null);
      setRejectedFuzzyMatches(new Set());
    }
  }, []);

  const handleCompareNewVersion = useCallback(() => {
    setListB("");
    setFileNameB(null);
    setResult(null);
    setSmartResult(null);
    setRejectedFuzzyMatches(new Set());
    setWorkspaceNotice(workspaceCopy.baselineKept);
    window.setTimeout(() => setWorkspaceNotice(null), 4500);
    trackEvent("compare_new_version_started", { mode });
    window.requestAnimationFrame(() => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [mode, workspaceCopy.baselineKept]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); handleCompare(); }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "s" || e.key === "S")) { e.preventDefault(); swapLists(); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleCompare, swapLists]);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#share=")) return;
    try {
      const shared = decodeSharedComparison(hash.slice("#share=".length));
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      queueMicrotask(() => {
        setMode(shared.mode);
        setSmartThreshold(shared.smartThreshold);
        setOptions(shared.options);
        setListA(shared.listA ?? "");
        setListB(shared.listB ?? "");
        setResult(null);
        setSmartResult(null);
        setRejectedFuzzyMatches(new Set());
        setActiveTemplate("");
        setWorkspaceNotice(workspaceCopy.sharedWorkspaceLoaded);
        window.setTimeout(() => setWorkspaceNotice(null), 4500);
        trackEvent("shared_comparison_opened", { content_included: shared.listA !== undefined || shared.listB !== undefined ? 1 : 0 });
      });
    } catch {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }, [workspaceCopy.sharedWorkspaceLoaded]);

  const handleGlobalDrop = useCallback(async (files: FileList) => {
    async function readFile(file: File): Promise<string> {
      const parsed = await parseSupportedFile(file);
      return (parsed.sheets[0]?.data ?? []).flat().filter((cell) => cell.trim()).join("\n");
    }
    if (files.length >= 2) {
      const textA = await readFile(files[0]);
      const textB = await readFile(files[1]);
      setListA(textA); setListB(textB);
      setFileNameA(files[0].name); setFileNameB(files[1].name);
    } else if (files.length === 1) {
      const text = await readFile(files[0]);
      setListA((prev) => {
        if (!prev.trim()) {
          setFileNameA(files[0].name);
          return text;
        }
        setListB((prevB) => {
          if (!prevB.trim()) setFileNameB(files[0].name);
          return prevB.trim() ? prevB : text;
        });
        return prev;
      });
    }
    trackEvent("files_dropped", { file_count: Math.min(files.length, 2) });
    setGlobalDragOver(false);
  }, []);

  const featureIcons = [Zap, Shield, Globe, Sparkles];

  const faqs = [0, 1, 2, 3, 4].map((i) => ({
    q: t(`faq.${i}.q`),
    a: t(`faq.${i}.a`),
  }));

  const acceptedFuzzyMatches = smartResult?.fuzzyMatches.filter((match, index) => !rejectedFuzzyMatches.has(fuzzyMatchId(match, index))) ?? [];
  const rejectedMatches = smartResult?.fuzzyMatches.filter((match, index) => rejectedFuzzyMatches.has(fuzzyMatchId(match, index))) ?? [];
  const acceptedCommon = smartResult ? smartResult.stats.exactMatches + acceptedFuzzyMatches.length : 0;
  const acceptedMatchRate = smartResult && smartResult.stats.totalA + smartResult.stats.totalB > 0
    ? Math.round((2 * acceptedCommon * 100) / (smartResult.stats.totalA + smartResult.stats.totalB))
    : 0;
  const displayedResult: CompareResult | null = result && mode === "smart" && smartResult
    ? {
        onlyInA: [...smartResult.onlyInA, ...rejectedMatches.map((match) => match.itemA)],
        onlyInB: [...smartResult.onlyInB, ...rejectedMatches.map((match) => match.itemB)],
        inBoth: [...smartResult.inBoth, ...acceptedFuzzyMatches.map((match) => match.itemA)],
        stats: {
          ...result.stats,
          uniqueA: smartResult.onlyInA.length + rejectedMatches.length,
          uniqueB: smartResult.onlyInB.length + rejectedMatches.length,
          common: acceptedCommon,
          matchRate: acceptedMatchRate,
        },
      }
    : result;

  useEffect(() => {
    if (!result) return;
    const frame = window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [result, smartResult]);

  return (
    <div
      className="flex flex-col min-h-screen relative"
      onDragOver={(e) => { e.preventDefault(); setGlobalDragOver(true); }}
      onDragLeave={(e) => { if (e.relatedTarget === null || !e.currentTarget.contains(e.relatedTarget as Node)) setGlobalDragOver(false); }}
      onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length > 0) handleGlobalDrop(e.dataTransfer.files); }}
    >
      {/* Header */}
      <header className="border-b border-border bg-surface/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <ArrowRightLeft size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl font-[family-name:var(--font-sora)] tracking-tight">
              Compare<span className="hero-gradient-text">List</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2 lg:gap-4 text-[15px] min-w-0" aria-label={tNav('tool')}>
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              <a href="#tool" className="text-text-secondary hover:text-text px-3 py-2 rounded-lg hover:bg-surface-alt/40 transition-all">{tNav('tool')}</a>
              <a href="#features" className="text-text-secondary hover:text-text px-3 py-2 rounded-lg hover:bg-surface-alt/40 transition-all">{tNav('features')}</a>
              <a href="#faq" className="text-text-secondary hover:text-text px-3 py-2 rounded-lg hover:bg-surface-alt/40 transition-all">{tNav('faq')}</a>
            </div>
            <LanguageSwitcher />
            <div className="hidden sm:block w-px h-5 bg-border mx-1" />
            <button
              type="button"
              onClick={() => { setShowProjects(true); trackEvent("project_panel_opened"); }}
              className="w-10 h-10 inline-flex items-center justify-center hover:bg-surface-alt/50 rounded-lg transition-colors"
              title={workspaceCopy.projects}
              aria-label={workspaceCopy.projects}
            >
              <FolderClock size={17} className="text-text-secondary" />
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
      <section className="relative py-8 sm:py-12 lg:py-16 text-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-xs sm:text-sm text-text-muted mb-4 sm:mb-5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            {t('hero.badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-[family-name:var(--font-sora)] tracking-tight mb-3 sm:mb-4 leading-[1.12]">
            {t.rich('hero.title', {
              gradient: (chunks) => <span className="hero-gradient-text">{chunks}</span>,
            })}
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Tool - 1250px width for spacious layout */}
      <section id="tool" className="max-w-[1250px] mx-auto px-3 sm:px-4 pb-12 sm:pb-20 -mt-1 sm:-mt-2 relative z-10 w-full scroll-mt-20">
        <div className="glass-elevated rounded-2xl p-4 sm:p-6 lg:p-8 glow-primary gradient-border">
          {/* Mode Toggle */}
          <div className="flex items-center justify-center mb-3">
            <div className="inline-flex items-center p-1 rounded-xl bg-surface/80 border border-border max-w-full">
              <button type="button" aria-pressed={mode === "exact"} onClick={() => { setMode("exact"); setResult(null); setSmartResult(null); }}
                className={`px-4 sm:px-6 min-h-11 rounded-lg text-sm sm:text-[15px] font-medium transition-all duration-300 ${mode === "exact" ? "bg-surface-alt text-text shadow-md" : "text-text-muted hover:text-text-secondary"}`}>
                {t('tool.modeExact')}
              </button>
              <button type="button" aria-pressed={mode === "smart"} onClick={() => { setMode("smart"); setResult(null); setSmartResult(null); }}
                className={`px-3 sm:px-6 min-h-11 rounded-lg text-sm sm:text-[15px] font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${mode === "smart" ? "bg-surface-alt text-text shadow-md" : "text-text-muted hover:text-text-secondary"}`}>
                <Sparkles size={15} className="text-primary" />
                {t('tool.modeAi')}
                <span className="text-xs text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full font-medium">{t('tool.modeAiFree')}</span>
              </button>
            </div>
          </div>
          <div className="mx-auto mb-5 flex max-w-lg flex-col items-center justify-center gap-1.5 sm:flex-row">
            <label htmlFor="comparison-template" className="text-xs text-text-muted">{workspaceCopy.templates}</label>
            <select
              id="comparison-template"
              value={activeTemplate}
              onChange={(event) => handleTemplateChange(event.target.value)}
              className="min-h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text-secondary outline-none focus:border-primary/60 sm:w-auto"
            >
              <option value="">{workspaceCopy.customTemplate}</option>
              {COMPARISON_TEMPLATES.map((template) => {
                const localized = localizedTemplate(template, locale);
                return <option key={template.id} value={template.id}>{localized.name} — {localized.description}</option>;
              })}
            </select>
          </div>
          {mode === "smart" && (
            <div className="max-w-sm mx-auto -mt-2 mb-5 flex items-center gap-3 text-xs text-text-muted">
              <span className="shrink-0">{t("tool.similarityThreshold")}</span>
              <input
                aria-label={t("tool.similarityThreshold")}
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
            <ListInput label={t('tool.listALabel')} labelColor="#818cf8" value={listA} onChange={setListA} onFileNameChange={setFileNameA} placeholder={t('tool.listAPlaceholder')} />
            <button
              type="button"
              onClick={swapLists}
              className="lg:hidden justify-self-center inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-xl bg-surface-alt/70 border border-border hover:border-primary/40 text-sm text-text-secondary hover:text-text transition-all"
              aria-label={t('tool.swapLists')}
            >
              <ArrowLeftRight size={16} />
              {t('tool.swapLists')}
            </button>
            <ListInput label={t('tool.listBLabel')} labelColor="#22d3ee" value={listB} onChange={setListB} onFileNameChange={setFileNameB} placeholder={t('tool.listBPlaceholder')} />
            {/* Swap button - centered between the two inputs */}
            <button
              onClick={swapLists}
              type="button"
              aria-label={t('tool.swapLists')}
              className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-alt border border-border hover:border-primary/40 items-center justify-center transition-all hover:scale-110 z-10"
              title={t('tool.swapLists')}
            >
              <ArrowLeftRight size={16} className="text-text-muted" />
            </button>
          </div>

          {/* Action bar - single row, no conditional height changes */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              aria-expanded={showOptions}
              aria-controls="comparison-options"
              className="self-start min-h-11 px-1 text-sm text-text-muted hover:text-text-secondary flex items-center gap-1.5 transition-colors"
            >
              {showOptions ? <ChevronUp size={15} /> : <ChevronDown size={15} />} {t('tool.options')}
            </button>
            <div className="grid grid-cols-2 sm:flex items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button type="button" onClick={handleDemo} className="min-h-11 px-3 sm:px-5 text-sm sm:text-[15px] text-text-secondary hover:text-text border border-border rounded-xl hover:bg-surface-alt/50 transition-all whitespace-nowrap">
                {t('tool.tryDemo')}
              </button>
              <button
                type="button"
                onClick={isComparing ? cancelComparison : handleCompare}
                disabled={!isComparing && !listA.trim() && !listB.trim()}
                aria-busy={isComparing}
                title={isComparing ? workspaceCopy.cancel : undefined}
                className="btn-primary min-h-11 px-3 sm:px-8 text-sm sm:text-[15px] font-semibold text-white rounded-xl flex items-center justify-center gap-2 whitespace-nowrap">
                {isComparing ? (
                  <>{t("tool.analyzing")} {comparisonProgress}%</>
                ) : mode === "smart" ? (
                  <><Sparkles size={16} />{t('tool.compareWithAi')}</>
                ) : t('tool.compareLists')}
              </button>
            </div>
          </div>

          {/* Options - expands BELOW the bar, never shifts inputs */}
          {showOptions && (
            <div id="comparison-options" className="mt-4 pt-4 border-t border-border">
              <OptionsPanel {...options} onChange={(next) => { setOptions(next); setActiveTemplate(""); }} />
            </div>
          )}

          {/* Results */}
          {displayedResult && (
            <div
              ref={resultsRef}
              className="space-y-4 mt-6 animate-fade-up scroll-mt-28"
              id="results-section"
              aria-live="polite"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{t('tool.results')}</h3>
                <button onClick={() => { setResult(null); setSmartResult(null); }} className="text-xs text-text-muted hover:text-text-secondary transition-colors">{t('tool.clearResults')}</button>
              </div>
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{activeProjectName || workspaceCopy.compareNewVersion}</p>
                  <p className="text-xs text-text-muted mt-0.5">{workspaceCopy.compareNewVersionDescription}</p>
                </div>
                <div className="grid grid-cols-1 min-[420px]:grid-cols-3 sm:flex gap-2 shrink-0">
                  <button type="button" onClick={() => setShowSaveProject(true)} className="min-h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/60 px-4 text-sm text-text-secondary hover:text-text hover:bg-surface-alt/50">
                    <Save size={15} /> {workspaceCopy.saveProject}
                  </button>
                  <button type="button" onClick={() => setShowShareProject(true)} className="min-h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/60 px-4 text-sm text-text-secondary hover:text-text hover:bg-surface-alt/50">
                    <Share2 size={15} /> {workspaceCopy.shareProject}
                  </button>
                  <button type="button" onClick={handleCompareNewVersion} className="min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-primary/15 border border-primary/30 px-4 text-sm text-primary hover:bg-primary/20">
                    <RefreshCcw size={15} /> {workspaceCopy.compareNewVersion}
                  </button>
                </div>
              </div>
              <StatsCards stats={displayedResult.stats} />
              <button type="button" onClick={() => setShowVennOnMobile((visible) => !visible)} className="lg:hidden min-h-11 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border text-sm text-text-secondary">
                <BarChart3 size={15} /> {showVennOnMobile ? workspaceCopy.hideChart : workspaceCopy.showChart}
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className={`${showVennOnMobile ? "block" : "hidden"} lg:block`}>
                  <VennDiagram totalA={displayedResult.stats.totalA} totalB={displayedResult.stats.totalB} common={displayedResult.stats.common} onlyA={displayedResult.stats.uniqueA} onlyB={displayedResult.stats.uniqueB} />
                </div>
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
              {smartResult.fuzzyMatches.length > 0 && (
                <FuzzyMatchTable
                  matches={smartResult.fuzzyMatches}
                  rejected={rejectedFuzzyMatches}
                  onDecision={(matchId, accepted) => setRejectedFuzzyMatches((current) => {
                    const next = new Set(current);
                    if (accepted) next.delete(matchId); else next.add(matchId);
                    return next;
                  })}
                />
              )}
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
                      aiRate: String(acceptedMatchRate),
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

      {!displayedResult && (listA.trim() || listB.trim()) && (
        <div className="sm:hidden fixed left-3 right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 rounded-2xl border border-primary/30 bg-[#0f1629]/95 p-2 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={isComparing ? cancelComparison : handleCompare}
            aria-busy={isComparing}
            title={isComparing ? workspaceCopy.cancel : undefined}
            className="btn-primary min-h-12 w-full rounded-xl text-sm font-semibold text-white inline-flex items-center justify-center gap-2"
          >
            {!isComparing && mode === "smart" && <Sparkles size={16} />}
            {isComparing
              ? `${t("tool.analyzing")} ${comparisonProgress}%`
              : mode === "smart" ? t("tool.compareWithAi") : t("tool.compareLists")}
          </button>
        </div>
      )}

      {workspaceNotice && (
        <div role="status" aria-live="polite" className="fixed left-1/2 top-20 z-[90] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-success/30 bg-[#0f1629] px-4 py-3 text-sm text-success shadow-2xl">
          {workspaceNotice}
        </div>
      )}

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

      <ProjectPanel open={showProjects} onClose={() => setShowProjects(false)} onOpenProject={handleOpenProject} />
      {showSaveProject && (
        <SaveProjectDialog
          open={showSaveProject}
          defaultName={activeProjectName || `${fileNameA || t("tool.listALabel")} vs ${fileNameB || t("tool.listBLabel")}`}
          defaultSaveContent={Boolean(activeProjectId)}
          onClose={() => setShowSaveProject(false)}
          onSave={handleSaveProject}
        />
      )}
      {showShareProject && (
        <ShareProjectDialog
          listA={listA}
          listB={listB}
          mode={mode}
          smartThreshold={smartThreshold}
          options={options}
          onClose={() => setShowShareProject(false)}
        />
      )}
    </div>
  );
}
