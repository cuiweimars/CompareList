"use client";

import { useRef, useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Upload, X, FileText, Columns3, CheckSquare, Square, Table2, EyeOff } from "lucide-react";
import type { TableData } from "@/lib/table-compare";
import { parseList } from "@/lib/compare";
import { event as trackEvent, fileSizeBucket } from "@/lib/gtag";
import { isSupportedFileName, parseSupportedFile, type ParseFileOptions, type ParsedFile, type SupportedTextEncoding } from "@/lib/file-parsers";
import { getWorkspaceCopy } from "@/lib/workspace-copy";

interface ListInputProps {
  label: string;
  labelColor: string;
  value: string;
  onChange: (value: string) => void;
  onTableParsed?: (table: TableData | null) => void;
  onFileNameChange?: (fileName: string | null) => void;
  placeholder?: string;
}

export default function ListInput({
  label,
  labelColor,
  value,
  onChange,
  onTableParsed,
  onFileNameChange,
  placeholder = "Paste your list here, one item per line...",
}: ListInputProps) {
  const t = useTranslations("components.listInput");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const workspaceCopy = getWorkspaceCopy(locale);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvColumns, setCsvColumns] = useState<string[] | null>(null);
  const [csvRows, setCsvRows] = useState<string[][] | null>(null);
  const [excelSheets, setExcelSheets] = useState<{ name: string; data: string[][] }[] | null>(null);
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [selectedCols, setSelectedCols] = useState<Set<number>>(new Set([0]));
  const [showColPicker, setShowColPicker] = useState(false);
  const [showTablePreview, setShowTablePreview] = useState(true);
  const [fileEncoding, setFileEncoding] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [manualEncoding, setManualEncoding] = useState<"auto" | SupportedTextEncoding>("auto");
  const [manualDelimiter, setManualDelimiter] = useState<"auto" | "," | ";" | "\t" | "|">("auto");
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

  function applyParsedFile(file: File, parsed: ParsedFile): number | null {
    const sheets = parsed.sheets;
    const data = sheets[0]?.data ?? [];
    setExcelSheets(sheets.length > 1 ? sheets : null);
    setSelectedSheet(0);
    setFileEncoding(parsed.encoding ?? null);
    setShowTablePreview(true);
    if (data.length >= 2 && data[0].length >= 2) {
      const headers = data[0];
      const rows = data.slice(1);
      handleColumnsParsed(headers, rows, file.name);
      return rows.length;
    }
    const text = parsed.text ?? data.flat().filter((cell) => cell.trim()).join("\n");
    setCsvColumns(null);
    setCsvRows(null);
    onTableParsed?.(null);
    onChange(text);
    return null;
  }

  async function handleFile(file: File) {
    if (file.size > 50 * 1024 * 1024) {
      trackEvent("file_upload_failed", { reason: "too_large", size_bucket: fileSizeBucket(file.size) });
      setFileError(t("fileTooLarge"));
      setFileName(null);
      onFileNameChange?.(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      const ok = confirm(t("largeFileConfirm", { size: (file.size / 1024 / 1024).toFixed(1) }));
      if (!ok) return;
    }
    setFileError(null);
    setFileName(file.name);
    onFileNameChange?.(file.name);
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!isSupportedFileName(file.name)) {
      trackEvent("file_upload_failed", { reason: "unsupported_type", format: ext.slice(1) || "unknown" });
      setFileError(workspaceCopy.supportedFileTypes);
      setFileName(null);
      onFileNameChange?.(null);
      return;
    }

    setSourceFile(file);
    setManualEncoding("auto");
    setManualDelimiter("auto");

    try {
      const parsed = await parseSupportedFile(file);
      const rowCount = applyParsedFile(file, parsed);
      if (rowCount !== null) {
        trackEvent("file_upload_completed", { format: ext.slice(1), size_bucket: fileSizeBucket(file.size), row_bucket: rowCount <= 100 ? "1-100" : rowCount <= 1000 ? "101-1000" : "1000+" });
      } else {
        trackEvent("file_upload_completed", { format: ext.slice(1), size_bucket: fileSizeBucket(file.size) });
      }
    } catch {
      setFileError(workspaceCopy.fileParsingFailed);
      setFileName(null);
      onFileNameChange?.(null);
      setCsvColumns(null);
      setCsvRows(null);
      setExcelSheets(null);
      setFileEncoding(null);
      setSourceFile(null);
      onTableParsed?.(null);
      trackEvent("file_upload_failed", { reason: "parse_error", format: ext.slice(1) || "unknown", size_bucket: fileSizeBucket(file.size) });
    }
  }

  async function reparseTextFile(encoding: "auto" | SupportedTextEncoding, delimiter: "auto" | "," | ";" | "\t" | "|") {
    if (!sourceFile) return;
    const parseOptions: ParseFileOptions = {
      ...(encoding === "auto" ? {} : { encoding }),
      delimiter,
    };
    try {
      const parsed = await parseSupportedFile(sourceFile, parseOptions);
      applyParsedFile(sourceFile, parsed);
      setFileError(null);
      trackEvent("file_parser_setting_changed", { encoding, delimiter: delimiter === "\t" ? "tab" : delimiter === "auto" ? "auto" : delimiter });
    } catch {
      setFileError(workspaceCopy.fileParsingFailed);
    }
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
    setFileError(null);
    setFileName(null);
    onFileNameChange?.(null);
    setCsvColumns(null);
    setCsvRows(null);
    setExcelSheets(null);
    setFileEncoding(null);
    setSourceFile(null);
    setManualEncoding("auto");
    setManualDelimiter("auto");
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
          accept=".txt,.csv,.tsv,.xlsx,.xls,.xlsm,.ods"
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
                aria-expanded={showColPicker}
                aria-haspopup="menu"
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
              >
                <Columns3 size={12} />
                {colLabel}
              </button>
              {showColPicker && (
                <div role="menu" className="absolute left-0 top-full mt-1 w-72 max-w-[calc(100vw-2rem)] bg-[#0f1629] rounded-xl shadow-2xl border border-border z-30 py-1.5">
                  <div className="px-3 py-1.5 flex items-center justify-between border-b border-border mb-1">
                    <span className="text-xs font-medium text-text">{t("selectColumns")}</span>
                    <button
                      type="button"
                      onClick={handleAllOrReset}
                      className="text-xs text-amber-600 hover:underline"
                    >
                      {selCount === totalCols ? tCommon("reset") : tCommon("all")}
                    </button>
                  </div>
                  {csvColumns.map((col, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => toggleCol(i)}
                      role="menuitemcheckbox"
                      aria-checked={selectedCols.has(i)}
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
              {tCommon("rows", { count: csvRows.length })}
            </span>
          )}
          {fileEncoding && (
            <span className="text-xs text-text-muted bg-surface/50 px-2 py-1 rounded-lg border border-border">
              {workspaceCopy.detectedEncoding.replace("{encoding}", fileEncoding)}
            </span>
          )}
          {sourceFile && fileEncoding && (
            <>
              <label className="flex items-center gap-1 text-xs text-text-muted">
                <span>{workspaceCopy.encoding}</span>
                <select
                  value={manualEncoding}
                  onChange={(event) => {
                    const next = event.target.value as "auto" | SupportedTextEncoding;
                    setManualEncoding(next);
                    void reparseTextFile(next, manualDelimiter);
                  }}
                  className="min-h-9 rounded-lg border border-border bg-surface px-2 text-xs text-text-secondary"
                >
                  <option value="auto">{workspaceCopy.autoDetect}</option>
                  <option value="utf-8">UTF-8</option>
                  <option value="gb18030">GB18030 / GBK</option>
                  <option value="utf-16le">UTF-16LE</option>
                  <option value="utf-16be">UTF-16BE</option>
                </select>
              </label>
              <label className="flex items-center gap-1 text-xs text-text-muted">
                <span>{workspaceCopy.delimiter}</span>
                <select
                  value={manualDelimiter}
                  onChange={(event) => {
                    const next = event.target.value as "auto" | "," | ";" | "\t" | "|";
                    setManualDelimiter(next);
                    void reparseTextFile(manualEncoding, next);
                  }}
                  className="min-h-9 rounded-lg border border-border bg-surface px-2 text-xs text-text-secondary"
                >
                  <option value="auto">{workspaceCopy.autoDetect}</option>
                  <option value=",">,</option>
                  <option value=";">;</option>
                  <option value="\t">Tab</option>
                  <option value="|">|</option>
                </select>
              </label>
            </>
          )}
          {csvColumns && csvRows && (
            <button type="button" onClick={() => setShowTablePreview((visible) => !visible)} className="min-h-9 inline-flex items-center gap-1.5 rounded-lg border border-border px-2 text-xs text-text-secondary hover:bg-surface-alt/50">
              {showTablePreview ? <EyeOff size={13} /> : <Table2 size={13} />}
              {showTablePreview ? workspaceCopy.hidePreview : workspaceCopy.previewData}
            </button>
          )}
          {value && (
            <button
              type="button"
              onClick={clearInput}
              className="w-9 h-9 inline-flex items-center justify-center hover:bg-surface-alt/50 rounded-lg transition-colors ml-auto"
              title={tCommon("clear")}
              aria-label={`${tCommon("clear")} ${label}`}
            >
              <X size={13} className="text-text-muted" />
            </button>
          )}
        </div>
      )}

      {csvColumns && csvRows && showTablePreview && (
        <div className="mb-2 max-h-48 overflow-auto rounded-xl border border-border bg-surface/55">
          <table className="w-full min-w-max text-xs">
            <thead className="sticky top-0 bg-[#141d31] text-text-secondary">
              <tr>{csvColumns.map((column, index) => <th key={`${column}-${index}`} className="p-2 text-left font-medium">{column || `#${index + 1}`}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {csvRows.slice(0, 5).map((row, rowIndex) => (
                <tr key={rowIndex}>{csvColumns.map((_, columnIndex) => <td key={columnIndex} className="max-w-48 truncate p-2 font-mono text-text-muted" title={row[columnIndex] ?? ""}>{row[columnIndex] ?? ""}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {fileError && (
        <p role="alert" className="mb-2 rounded-lg border border-danger/25 bg-danger/10 px-3 py-2 text-sm text-danger">
          {fileError}
        </p>
      )}

      {/* Textarea container - resizable via bottom-right drag handle */}
      <div
        className={`relative rounded-xl transition-colors duration-300 w-full min-h-[180px] group/container ${
          csvColumns ? "h-[320px] sm:h-[360px]" : "h-[240px] sm:h-[300px] lg:h-[340px]"
        }`}
        style={{ resize: "vertical", overflow: "hidden" }}
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
          onChange={(e) => { onChange(e.target.value); setFileError(null); setFileName(null); onFileNameChange?.(null); setCsvColumns(null); setCsvRows(null); setExcelSheets(null); setFileEncoding(null); setSourceFile(null); setManualEncoding("auto"); setManualDelimiter("auto"); onTableParsed?.(null); }}
          placeholder={placeholder}
          className="relative w-full h-full p-4 sm:p-5 bg-transparent resize-none outline-none text-[15px] font-mono leading-7 text-text placeholder:text-text-muted/70"
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
