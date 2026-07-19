"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Copy, Download, Check, Search, ArrowUpDown, FileSpreadsheet, CheckSquare, Square } from "lucide-react";
import { copyToClipboard, downloadAsCSV, downloadAsText, downloadCsvContent } from "@/lib/export";

interface ResultTabsProps {
  onlyInA: string[];
  onlyInB: string[];
  inBoth: string[];
}

type TabKey = "onlyA" | "onlyB" | "both" | "union" | "symDiff" | "all";
type SortMode = "original" | "asc" | "desc";

export default function ResultTabs({ onlyInA, onlyInB, inBoth }: ResultTabsProps) {
  const t = useTranslations("components.resultTabs");
  const [activeTab, setActiveTab] = useState<TabKey>("onlyA");
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("original");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [visibleCount, setVisibleCount] = useState(200);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export menu on outside click or Escape
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowExportMenu(false);
    }
    if (showExportMenu) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showExportMenu]);

  const tabs: { key: TabKey; label: string; short: string; count: number; color: string }[] = [
    { key: "onlyA", label: t("tabs.onlyA.label"), short: t("tabs.onlyA.short"), count: onlyInA.length, color: "#fbbf24" },
    { key: "onlyB", label: t("tabs.onlyB.label"), short: t("tabs.onlyB.short"), count: onlyInB.length, color: "#22d3ee" },
    { key: "both", label: t("tabs.both.label"), short: t("tabs.both.short"), count: inBoth.length, color: "#34d399" },
    {
      key: "union", label: t("tabs.union.label"), short: t("tabs.union.short"),
      count: new Set([...onlyInA, ...inBoth, ...onlyInB]).size,
      color: "#a78bfa",
    },
    {
      key: "symDiff", label: t("tabs.symDiff.label"), short: t("tabs.symDiff.short"),
      count: onlyInA.length + onlyInB.length,
      color: "#f472b6",
    },
    {
      key: "all", label: t("tabs.all.label"), short: t("tabs.all.short"),
      count: onlyInA.length + onlyInB.length + inBoth.length,
      color: "#818cf8",
    },
  ];

  const rawList = useMemo(() => {
    switch (activeTab) {
      case "onlyA": return onlyInA;
      case "onlyB": return onlyInB;
      case "both": return inBoth;
      case "union": return [...new Set([...onlyInA, ...inBoth, ...onlyInB])];
      case "symDiff": return [...onlyInA, ...onlyInB];
      case "all": return [...onlyInA, ...inBoth, ...onlyInB];
    }
  }, [activeTab, inBoth, onlyInA, onlyInB]);

  const currentList = useMemo(() => {
    let list = rawList;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((item) => item.toLowerCase().includes(q));
    }
    if (sortMode === "asc") list = [...list].sort((a, b) => a.localeCompare(b));
    if (sortMode === "desc") list = [...list].sort((a, b) => b.localeCompare(a));
    return list;
  }, [rawList, search, sortMode]);

  function cycleSort() {
    setSortMode((m) => m === "original" ? "asc" : m === "asc" ? "desc" : "original");
  }

  async function handleCopy() {
    const ok = await copyToClipboard(currentList.join("\n"));
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }

  function handleDownloadCSV() { downloadAsCSV(currentList, `compare-list-${activeTab}.csv`); setShowExportMenu(false); }
  function handleDownloadTXT() { downloadAsText(currentList.join("\n"), `compare-list-${activeTab}.txt`); setShowExportMenu(false); }

  function handleExportFullReport() {
    const header = '"Category","Item"';
    const rows: string[] = [header];
    for (const item of onlyInA) rows.push(`"Only in A","${item.replace(/"/g, '""')}"`);
    for (const item of onlyInB) rows.push(`"Only in B","${item.replace(/"/g, '""')}"`);
    for (const item of inBoth) rows.push(`"In Both","${item.replace(/"/g, '""')}"`);
    downloadCsvContent(rows.join("\r\n"), "compare-list-full-report.csv");
    setShowExportMenu(false);
  }

  function toggleSelect(item: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item); else next.add(item);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === currentList.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(currentList));
    }
  }

  function handleCopySelected() {
    const sel = currentList.filter((item) => selected.has(item));
    if (sel.length === 0) return;
    copyToClipboard(sel.join("\n")).then((ok) => {
      if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
    });
  }

  const sortLabel = sortMode === "asc" ? t("sortAsc") : sortMode === "desc" ? t("sortDesc") : t("sort");
  const isComputedTab = activeTab === "union" || activeTab === "symDiff" || activeTab === "all";

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Tab bar — a visible 3 × 2 grid on phones, a compact row elsewhere */}
      <div className="border-b border-border">
        <div className="grid grid-cols-3 sm:flex sm:overflow-x-auto px-1" role="tablist">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.key}
              id={`result-tab-${tab.key}`}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls="comparison-result-panel"
              onClick={() => { setActiveTab(tab.key); setSearch(""); setSelected(new Set()); setVisibleCount(200); }}
              className={`min-h-11 px-2 sm:px-2.5 py-2 text-xs font-medium transition-all relative sm:shrink-0 ${
                activeTab === tab.key ? "text-text" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <span className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: tab.color }}
                />
                <span className="xl:inline hidden">{tab.label}</span>
                <span className="xl:hidden">{tab.short}</span>
                <span className="text-text-muted tabular-nums">{tab.count}</span>
              </span>
              {activeTab === tab.key && (
                <span
                  className="absolute bottom-0 left-1.5 right-1.5 h-[2px] rounded-full"
                  style={{ background: tab.color }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar — actions stay readable instead of compressing on phones */}
      <div className="px-3 py-2.5 border-b border-border bg-surface/30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!isComputedTab && (
              <button
                type="button"
                onClick={toggleSelectAll}
                aria-label={selected.size === currentList.length ? t("deselect") : t("select")}
                className="w-9 h-9 inline-flex items-center justify-center text-text-muted hover:text-text transition-colors shrink-0 rounded-lg hover:bg-surface-alt/50"
                title={selected.size === currentList.length ? t("deselect") : t("select")}
              >
                {selected.size === currentList.length && currentList.length > 0
                  ? <CheckSquare size={15} className="text-primary" />
                  : <Square size={15} />}
              </button>
            )}
            <div className="relative flex-1 min-w-0 sm:max-w-[240px]">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("filter")}
                className="w-full h-9 pl-8 pr-2 text-sm bg-surface-alt/50 rounded-lg border border-border outline-none focus:border-primary/40 transition-colors placeholder:text-text-muted/70"
              />
            </div>
            <button
              type="button"
              onClick={cycleSort}
              className={`min-h-9 flex items-center gap-1 px-2.5 text-xs rounded-lg border shrink-0 transition-all ${
                sortMode !== "original" ? "border-primary/30 bg-primary/5 text-primary" : "border-border text-text-muted hover:text-text-secondary"
              }`}
            >
              <ArrowUpDown size={13} />
              {sortLabel}
            </button>
          </div>

          <div className="flex items-center justify-end gap-1.5 shrink-0">
            {selected.size > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-primary font-medium" aria-live="polite">{selected.size}</span>
                <button type="button" onClick={handleCopySelected} aria-label={t("copySelected")} className="w-9 h-9 inline-flex items-center justify-center text-primary hover:bg-primary/10 rounded-lg transition-colors" title={t("copySelected")}>
                  <Copy size={14} />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-9 flex items-center gap-1.5 px-3 text-xs text-text-secondary hover:text rounded-lg border border-border hover:bg-surface-alt/50 transition-colors shrink-0"
            >
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              {copied ? t("copied") : t("copy")}
            </button>
            <div className="relative shrink-0" ref={exportMenuRef}>
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                aria-expanded={showExportMenu}
                aria-haspopup="menu"
                className="min-h-9 flex items-center gap-1.5 px-3 text-xs text-text-secondary hover:text rounded-lg border border-border hover:bg-surface-alt/50 transition-colors"
              >
                <Download size={14} />
                {t("export")}
              </button>
              {showExportMenu && (
                <div role="menu" className="absolute right-0 top-full mt-1 w-44 bg-[#0f1629] rounded-lg shadow-xl border border-border z-20 py-1">
                  <button type="button" role="menuitem" onClick={handleCopy} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-text-secondary hover:bg-surface-alt/50 transition-colors">
                    {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                    {copied ? t("copied") : t("copyAll")}
                  </button>
                  <button type="button" role="menuitem" onClick={handleDownloadCSV} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-text-secondary hover:bg-surface-alt/50 transition-colors">
                    <Download size={13} /> {t("downloadCsv")}
                  </button>
                  <button type="button" role="menuitem" onClick={handleDownloadTXT} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-text-secondary hover:bg-surface-alt/50 transition-colors">
                    <Download size={13} /> {t("downloadTxt")}
                  </button>
                  <div className="my-1 border-t border-border" />
                  <button type="button" role="menuitem" onClick={handleExportFullReport} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-text-secondary hover:bg-surface-alt/50 transition-colors">
                    <FileSpreadsheet size={13} /> {t("fullReport")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results list */}
      <div
        id="comparison-result-panel"
        role="tabpanel"
        aria-labelledby={`result-tab-${activeTab}`}
        className="max-h-[380px] overflow-y-auto overflow-x-hidden"
        onScroll={(e) => {
        const el = e.currentTarget;
        if (el.scrollHeight - el.scrollTop - el.clientHeight < 100 && visibleCount < currentList.length) {
          setVisibleCount((c) => Math.min(c + 200, currentList.length));
        }
        }}
      >
        {currentList.length === 0 ? (
          <div className="p-10 text-center text-text-muted text-base">
            {search ? t("noItemsFilter") : t("noItemsCategory")}
          </div>
        ) : (
          <div className="p-1">
            {currentList.slice(0, visibleCount).map((item, i) => (
              <div
                key={i}
                className={`px-2 py-2 rounded-lg transition-colors flex items-center gap-2 group ${
                  selected.has(item) ? "bg-primary/8" : "hover:bg-surface-alt/30"
                }`}
              >
                {!isComputedTab && (
                <input
                  type="checkbox"
                  checked={selected.has(item)}
                  onChange={() => toggleSelect(item)}
                  aria-label={item}
                  className="shrink-0 accent-primary cursor-pointer w-3.5 h-3.5"
                />
                )}
                <span className="flex-1 min-w-0 truncate text-sm font-mono text-text-secondary" title={item}>
                  {item}
                </span>
              </div>
            ))}
            {visibleCount < currentList.length && (
              <div className="py-2 text-center text-xs text-text-muted">{t("showingItems", { visible: visibleCount, total: currentList.length })}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
