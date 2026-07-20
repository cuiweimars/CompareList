"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertTriangle, Check, Copy, Download, FileSpreadsheet, GitCompareArrows, Save, Search, WandSparkles } from "lucide-react";
import {
  compareTables,
  DEFAULT_TABLE_RULES,
  suggestColumnMappings,
  suggestKeyColumns,
  type TableCompareResult,
  type TableCompareRules,
  type TableData,
} from "@/lib/table-compare";
import type { CompareUiOptions } from "@/lib/compare";
import { event as trackEvent, itemCountBucket } from "@/lib/gtag";
import { getWorkspaceCopy } from "@/lib/workspace-copy";
import { copyToClipboard } from "@/lib/export";

interface Props {
  tableA: TableData;
  tableB: TableData;
  options: CompareUiOptions;
}

function quoteCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

type RowCategory = "added" | "removed" | "changed" | "unchanged";

function DataRowsTable({ headers, rows, emptyLabel }: { headers: string[]; rows: string[][]; emptyLabel: string }) {
  if (rows.length === 0) return <div className="rounded-lg border border-border p-8 text-center text-sm text-text-muted">{emptyLabel}</div>;
  return (
    <div className="overflow-auto rounded-lg border border-border max-h-[360px]">
      <table className="w-full min-w-max text-xs">
        <thead className="sticky top-0 bg-[#141d31] text-text-secondary">
          <tr>{headers.map((header, index) => <th key={`${header}-${index}`} className="text-left p-2 font-medium">{header || `#${index + 1}`}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.slice(0, 200).map((row, rowIndex) => (
            <tr key={rowIndex}>{headers.map((_, index) => <td key={index} className="p-2 font-mono max-w-72 truncate" title={row[index] ?? ""}>{row[index] ?? ""}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TableComparePanel({ tableA, tableB, options }: Props) {
  const t = useTranslations("components.tableCompare");
  const locale = useLocale();
  const copy = getWorkspaceCopy(locale);
  const suggestedKeysA = useMemo(() => suggestKeyColumns(tableA), [tableA]);
  const suggestedKeysB = useMemo(() => suggestKeyColumns(tableB), [tableB]);
  const [keysA, setKeysA] = useState<number[]>(() => suggestKeyColumns(tableA));
  const [keysB, setKeysB] = useState<number[]>(() => suggestKeyColumns(tableB));
  const [rules, setRules] = useState<TableCompareRules>(() => ({
    ...DEFAULT_TABLE_RULES,
    columnMappings: suggestColumnMappings(tableA, tableB),
  }));
  const [activeCategory, setActiveCategory] = useState<RowCategory>("changed");
  const [filter, setFilter] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [copied, setCopied] = useState(false);
  const [rulesNotice, setRulesNotice] = useState(false);
  const [comparison, setComparison] = useState<{
    tableA: TableData;
    tableB: TableData;
    keySignature: string;
    result: TableCompareResult;
  } | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved = localStorage.getItem("comparelist-table-rules-v1");
        if (!saved) return;
        const parsed = JSON.parse(saved) as Partial<TableCompareRules>;
        setRules((current) => ({ ...current, ...parsed, columnMappings: current.columnMappings }));
      } catch {
        // Ignore malformed browser data and keep safe defaults.
      }
    });
  }, []);

  const keySignature = `${keysA.join(",")}:${keysB.join(",")}:${JSON.stringify(rules)}`;
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
    const nextResult = compareTables(tableA, tableB, keysA, keysB, options, rules);
    setComparison({
      tableA,
      tableB,
      keySignature,
      result: nextResult,
    });
    setActiveCategory(nextResult.changed.length > 0 ? "changed" : nextResult.added.length > 0 ? "added" : nextResult.removed.length > 0 ? "removed" : "unchanged");
    trackEvent("table_comparison_completed", {
      row_bucket: itemCountBucket(tableA.rows.length + tableB.rows.length),
      key_columns: Math.max(keysA.length, keysB.length),
      changed_bucket: itemCountBucket(nextResult.stats.changed),
    });
  }

  function updateMapping(indexA: number, indexB: number) {
    setRules((current) => ({
      ...current,
      columnMappings: indexB < 0
        ? current.columnMappings.filter((mapping) => mapping.indexA !== indexA)
        : [
            ...current.columnMappings.filter((mapping) => mapping.indexA !== indexA),
            { indexA, indexB },
          ].sort((left, right) => left.indexA - right.indexA),
    }));
  }

  function autoMapColumns() {
    setRules((current) => ({ ...current, columnMappings: suggestColumnMappings(tableA, tableB) }));
  }

  function rememberRules() {
    localStorage.setItem("comparelist-table-rules-v1", JSON.stringify({
      numericTolerance: rules.numericTolerance,
      normalizeDates: rules.normalizeDates,
      emptyValuesEqual: rules.emptyValuesEqual,
      ignorePunctuation: rules.ignorePunctuation,
    }));
    setRulesNotice(true);
    window.setTimeout(() => setRulesNotice(false), 2500);
    trackEvent("table_rules_saved", { mapped_columns: rules.columnMappings.length });
  }

  function exportCsvReport() {
    if (!result) return;
    const lines = [["category", "key", "column", "before", "after", "source_a", "source_b"].map(quoteCsv).join(",")];
    for (const row of result.added) {
      lines.push(["added", "", "", "", row.join(" | "), tableA.fileName ?? "A", tableB.fileName ?? "B"].map(quoteCsv).join(","));
    }
    for (const row of result.removed) {
      lines.push(["removed", "", "", row.join(" | "), "", tableA.fileName ?? "A", tableB.fileName ?? "B"].map(quoteCsv).join(","));
    }
    for (const row of result.changed) {
      for (const change of row.changes) {
        lines.push(["changed", row.key, change.column, change.before, change.after, tableA.fileName ?? "A", tableB.fileName ?? "B"].map(quoteCsv).join(","));
      }
    }
    const blob = new Blob(["\uFEFF", lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "comparelist-row-report.csv";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    trackEvent("table_report_exported", { format: "csv", row_bucket: itemCountBucket(result.stats.added + result.stats.removed + result.stats.changed) });
  }

  async function exportExcelReport() {
    if (!result) return;
    const XLSX = await import("@e965/xlsx");
    const workbook = XLSX.utils.book_new();
    const summary = [
      ["CompareList row comparison report"],
      ["Generated", new Date().toISOString()],
      ["Source A", tableA.fileName ?? "A"],
      ["Source B", tableB.fileName ?? "B"],
      ["Added", result.stats.added],
      ["Removed", result.stats.removed],
      ["Changed", result.stats.changed],
      ["Unchanged", result.stats.unchanged],
      ["Duplicate keys A", result.stats.duplicateKeysA],
      ["Duplicate keys B", result.stats.duplicateKeysB],
    ];
    const ruleRows = [
      ["Rule", "Value"],
      ["Key columns A", keysA.map((index) => tableA.headers[index]).join(" + ")],
      ["Key columns B", keysB.map((index) => tableB.headers[index]).join(" + ")],
      ["Numeric tolerance", rules.numericTolerance],
      ["Normalize dates", rules.normalizeDates],
      ["Empty values equal", rules.emptyValuesEqual],
      ["Ignore punctuation", rules.ignorePunctuation],
      ...rules.columnMappings.map((mapping) => [
        `Map: ${tableA.headers[mapping.indexA] || `#${mapping.indexA + 1}`}`,
        tableB.headers[mapping.indexB] || `#${mapping.indexB + 1}`,
      ]),
    ];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summary), "Summary");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(ruleRows), "Rules");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([tableB.headers, ...result.added]), "Added");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([tableA.headers, ...result.removed]), "Removed");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([
      ["Key", "Column", "Before", "After"],
      ...result.changed.flatMap((row) => row.changes.map((change) => [row.key, change.column, change.before, change.after])),
    ]), "Changed");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([tableA.headers, ...result.unchanged]), "Unchanged");
    XLSX.writeFile(workbook, "comparelist-row-report.xlsx", { compression: true });
    trackEvent("table_report_exported", { format: "xlsx", row_bucket: itemCountBucket(result.stats.added + result.stats.removed + result.stats.changed) });
  }

  const query = filter.trim().toLocaleLowerCase();
  const matchesQuery = (values: string[]) => !query || values.some((value) => value.toLocaleLowerCase().includes(query));
  const filteredAdded = result?.added.filter((row) => matchesQuery(row)) ?? [];
  const filteredRemoved = result?.removed.filter((row) => matchesQuery(row)) ?? [];
  const filteredUnchanged = result?.unchanged.filter((row) => matchesQuery(row)) ?? [];
  const filteredChanged = result?.changed.flatMap((row) => {
    const changes = row.changes.filter((change) => (
      (!fieldFilter || change.column === fieldFilter)
      && matchesQuery([row.key, change.column, change.before, change.after])
    ));
    return changes.length > 0 ? [{ ...row, changes }] : [];
  }) ?? [];
  const changedFields = result
    ? [...new Set(result.changed.flatMap((row) => row.changes.map((change) => change.column)))].sort()
    : [];

  async function copyFilteredRows() {
    const text = activeCategory === "changed"
      ? filteredChanged.flatMap((row) => row.changes.map((change) => [row.key, change.column, change.before, change.after].join("\t"))).join("\n")
      : (activeCategory === "added" ? filteredAdded : activeCategory === "removed" ? filteredRemoved : filteredUnchanged)
          .map((row) => row.join("\t"))
          .join("\n");
    if (!text || !(await copyToClipboard(text))) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
    trackEvent("table_results_copied", { category: activeCategory });
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
          { label: t("keyA"), headers: tableA.headers, keys: keysA, update: setKeysA, suggested: suggestedKeysA },
          { label: t("keyB"), headers: tableB.headers, keys: keysB, update: setKeysB, suggested: suggestedKeysB },
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
                  {group.suggested.includes(index) && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">{copy.recommendedKey}</span>
                  )}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface/45 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-text">{copy.compareRules}</h4>
            <p className="mt-0.5 text-xs text-text-muted">{copy.columnMapping}: {rules.columnMappings.length}/{tableA.headers.length}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={autoMapColumns} className="min-h-9 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 text-xs text-text-secondary hover:bg-surface-alt/50">
              <WandSparkles size={13} /> {copy.autoMap}
            </button>
            <button type="button" onClick={rememberRules} className="min-h-9 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 text-xs text-text-secondary hover:bg-surface-alt/50">
              <Save size={13} /> {rulesNotice ? copy.rulesSaved : copy.rememberRules}
            </button>
          </div>
        </div>

        <div className="max-h-52 overflow-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[#141d31] text-text-secondary">
              <tr><th className="p-2 text-left">A</th><th className="p-2 text-left">B</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tableA.headers.map((header, indexA) => {
                const mapped = rules.columnMappings.find((mapping) => mapping.indexA === indexA)?.indexB ?? -1;
                return (
                  <tr key={`${header}-${indexA}`}>
                    <td className="p-2 text-text-secondary">{header || `#${indexA + 1}`}</td>
                    <td className="p-2">
                      <select
                        aria-label={`${header || `#${indexA + 1}`} → B`}
                        value={mapped}
                        onChange={(event) => updateMapping(indexA, Number(event.target.value))}
                        className="min-h-9 w-full rounded-lg border border-border bg-surface px-2 text-xs text-text outline-none focus:border-primary/60"
                      >
                        <option value={-1}>{copy.ignoreColumn}</option>
                        {tableB.headers.map((target, indexB) => <option key={`${target}-${indexB}`} value={indexB}>{target || `#${indexB + 1}`}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs text-text-secondary">
            <span>{copy.numericTolerance}</span>
            <input
              type="number"
              min="0"
              step="any"
              value={rules.numericTolerance}
              onChange={(event) => setRules((current) => ({ ...current, numericTolerance: Math.max(0, Number(event.target.value) || 0) }))}
              className="min-h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none focus:border-primary/60"
            />
          </label>
          {([
            ["normalizeDates", copy.normalizeDates],
            ["emptyValuesEqual", copy.emptyValuesEqual],
            ["ignorePunctuation", copy.ignorePunctuation],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 text-xs text-text-secondary">
              <input type="checkbox" checked={rules[key]} onChange={(event) => setRules((current) => ({ ...current, [key]: event.target.checked }))} className="accent-primary" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-4">
        <span className="text-xs text-text-muted">{t("compositeHint")}</span>
        <button type="button" onClick={runComparison} className="btn-primary px-5 py-2 text-sm font-semibold text-white rounded-lg">
          {t("compareRows")}
        </button>
      </div>

      {result && (
        <div className="mt-5 pt-5 border-t border-border space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2" role="tablist" aria-label={copy.allRows}>
            {([
              ["added", result.stats.added, "text-success"],
              ["removed", result.stats.removed, "text-danger"],
              ["changed", result.stats.changed, "text-amber-500"],
              ["unchanged", result.stats.unchanged, "text-primary"],
            ] as const).map(([label, count, color]) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === label}
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`rounded-lg border p-3 text-center transition-colors ${activeCategory === label ? "border-primary/50 bg-primary/10" : "border-border bg-surface/60 hover:bg-surface-alt/40"}`}
              >
                <div className={`text-xl font-bold ${color}`}>{count}</div>
                <div className="text-xs text-text-muted">{label === "added" ? copy.addedRows : label === "removed" ? copy.removedRows : label === "changed" ? copy.changedRows : copy.unchangedRows}</div>
              </button>
            ))}
          </div>

          {(result.stats.duplicateKeysA > 0 || result.stats.duplicateKeysB > 0) && (
            <div className="flex items-start gap-2 text-xs text-amber-500 bg-amber-500/10 rounded-lg p-3">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{t("duplicateKeys", { a: result.stats.duplicateKeysA, b: result.stats.duplicateKeysB })}</span>
            </div>
          )}

          <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface/35 p-2 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder={copy.filterRows}
                className="min-h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text outline-none focus:border-primary/60"
              />
            </label>
            {activeCategory === "changed" && changedFields.length > 1 && (
              <select
                value={fieldFilter}
                onChange={(event) => setFieldFilter(event.target.value)}
                className="min-h-10 rounded-lg border border-border bg-surface px-3 text-xs text-text-secondary outline-none focus:border-primary/60"
              >
                <option value="">{copy.allRows}</option>
                {changedFields.map((field) => <option key={field} value={field}>{field}</option>)}
              </select>
            )}
            <button type="button" onClick={copyFilteredRows} className="min-h-10 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 text-xs text-text-secondary hover:bg-surface-alt/50">
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              {copy.copyFiltered}
            </button>
          </div>

          {activeCategory === "changed" && filteredChanged.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-surface-alt/50 text-text-secondary">
                  <tr><th className="text-left p-2">{t("key")}</th><th className="text-left p-2">{t("field")}</th><th className="text-left p-2">{t("before")}</th><th className="text-left p-2">{t("after")}</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredChanged.slice(0, 200).flatMap((row, rowIndex) => row.changes.map((change, changeIndex) => (
                    <tr key={`${row.key}-${change.column}-${rowIndex}-${changeIndex}`}>
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

          {activeCategory === "changed" && filteredChanged.length === 0 && (
            <div className="rounded-lg border border-border p-8 text-center text-sm text-text-muted">{copy.noRows}</div>
          )}
          {activeCategory === "added" && <DataRowsTable headers={tableB.headers} rows={filteredAdded} emptyLabel={copy.noRows} />}
          {activeCategory === "removed" && <DataRowsTable headers={tableA.headers} rows={filteredRemoved} emptyLabel={copy.noRows} />}
          {activeCategory === "unchanged" && <DataRowsTable headers={tableA.headers} rows={filteredUnchanged} emptyLabel={copy.noRows} />}

          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={exportCsvReport} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:text-text">
              <Download size={14} /> {copy.exportCsv}
            </button>
            <button type="button" onClick={exportExcelReport} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/10 text-sm text-primary hover:bg-primary/15">
              <FileSpreadsheet size={14} /> {copy.exportExcel}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
