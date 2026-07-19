"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Upload, X, FileText, Columns3, CheckSquare, Square } from "lucide-react";
import type { TableData } from "@/lib/table-compare";
import { parseList } from "@/lib/compare";

interface ListInputProps {
  label: string;
  labelColor: string;
  value: string;
  onChange: (value: string) => void;
  onTableParsed?: (table: TableData | null) => void;
  placeholder?: string;
}

export default function ListInput({
  label,
  labelColor,
  value,
  onChange,
  onTableParsed,
  placeholder = "Paste your list here, one item per line...",
}: ListInputProps) {
  const t = useTranslations("components.listInput");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvColumns, setCsvColumns] = useState<string[] | null>(null);
  const [csvRows, setCsvRows] = useState<string[][] | null>(null);
  const [excelSheets, setExcelSheets] = useState<{ name: string; data: string[][] }[] | null>(null);
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [selectedCols, setSelectedCols] = useState<Set<number>>(new Set([0]));
  const [showColPicker, setShowColPicker] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const lineCount = value ? parseList(value, { removeDuplicates: false }).length : 0;

  // Close column picker on outside click or Escape
  useEffect(() => {
    if (!showColPicker) return;
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowColPicker(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowColPicker(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showColPicker]);

  function emitSelectedColumns(selection: Set<number>, rows: string[][] | null = csvRows) {
    if (!rows || selection.size === 0) return;
    const indices = Array.from(selection).sort((a, b) => a - b);
    const lines = rows
      .map((row) => indices.map((columnIndex) => row[columnIndex] || "").join(" | "))
      .filter((line) => line.replace(/\s*\|\s*/g, "").length > 0);
    onChange(lines.join("\n"));
  }

  function handleColumnsParsed(headers: string[], rows: string[][], parsedFileName?: string) {
    setCsvColumns(headers);
    setCsvRows(rows);
    setSelectedCols(new Set([0]));
    onTableParsed?.({ headers, rows, fileName: parsedFileName });
    // Emit first column by default
    const colData = rows.map((r) => r[0] || "").filter((s) => s.length > 0).join("\n");
    onChange(colData);
  }

  function parseDelimited(text: string, delimiter: string): string[][] {
    const rows: string[][] = [];
    let fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < text.length && text[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === delimiter) {
          fields.push(current.trim());
          current = "";
        } else if (ch === "\n" || ch === "\r") {
          if (ch === "\r" && text[i + 1] === "\n") i++;
          fields.push(current.trim());
          if (fields.some((field) => field.length > 0)) rows.push(fields);
          fields = [];
          current = "";
        } else {
          current += ch;
        }
      }
    }
    fields.push(current.trim());
    if (fields.some((field) => field.length > 0)) rows.push(fields);
    return rows;
  }

  function detectColumns(text: string, ext: string): { headers: string[]; rows: string[][] } | null {
    const delimiter = ext === ".tsv" ? "\t" : ext === ".csv" ? "," : null;
    if (!delimiter) return null;
    const parsedRows = parseDelimited(text, delimiter);
    if (parsedRows.length < 2) return null;
    const firstRow = parsedRows[0];
    firstRow[0] = firstRow[0]?.replace(/^\uFEFF/, "") ?? "";
    if (firstRow.length < 2) return null;
    const rows = parsedRows.slice(1);
    return { headers: firstRow, rows };
  }

  async function handleFile(file: File) {
    if (file.size > 50 * 1024 * 1024) {
      alert(t("fileTooLarge"));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      const ok = confirm(t("largeFileConfirm", { size: (file.size / 1024 / 1024).toFixed(1) }));
      if (!ok) return;
    }
    setFileName(file.name);
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (![".txt", ".csv", ".tsv", ".xlsx"].includes(ext)) {
      alert(t("unsupportedFileType"));
      setFileName(null);
      return;
    }

    if (ext === ".xlsx") {
      try {
        const { default: readWorkbook } = await import("read-excel-file/browser");
        const workbook = await readWorkbook(file);
        const sheets = workbook.map(({ sheet, data }) => ({
          name: sheet,
          data: data.map((row) => row.map((cell) => cell instanceof Date ? cell.toISOString() : String(cell ?? ""))),
        }));
        const data = sheets[0]?.data ?? [];
        setExcelSheets(sheets);
        setSelectedSheet(0);
        if (data.length < 2) {
          const text = data.flat().filter((s) => String(s).trim()).join("\n");
          onTableParsed?.(null);
          onChange(text);
          return;
        }
        const headers = data[0];
        const rows = data.slice(1);
        handleColumnsParsed(headers, rows, file.name);
      } catch {
        const text = await file.text();
        onTableParsed?.(null);
        onChange(text);
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = detectColumns(text, ext);
      setExcelSheets(null);
      if (parsed && parsed.headers.length >= 2) {
        handleColumnsParsed(parsed.headers, parsed.rows, file.name);
      } else {
        setCsvColumns(null);
        setCsvRows(null);
        onTableParsed?.(null);
        onChange(text);
      }
    };
    reader.readAsText(file);
  }

  function toggleCol(idx: number) {
    const next = new Set(selectedCols);
    if (next.has(idx)) {
      if (next.size > 1) next.delete(idx);
    } else {
      next.add(idx);
    }
    setSelectedCols(next);
    emitSelectedColumns(next);
  }

  function handleAllOrReset() {
    if (!csvColumns) return;
    const next = selCount === totalCols
      ? new Set([0])
      : new Set(csvColumns.map((_, index) => index));
    setSelectedCols(next);
    emitSelectedColumns(next);
    setShowColPicker(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function clearInput() {
    onChange("");
    setFileName(null);
    setCsvColumns(null);
    setCsvRows(null);
    setExcelSheets(null);
    setSelectedSheet(0);
    setSelectedCols(new Set([0]));
    onTableParsed?.(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const displayName = fileName
    ? fileName.length > 18 ? fileName.slice(0, 8) + "..." + fileName.slice(-7) : fileName
    : null;

  const selCount = selectedCols.size;
  const totalCols = csvColumns?.length ?? 0;
  const colLabel = totalCols > 0
    ? selCount === totalCols ? t("allColumns") : selCount === 1 ? csvColumns![Array.from(selectedCols)[0]] : t("columnsCount", { count: selCount })
    : "";

  // Preview: show how first row combines
  const previewRow = csvRows && csvRows.length > 0 && selCount > 0
    ? Array.from(selectedCols).sort((a, b) => a - b).map((ci) => csvRows[0][ci] || "").join(" | ")
    : null;

  return (
    <div className="flex flex-col min-w-0">
      {/* Row 1: Label + Upload button */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: labelColor,
              boxShadow: `0 0 10px ${labelColor}60`,
            }}
          />
          <span className="font-semibold text-sm tracking-wide uppercase text-text-secondary font-[family-name:var(--font-sora)]">
            {label}
          </span>
          {lineCount > 0 && (
            <span className="text-xs text-text-muted bg-surface-alt/50 px-2 py-0.5 rounded-full border border-border">
              {t("items", { count: lineCount })}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          aria-label={`${t("upload")} ${label}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-alt/40 hover:bg-surface-alt/70 hover:border-border-active transition-all text-text-secondary hover:text-text text-xs font-medium shrink-0"
        >
          <Upload size={14} />
          {t("upload")}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.csv,.tsv,.xlsx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Row 2: File info + column selector */}
      {(fileName || csvColumns) && (
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {displayName && (
            <span className="flex items-center gap-1 text-xs text-text-muted bg-surface/50 px-2 py-1 rounded-lg border border-border max-w-[200px]" title={fileName ?? undefined}>
              <FileText size={12} className="shrink-0" />
              <span className="truncate">{displayName}</span>
            </span>
          )}
          {csvColumns && csvColumns.length >= 2 && (
            <div className="relative" ref={pickerRef}>
              <button
                type="button"
                onClick={() => setShowColPicker(!showColPicker)}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
              >
                <Columns3 size={12} />
                {colLabel}
              </button>
              {showColPicker && (
                <div className="absolute left-0 top-full mt-1 w-72 bg-[#0f1629] rounded-xl shadow-2xl border border-border z-30 py-1.5">
                  <div className="px-3 py-1.5 flex items-center justify-between border-b border-border mb-1">
                    <span className="text-xs font-medium text-text">{t("selectColumns")}</span>
                    <button
                      type="button"
                      onClick={handleAllOrReset}
                      className="text-xs text-amber-600 hover:underline"
                    >
                      {selCount === totalCols ? "Reset" : "All"}
                    </button>
                  </div>
                  {csvColumns.map((col, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => toggleCol(i)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-alt/50 transition-colors"
                    >
                      {selectedCols.has(i)
                        ? <CheckSquare size={13} className="text-amber-500 shrink-0" />
                        : <Square size={13} className="text-text-muted shrink-0" />
                      }
                      <span className="truncate flex-1 text-left">{col}</span>
                      {csvRows && csvRows[0] && (
                        <span className="text-[10px] text-text-muted/60 truncate max-w-[100px] text-right">
                          {csvRows[0][i] || "—"}
                        </span>
                      )}
                    </button>
                  ))}
                  {previewRow && (
                    <div className="mx-3 mt-1.5 pt-1.5 border-t border-border">
                      <p className="text-[10px] text-text-muted mb-0.5">{t("previewRow")}</p>
                      <p className="text-[10px] text-text-secondary font-mono truncate">{previewRow}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {excelSheets && excelSheets.length > 1 && (
            <label className="flex items-center gap-1 text-xs text-text-muted">
              <span>{t("sheet")}</span>
              <select
                value={selectedSheet}
                onChange={(event) => {
                  const index = Number(event.target.value);
                  const data = excelSheets[index]?.data ?? [];
                  setSelectedSheet(index);
                  if (data.length >= 2) handleColumnsParsed(data[0], data.slice(1), fileName ?? undefined);
                }}
                className="rounded-lg border border-border bg-surface px-2 py-1 text-xs text-text-secondary"
              >
                {excelSheets.map((sheet, index) => <option key={sheet.name} value={index}>{sheet.name}</option>)}
              </select>
            </label>
          )}
          {csvRows && csvRows.length > 0 && (
            <span className="text-xs text-text-muted bg-surface/50 px-2 py-1 rounded-lg border border-border">
              {csvRows.length.toLocaleString()} rows
            </span>
          )}
          {value && (
            <button
              type="button"
              onClick={clearInput}
              className="p-1 hover:bg-surface-alt/50 rounded-lg transition-colors ml-auto"
              title="Clear"
            >
              <X size={13} className="text-text-muted" />
            </button>
          )}
        </div>
      )}

      {/* Textarea container - resizable via bottom-right drag handle */}
      <div
        className={`relative rounded-xl transition-colors duration-300 w-full group/container`}
        style={{ minHeight: "200px", height: csvColumns ? "420px" : "460px", resize: "vertical", overflow: "hidden" }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {dragOver && (
          <div className="absolute inset-0 rounded-xl ring-2 ring-primary/50 bg-primary/5 z-10 pointer-events-none" />
        )}
        <textarea
          aria-label={label}
          value={value}
          onChange={(e) => { onChange(e.target.value); setFileName(null); setCsvColumns(null); setCsvRows(null); setExcelSheets(null); onTableParsed?.(null); }}
          placeholder={placeholder}
          className="relative w-full h-full p-5 bg-transparent resize-none outline-none text-[15px] font-mono leading-7 text-text placeholder:text-text-muted/40"
          spellCheck={false}
        />
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-xl pointer-events-none">
            <div className="flex flex-col items-center gap-2">
              <Upload size={28} className="text-primary" />
              <p className="text-primary font-semibold text-base">{t("dropFileHere")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
