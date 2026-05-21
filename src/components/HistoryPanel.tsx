"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Clock, Trash2, X, ChevronRight, RotateCcw } from "lucide-react";
import { getHistory, deleteComparison, clearHistory, ComparisonRecord } from "@/lib/history";

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
  onRestore?: (record: ComparisonRecord) => void;
}

export default function HistoryPanel({ open, onClose, onRestore }: HistoryPanelProps) {
  const t = useTranslations("components.historyPanel");
  const [records, setRecords] = useState<ComparisonRecord[]>([]);

  useEffect(() => {
    if (open) setRecords(getHistory());
  }, [open]);

  if (!open) return null;

  function handleDelete(id: string) {
    deleteComparison(id);
    setRecords(getHistory());
  }

  function handleClear() {
    clearHistory();
    setRecords([]);
  }

  function handleRestore(record: ComparisonRecord) {
    onRestore?.(record);
    onClose();
  }

  function formatDate(ts: number) {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return t("justNow");
    if (diff < 3600000) return t("minutesAgo", { count: Math.floor(diff / 60000) });
    if (diff < 86400000) return t("hoursAgo", { count: Math.floor(diff / 3600000) });
    return d.toLocaleDateString();
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0f1629] shadow-2xl flex flex-col border-l border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock size={17} className="text-text-secondary" />
            <h3 className="font-semibold text-base font-[family-name:var(--font-sora)]">{t("title")}</h3>
            <span className="text-xs text-text-muted">{t("recordCount", { count: records.length })}</span>
          </div>
          <div className="flex items-center gap-2">
            {records.length > 0 && (
              <button onClick={handleClear} className="text-xs text-danger hover:underline">{t("clearAll")}</button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-surface-alt/50 rounded-lg">
              <X size={17} className="text-text-muted" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {records.length === 0 ? (
            <div className="p-10 text-center text-text-muted text-sm">{t("noComparisons")}</div>
          ) : (
            <div className="divide-y divide-border">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="px-5 py-4 hover:bg-surface-alt/20 transition-colors cursor-pointer group"
                  onClick={() => handleRestore(record)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          record.mode === "ai" ? "bg-primary/10 text-primary" : "bg-surface-alt text-text-secondary"
                        }`}
                      >
                        {record.mode === "ai" ? t("modeAi") : t("modeExact")}
                      </span>
                      <span className="text-xs text-text-muted">{formatDate(record.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }}
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-danger/10 rounded transition-all"
                        title="Delete"
                      >
                        <Trash2 size={13} className="text-danger" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary mb-1.5">
                    <span>{t("labelA", { count: record.listALength })}</span>
                    <span>{t("labelB", { count: record.listBLength })}</span>
                    <span className="font-semibold text-primary">{record.matchRate}%</span>
                    <span>{t("common", { count: record.commonCount })}</span>
                  </div>
                  {record.preview && (
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <RotateCcw size={11} />
                      <span>{t("clickToRestore")}</span>
                      {(record.preview.onlyInA.length >= 20 || record.preview.onlyInB.length >= 20 || record.preview.inBoth.length >= 20) && (
                        <span className="text-amber-500 ml-1">{t("partialData")}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
