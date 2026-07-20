import { DEFAULT_OPTIONS, normalizeItem, type CompareOptions } from "@/lib/compare";

export interface TableData {
  headers: string[];
  rows: string[][];
  fileName?: string;
}

export interface FieldChange {
  column: string;
  before: string;
  after: string;
}

export interface ChangedRow {
  key: string;
  before: string[];
  after: string[];
  changes: FieldChange[];
}

export interface TableCompareResult {
  added: string[][];
  removed: string[][];
  changed: ChangedRow[];
  unchanged: string[][];
  stats: {
    added: number;
    removed: number;
    changed: number;
    unchanged: number;
    duplicateKeysA: number;
    duplicateKeysB: number;
  };
}

export interface TableColumnMapping {
  indexA: number;
  indexB: number;
}

export interface TableCompareRules {
  columnMappings: TableColumnMapping[];
  numericTolerance: number;
  normalizeDates: boolean;
  emptyValuesEqual: boolean;
  ignorePunctuation: boolean;
}

export const DEFAULT_TABLE_RULES: TableCompareRules = {
  columnMappings: [],
  numericTolerance: 0,
  normalizeDates: false,
  emptyValuesEqual: false,
  ignorePunctuation: false,
};

function normalizeHeader(header: string): string {
  return header
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[_\-.]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function headerSimilarity(headerA: string, headerB: string): number {
  const left = normalizeHeader(headerA);
  const right = normalizeHeader(headerB);
  if (!left || !right) return 0;
  if (left === right) return 1;
  const tokensA = new Set(left.split(" "));
  const tokensB = new Set(right.split(" "));
  const common = [...tokensA].filter((token) => tokensB.has(token)).length;
  const union = new Set([...tokensA, ...tokensB]).size;
  return union > 0 ? common / union : 0;
}

export function suggestColumnMappings(tableA: TableData, tableB: TableData): TableColumnMapping[] {
  const unusedB = new Set(tableB.headers.map((_, index) => index));
  const mappings: TableColumnMapping[] = [];
  for (let indexA = 0; indexA < tableA.headers.length; indexA += 1) {
    let bestIndex = -1;
    let bestScore = 0;
    for (const indexB of unusedB) {
      const score = headerSimilarity(tableA.headers[indexA] ?? "", tableB.headers[indexB] ?? "");
      if (score > bestScore) {
        bestScore = score;
        bestIndex = indexB;
      }
    }
    if (bestIndex >= 0 && bestScore >= 0.5) {
      mappings.push({ indexA, indexB: bestIndex });
      unusedB.delete(bestIndex);
    }
  }
  return mappings;
}

export function suggestKeyColumns(table: TableData): number[] {
  if (table.headers.length === 0) return [];
  const rowCount = Math.max(1, table.rows.length);
  let bestIndex = 0;
  let bestScore = -1;
  table.headers.forEach((header, index) => {
    const values = table.rows.map((row) => row[index]?.trim() ?? "").filter(Boolean);
    const uniqueRatio = new Set(values).size / rowCount;
    const completeness = values.length / rowCount;
    const normalizedHeader = normalizeHeader(header);
    const identifierBonus = /(^|\s)(id|key|code|sku|email|uuid|number|no)(\s|$)/u.test(normalizedHeader) ? 0.25 : 0;
    const score = uniqueRatio * 0.7 + completeness * 0.3 + identifierBonus;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  return [bestIndex];
}

function rowKey(row: string[], columns: number[], options: CompareOptions): string {
  return columns.map((index) => normalizeItem(row[index] ?? "", options)).join("\u001f");
}

function duplicateKeyCount(table: TableData, columns: number[], options: CompareOptions): number {
  const seen = new Set<string>();
  let duplicates = 0;
  for (const row of table.rows) {
    const key = rowKey(row, columns, options);
    if (seen.has(key)) duplicates += 1;
    else seen.add(key);
  }
  return duplicates;
}

function emptyLike(value: string): boolean {
  return ["", "null", "undefined", "n/a", "na", "-"].includes(value.trim().toLocaleLowerCase());
}

function numericValue(value: string): number | null {
  const trimmed = value.trim().replace(/,/g, "");
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(trimmed)) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function dateValue(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed || !/[\d]/.test(trimmed)) return null;
  const parsed = Date.parse(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function valuesEqual(before: string, after: string, options: CompareOptions, rules: TableCompareRules): boolean {
  if (rules.emptyValuesEqual && emptyLike(before) && emptyLike(after)) return true;

  if (rules.numericTolerance > 0) {
    const left = numericValue(before);
    const right = numericValue(after);
    if (left !== null && right !== null && Math.abs(left - right) <= rules.numericTolerance) return true;
  }

  if (rules.normalizeDates) {
    const left = dateValue(before);
    const right = dateValue(after);
    if (left !== null && right !== null && left === right) return true;
  }

  const prepare = (value: string) => rules.ignorePunctuation
    ? value.replace(/[\p{P}\p{S}]+/gu, " ").replace(/\s+/g, " ")
    : value;
  return normalizeItem(prepare(before), options) === normalizeItem(prepare(after), options);
}

export function compareTables(
  tableA: TableData,
  tableB: TableData,
  keyColumnsA: number[],
  keyColumnsB: number[],
  partialOptions: Partial<CompareOptions> = {},
  partialRules: Partial<TableCompareRules> = {}
): TableCompareResult {
  const options = { ...DEFAULT_OPTIONS, ...partialOptions };
  const rules = { ...DEFAULT_TABLE_RULES, ...partialRules };
  if (keyColumnsA.length === 0 || keyColumnsB.length === 0) {
    throw new Error("At least one key column is required for each table.");
  }

  const rowsByKeyB = new Map<string, string[][]>();
  for (const row of tableB.rows) {
    const key = rowKey(row, keyColumnsB, options);
    const bucket = rowsByKeyB.get(key) ?? [];
    bucket.push(row);
    rowsByKeyB.set(key, bucket);
  }

  const configuredMappings = partialRules.columnMappings !== undefined
    ? rules.columnMappings
    : suggestColumnMappings(tableA, tableB);
  const columnPairs = configuredMappings
    .filter(({ indexA, indexB }) => indexA >= 0 && indexA < tableA.headers.length && indexB >= 0 && indexB < tableB.headers.length)
    .map(({ indexA, indexB }) => ({
      header: tableA.headers[indexA] === tableB.headers[indexB]
        ? (tableA.headers[indexA] || `#${indexA + 1}`)
        : `${tableA.headers[indexA] || `#${indexA + 1}`} ↔ ${tableB.headers[indexB] || `#${indexB + 1}`}`,
      indexA,
      indexB,
    }));

  const removed: string[][] = [];
  const changed: ChangedRow[] = [];
  const unchanged: string[][] = [];

  for (const rowA of tableA.rows) {
    const key = rowKey(rowA, keyColumnsA, options);
    const bucket = rowsByKeyB.get(key);
    const rowB = bucket?.shift();
    if (!rowB) {
      removed.push(rowA);
      continue;
    }

    const changes = columnPairs.flatMap(({ header, indexA, indexB }) => {
      const before = rowA[indexA] ?? "";
      const after = rowB[indexB] ?? "";
      return valuesEqual(before, after, options, rules)
        ? []
        : [{ column: header, before, after }];
    });

    if (changes.length > 0) {
      changed.push({
        key: keyColumnsA.map((index) => rowA[index] ?? "").join(" | "),
        before: rowA,
        after: rowB,
        changes,
      });
    } else {
      unchanged.push(rowA);
    }
  }

  const added = Array.from(rowsByKeyB.values()).flat();
  return {
    added,
    removed,
    changed,
    unchanged,
    stats: {
      added: added.length,
      removed: removed.length,
      changed: changed.length,
      unchanged: unchanged.length,
      duplicateKeysA: duplicateKeyCount(tableA, keyColumnsA, options),
      duplicateKeysB: duplicateKeyCount(tableB, keyColumnsB, options),
    },
  };
}
