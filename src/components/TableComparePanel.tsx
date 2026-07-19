"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, Download, GitCompareArrows } from "lucide-react";
import { compareTables, type TableCompareResult, type TableData } from "@/lib/table-compare";
import type { CompareUiOptions } from "@/lib/compare";

interface Props {
  tableA: TableData;
  tableB: TableData;
  options: CompareUiOptions;
}

function quoteCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export default function TableComparePanel({ tableA, tableB, options }: Props) {
  const t = useTranslations("components.tableCompare");
  const [keysA, setKeysA] = useState<number[]>([0]);
  const [keysB, setKeysB] = useState<number[]>([0]);
  const [comparison, setComparison] = useState<{
    tableA: TableData;
    tableB: TableData;
    keySignature: string;
    result: TableCompareResult;
  } | null>(null);

  const keySignature = `${keysA.join(",")}:${keysB.join(",")}`;
  const result = comparison?.tableA === tableA && comparison.tableB === tableB && comparison.keySignature === keySignature
    ? comparison.result
    : null;

  function toggleKey(current: number[], index: number, update: (value: number[]) => void) {
    if (current.includes(index)) {
      if (current.length > 1) update(current.filter((value) => value !== index));
    } else {
      update([...current, index].sort((a, b) => a - b));
    }
  }

  function runComparison() {
    setComparison({
      tableA,
      tableB,
      keySignature,
      result: compareTables(tableA, tableB, keysA, keysB, options),
    });
  }

  function exportReport() {
    if (!result) return;
    const lines = [["category", "key", "column", "before", "after"].map(quoteCsv).join(",")];
    for (const row of result.added) {
      lines.push(["added", "", "", "", row.join(" | ")].map(quoteCsv).join(","));
    }
    for (const row of result.removed) {
      lines.push(["removed", "", "", row.join(" | "), ""].map(quoteCsv).join(","));
    }
    for (const row of result.changed) {
      for (const change of row.changes) {
        lines.push(["changed", row.key, change.column, change.before, change.after].map(quoteCsv).join(","));
      }
    }
    const blob = new Blob(["\uFEFF", lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "comparelist-row-report.csv";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="mt-5 rounded-xl border border-primary/25 bg-primary/5 p-5">
      <div className="flex items-center gap-2 mb-2">
        <GitCompareArrows size={17} className="text-primary" />
        <h3 className="font-semibold">{t("title")}</h3>
      </div>
      <p className="text-xs text-text-secondary mb-4">{t("description")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: t("keyA"), headers: tableA.headers, keys: keysA, update: setKeysA },
          { label: t("keyB"), headers: tableB.headers, keys: keysB, update: setKeysB },
        ].map((group) => (
          <fieldset key={group.label} className="rounded-lg border border-border bg-surface/50 p-3">
            <legend className="px-1 text-xs font-medium text-text-secondary">{group.label}</legend>
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
              {group.headers.map((header, index) => (
                <label key={`${header}-${index}`} className="inline-flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={group.keys.includes(index)}
                    onChange={() => toggleKey(group.keys, index, group.update)}
                    className="accent-primary"
                  />
                  <span>{header || t("unnamedColumn", { index: index + 1 })}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 mt-4">
        <span className="text-xs text-text-muted">{t("compositeHint")}</span>
        <button type="button" onClick={runComparison} className="btn-primary px-5 py-2 text-sm font-semibold text-white rounded-lg">
          {t("compareRows")}
        </button>
      </div>

      {result && (
        <div className="mt-5 pt-5 border-t border-border space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {([
              ["added", result.stats.added, "text-success"],
              ["removed", result.stats.removed, "text-danger"],
              ["changed", result.stats.changed, "text-amber-500"],
              ["unchanged", result.stats.unchanged, "text-primary"],
            ] as const).map(([label, count, color]) => (
              <div key={label} className="rounded-lg border border-border bg-surface/60 p-3 text-center">
                <div className={`text-xl font-bold ${color}`}>{count}</div>
                <div className="text-xs text-text-muted">{t(label)}</div>
              </div>
            ))}
          </div>

          {(result.stats.duplicateKeysA > 0 || result.stats.duplicateKeysB > 0) && (
            <div className="flex items-start gap-2 text-xs text-amber-500 bg-amber-500/10 rounded-lg p-3">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{t("duplicateKeys", { a: result.stats.duplicateKeysA, b: result.stats.duplicateKeysB })}</span>
            </div>
          )}

          {result.changed.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-surface-alt/50 text-text-secondary">
                  <tr><th className="text-left p-2">{t("key")}</th><th className="text-left p-2">{t("field")}</th><th className="text-left p-2">{t("before")}</th><th className="text-left p-2">{t("after")}</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.changed.slice(0, 200).flatMap((row) => row.changes.map((change) => (
                    <tr key={`${row.key}-${change.column}`}>
                      <td className="p-2 font-mono">{row.key}</td>
                      <td className="p-2">{change.column}</td>
                      <td className="p-2 text-danger font-mono">{change.before}</td>
                      <td className="p-2 text-success font-mono">{change.after}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end">
            <button type="button" onClick={exportReport} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:text-text">
              <Download size={14} /> {t("exportReport")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
