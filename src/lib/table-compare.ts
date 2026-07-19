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

export function compareTables(
  tableA: TableData,
  tableB: TableData,
  keyColumnsA: number[],
  keyColumnsB: number[],
  partialOptions: Partial<CompareOptions> = {}
): TableCompareResult {
  const options = { ...DEFAULT_OPTIONS, ...partialOptions };
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

  const columnPairs = tableA.headers.map((header, indexA) => ({
    header,
    indexA,
    indexB: tableB.headers.indexOf(header),
  })).filter((pair) => pair.indexB >= 0);

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
      return normalizeItem(before, options) === normalizeItem(after, options)
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
