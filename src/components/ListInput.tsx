"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X, FileText, Columns3, CheckSquare, Square } from "lucide-react";

interface ListInputProps {
  label: string;
  labelColor: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ListInput({
  label,
  labelColor,
  value,
  onChange,
  placeholder = "Paste your list here, one item per line...",
}: ListInputProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvColumns, setCsvColumns] = useState<string[] | null>(null);
  const [csvRows, setCsvRows] = useState<string[][] | null>(null);
  const [selectedCols, setSelectedCols] = useState<Set<number>>(new Set([0]));
  const [showColPicker, setShowColPicker] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const isInitialParseRef = useRef(false);

  const lineCount = value
    ? (csvColumns
        ? value.split("\n").filter((s) => s.trim().length > 0).length
        : value.split(/[\n,;\t]+/).map((s) => s.trim()).filter((s) => s.length > 0).length)
    : 0;

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

  // Emit data when column selection changes (skip initial parse — handled separately)
  useEffect(() => {
    if (isInitialParseRef.current) {
      isInitialParseRef.current = false;
      return;
    }
    if (!csvRows || selectedCols.size === 0) return;
    const indices = Array.from(selectedCols).sort((a, b) => a - b);
    const lines = csvRows.map((row) => {
      return indices.map((ci) => row[ci] || "").join(" | ");
    }).filter((line) => line.replace(/\s*\|\s*/g, "").length > 0);
    onChange(lines.join("\n"));
  }, [selectedCols]);

  function handleColumnsParsed(headers: string[], rows: string[][]) {
    setCsvColumns(headers);
    setCsvRows(rows);
    isInitialParseRef.current = true;
    setSelectedCols(new Set([0]));
    // Emit first column by default
    const colData = rows.map((r) => r[0] || "").filter((s) => s.length > 0).join("\n");
    onChange(colData);
  }

  function splitCsvLine(line: string, delimiter: string): string[] {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
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
        } else {
          current += ch;
        }
      }
    }
    fields.push(current.trim());
    return fields;
  }

  function detectColumns(text: string, ext: string): { headers: string[]; rows: string[][] } | null {
    const delimiter = ext === ".tsv" ? "\t" : ext === ".csv" ? "," : null;
    if (!delimiter) return null;
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) return null;
    const firstRow = splitCsvLine(lines[0], delimiter);
    if (firstRow.length < 2) return null;
    const rows = lines.slice(1).map((l) => splitCsvLine(l, delimiter));
    return { headers: firstRow, rows };
  }

  async function handleFile(file: File) {
    if (file.size > 50 * 1024 * 1024) {
      alert("File too large. Please use files under 50MB.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      const ok = confirm(`This file is ${(file.size / 1024 / 1024).toFixed(1)}MB. Large files may be slow to process. Continue?`);
      if (!ok) return;
    }
    setFileName(file.name);
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (ext === ".xlsx" || ext === ".xls") {
      try {
        const XLSX = await import("xlsx");
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (data.length < 2) {
          const text = data.flat().filter((s) => String(s).trim()).join("\n");
          onChange(text);
          return;
        }
        const headers = data[0].map((h) => String(h));
        const rows = data.slice(1).map((r) => r.map((c) => String(c ?? "")));
        handleColumnsParsed(headers, rows);
      } catch {
        const text = await file.text();
        onChange(text);
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = detectColumns(text, ext);
      if (parsed && parsed.headers.length >= 2) {
        handleColumnsParsed(parsed.headers, parsed.rows);
      } else {
        setCsvColumns(null);
        setCsvRows(null);
        onChange(text);
      }
    };
    reader.readAsText(file);
  }

  function toggleCol(idx: number) {
    setSelectedCols((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        if (next.size > 1) next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }

  function handleAllOrReset() {
    if (!csvColumns) return;
    if (selCount === totalCols) {
      setSelectedCols(new Set([0]));
    } else {
      setSelectedCols(new Set(csvColumns.map((_, i) => i)));
    }
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
    setSelectedCols(new Set([0]));
    if (fileRef.current) fileRef.current.value = "";
  }

  const displayName = fileName
    ? fileName.length > 18 ? fileName.slice(0, 8) + "..." + fileName.slice(-7) : fileName
    : null;

  const selCount = selectedCols.size;
  const totalCols = csvColumns?.length ?? 0;
  const colLabel = totalCols > 0
    ? selCount === totalCols ? "All columns" : selCount === 1 ? csvColumns![Array.from(selectedCols)[0]] : `${selCount} columns`
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
              {lineCount} items
            </span>
          )}
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-alt/40 hover:bg-surface-alt/70 hover:border-border-active transition-all text-text-secondary hover:text-text text-xs font-medium shrink-0"
        >
          <Upload size={14} />
          Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.csv,.tsv,.xls,.xlsx"
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
                onClick={() => setShowColPicker(!showColPicker)}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
              >
                <Columns3 size={12} />
                {colLabel}
              </button>
              {showColPicker && (
                <div className="absolute left-0 top-full mt-1 w-72 bg-[#0f1629] rounded-xl shadow-2xl border border-border z-30 py-1.5">
                  <div className="px-3 py-1.5 flex items-center justify-between border-b border-border mb-1">
                    <span className="text-xs font-medium text-text">Select columns</span>
                    <button
                      onClick={handleAllOrReset}
                      className="text-xs text-amber-600 hover:underline"
                    >
                      {selCount === totalCols ? "Reset" : "All"}
                    </button>
                  </div>
                  {csvColumns.map((col, i) => (
                    <button
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
                      <p className="text-[10px] text-text-muted mb-0.5">Preview (row 1):</p>
                      <p className="text-[10px] text-text-secondary font-mono truncate">{previewRow}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {csvRows && csvRows.length > 0 && (
            <span className="text-xs text-text-muted bg-surface/50 px-2 py-1 rounded-lg border border-border">
              {csvRows.length.toLocaleString()} rows
            </span>
          )}
          {value && (
            <button
              onClick={clearInput}
              className="p-1 hover:bg-surface-alt/50 rounded-lg transition-colors ml-auto"
              title="Clear"
            >
              <X size={13} className="text-text-muted" />
            </button>
          )}
        </div>
      )}

      {/* Textarea container */}
      <div
        className="relative rounded-xl transition-all duration-300 overflow-hidden w-full"
        style={{ height: csvColumns ? "420px" : "460px" }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div
          className={`absolute inset-0 rounded-xl transition-all duration-300 ${
            dragOver
              ? "ring-2 ring-primary/50 bg-primary/5"
              : "glass hover:border-border-active"
          }`}
        />
        <textarea
          value={value}
          onChange={(e) => { onChange(e.target.value); setFileName(null); setCsvColumns(null); }}
          placeholder={placeholder}
          className="relative w-full h-full p-5 bg-transparent resize-none outline-none text-[15px] font-mono leading-7 text-text placeholder:text-text-muted/40"
          spellCheck={false}
        />
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-xl pointer-events-none">
            <div className="flex flex-col items-center gap-2">
              <Upload size={28} className="text-primary" />
              <p className="text-primary font-semibold text-base">Drop file here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
